import { useMemo, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { JsonForms } from '@jsonforms/react';
import type { ErrorObject } from 'ajv';
import type { ValidationMode } from '@jsonforms/core';
import type { FormDefinition } from '../../form-builder/types';
import { extractUiSchemaFields } from '../../json-forms/utils/extract-schema-fields';
import { isStepValid } from '../../json-forms/utils/step-validation';
import { customRenderers } from '../../json-forms/renderers/renderers';
import { Button } from '../../../components/ui/button';

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

export const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(
  ({ definition, onSubmit, isSubmitting, hideSubmitButton, id, activeSectionId, onActiveSectionValidChange }, ref) => {
    const [data, setData] = useState<any>({});
    const [errors, setErrors] = useState<ErrorObject[]>([]);
    const [validationMode, setValidationMode] = useState<ValidationMode>('ValidateAndHide');

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

    // Reset validation display when the active section changes
    useEffect(() => {
      setValidationMode('ValidateAndHide');
    }, [activeSectionId]);

    // Notify parent whether the active section is currently valid
    useEffect(() => {
      if (!onActiveSectionValidChange) return;
      onActiveSectionValidChange(isStepValid(errors, activeSectionFields));
    }, [errors, activeSectionFields, onActiveSectionValidChange]);

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
