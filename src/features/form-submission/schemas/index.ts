import { z } from "zod";
import type { FormConfig, FormField } from "../../form-builder/types";

export const generateZodSchema = (config: FormConfig) => {
    const schemaFields: Record<string, any> = {};

    const processField = (field: FormField) => {
        let baseSchema = z.string();

        const isRequired = field.required || field.validation?.required;

        if (isRequired) {
            baseSchema = baseSchema.min(1, "Required");
        }

        if (field.validation) {
            if (field.validation.minLength) {
                baseSchema = baseSchema.min(field.validation.minLength, `${field.label} must be at least ${field.validation.minLength} characters`);
            }
            if (field.validation.maxLength) {
                baseSchema = baseSchema.max(field.validation.maxLength, `${field.label} must be at most ${field.validation.maxLength} characters`);
            }
        }

        if (field.format === 'email') {
            baseSchema = baseSchema.email("Invalid email address");
        }

        let finalSchema: any;
        if (isRequired) {
            finalSchema = baseSchema;
        } else {
            // If not required, allow empty string or undefined
            finalSchema = baseSchema.optional().or(z.literal(""));
        }

        schemaFields[field.name] = finalSchema;
    };

    const processSection = (section: any) => {
        if (section.fields) {
            section.fields.forEach(processField);
        }
        if (section.subsections) {
            section.subsections.forEach(processSection);
        }
    };

    config.forEach(processSection);

    return z.object(schemaFields);
};
