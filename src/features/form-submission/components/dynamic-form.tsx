import { useMemo, forwardRef, useImperativeHandle, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateZodSchema } from "../schemas";
import type { FormConfig, FormField } from "../../form-builder/types";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../../components/ui/select";

export interface DynamicFormRef {
  validateActiveSection: () => Promise<boolean>;
  submitForm: () => void;
}

interface DynamicFormProps {
  definition: FormDefinition;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  hideSubmitButton?: boolean;
  id?: string;
  activeSectionId?: string;
  onActiveSectionValidChange?: (isValid: boolean) => void;
}

const getAutoCompleteValue = (field: FormField, formId?: string) => {
    const name = field.name.toLowerCase();
    const type = field.type;
    const format = field.format || (field.validation as any)?.format;

    // type="password" + login form → "current-password"
    // type="password" + signup form → "new-password"
    if (type === 'password' || name.includes('password')) {
        const isLogin = formId?.toLowerCase().includes('login');
        const isSignup = formId?.toLowerCase().includes('signup') || formId?.toLowerCase().includes('register');

        if (isLogin) return "current-password";
        if (isSignup) return "new-password";
        return name.includes('new') ? 'new-password' : 'current-password';
    }

    if (format === 'email' || name.includes('email')) {
        return "email";
    }

    if (name.includes('first')) {
        return "given-name";
    }

    if (name.includes('last')) {
        return "family-name";
    }

    return "off";
};

const extractFieldNames = (section: any): string[] => {
    let names: string[] = [];
    if (section.fields) {
        names = names.concat(section.fields.map((f: any) => f.name));
    }
    if (section.subsections) {
        section.subsections.forEach((sub: any) => {
            names = names.concat(extractFieldNames(sub));
        });
    }
    return names;
};

import { useEffect } from "react";

export const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(({ config, onSubmit, isSubmitting, hideSubmitButton, id, activeSectionId, onActiveSectionValidChange }, ref) => {
    const schema = useMemo(() => generateZodSchema(config), [config]);

    const defaultValues = useMemo(() => {
        const defaults: Record<string, any> = {};
        config.forEach(section => {
            extractFieldNames(section).forEach(name => {
                defaults[name] = "";
            });
        });
        return defaults;
    }, [config]);

    const { register, handleSubmit, control, formState: { errors }, trigger, watch } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues
    });

    const values = watch();
    const [debouncedValues, setDebouncedValues] = useState<any>({});

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValues(values);
        }, 300);
        return () => clearTimeout(timer);
    }, [values]);

    // Reset validation display when the active section changes
    useEffect(() => {
      setValidationMode('ValidateAndHide');
    }, [activeSectionId]);

    const activeSection = useMemo(
      () => definition.sections.find((s) => s.id === activeSectionId),
      [definition.sections, activeSectionId]
    );

    const activeSectionFields = useMemo(
      () => (activeSection ? extractUiSchemaFields(activeSection.uischema) : []),
      [activeSection]
    );

    const activeSectionRequired = useMemo(() => {
      const allRequired = (definition.schema.required as string[]) ?? [];
      return activeSectionFields.filter((f) => allRequired.includes(f));
    }, [activeSectionFields, definition.schema.required]);

        try {
            const subSchema = (schema as any).pick(pickObj);
            const result = subSchema.safeParse(debouncedValues);
            onActiveSectionValidChange(result.success);
        } catch (e) {
            console.error(e);
        }
    }, [activeSectionId, config, schema, debouncedValues, onActiveSectionValidChange]);

    useImperativeHandle(ref, () => ({
      validateActiveSection: async () => {
        setValidationMode('ValidateAndShow');
        const missingRequired = activeSectionRequired.filter((n) => !data[n]);
        return isStepValid(errors, activeSectionFields) && missingRequired.length === 0;
      },
      submitForm: () => {
        setValidationMode('ValidateAndShow');
        onSubmit(data);
      },
    }));

    const activeUiSchema = activeSection
      ? activeSection.uischema
      : definition.sections[0]?.uischema;

    const handleChange = ({ data: newData, errors: newErrors }: { data: any; errors: ErrorObject[] }) => {
      setData(newData ?? {});
      setErrors(newErrors ?? []);
    };

    return (
      <form
        id={id}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(data);
        }}
        className="w-full"
      >
        <JsonForms
          schema={definition.schema}
          uischema={activeUiSchema}
          data={data}
          renderers={customRenderers}
          onChange={handleChange}
          validationMode={validationMode}
        />

        {!hideSubmitButton && (
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-bold rounded-xl shadow-lg transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </Button>
          </div>
        )}
      </form>
    );
  }
);

DynamicForm.displayName = 'DynamicForm';
