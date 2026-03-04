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
}

interface DynamicFormProps {
    config: FormConfig;
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

    useEffect(() => {
        if (!activeSectionId || !onActiveSectionValidChange) return;

        const activeSection = config.find(s => s.sectionTitle.toLowerCase().replace(/\s+/g, '-') === activeSectionId);
        if (!activeSection) return;

        const fieldNames = extractFieldNames(activeSection);
        if (fieldNames.length === 0) {
            onActiveSectionValidChange(true);
            return;
        }

        const pickObj: Record<string, true> = {};
        fieldNames.forEach(f => { pickObj[f] = true; });

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
            if (!activeSectionId) return true;
            const activeSection = config.find(s => s.sectionTitle.toLowerCase().replace(/\s+/g, '-') === activeSectionId);
            if (!activeSection) return true;

            const fieldNames = extractFieldNames(activeSection);
            if (fieldNames.length === 0) return true;

            const result = await trigger(fieldNames);
            return result;
        }
    }), [activeSectionId, config, trigger]);

    const renderField = (field: FormField) => {
        const error = errors[field.name];

        return (
            <div key={field.name} className={`space-y-2 flex flex-col items-start ${field.layout === 'half' ? 'col-span-1' : 'col-span-full'}`}>
                <Label htmlFor={field.name} className="text-[13px] font-semibold text-[#111827]">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                </Label>

                {(field.type === 'text' || field.type === 'password' || field.type === 'email') && (
                    <Input
                        id={field.name}
                        type={field.type}
                        autoComplete={getAutoCompleteValue(field, id)}
                        placeholder={field.placeholder}
                        {...register(field.name)}
                        className={`h-11 bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] ${error ? "border-red-500 bg-red-50/50" : "hover:border-gray-300"}`}
                    />
                )}

                {field.type === 'textarea' && (
                    <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        {...register(field.name)}
                        className={`bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] ${error ? "border-red-500 bg-red-50/50" : "hover:border-gray-300"}`}
                        rows={4}
                    />
                )}

                {field.type === 'select' && field.options && (
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Select onValueChange={onChange} value={(value as string) || ""}>
                                <SelectTrigger className={`h-11 bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] ${error ? "border-red-500 bg-red-50/50" : "hover:border-gray-300"}`}>
                                    <SelectValue placeholder={(field.placeholder as string) || "Select an option"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((opt) => (
                                        <SelectItem key={opt.id} value={opt.label}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                )}

                {error && (
                    <p className="text-[11px] text-red-500 font-semibold px-1">
                        {error.message as string}
                    </p>
                )}
            </div>
        );
    };

    const renderSection = (section: any, isSubsection = false) => (
        <div key={section.sectionTitle} className={isSubsection ? "mt-8" : "space-y-8"}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                {section.fields?.map(renderField)}
            </div>
            {section.subsections?.map((sub: any) => renderSection(sub, true))}
        </div>
    );

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full">
            {config.map((section) => {
                const sectionId = section.sectionTitle.toLowerCase().replace(/\s+/g, '-');
                const isHidden = activeSectionId && activeSectionId !== sectionId;

                return (
                    <div
                        key={section.sectionTitle}
                        id={sectionId}
                        className={isHidden ? 'hidden' : "pb-12"}
                    >
                        {renderSection(section)}
                    </div>
                );
            })}

            {!hideSubmitButton && (
                <div className="flex justify-end pt-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-bold rounded-xl shadow-lg transition-all"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Proposal"}
                    </Button>
                </div>
            )}
        </form>
    );
});
