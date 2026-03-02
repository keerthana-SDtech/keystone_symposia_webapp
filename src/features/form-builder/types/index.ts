export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'password' | 'email';

export interface FieldValidation {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    format?: 'email' | 'url';
}

export interface FieldOption {
    id: string | number;
    label: string;
}

export interface FormField {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    validation?: FieldValidation;
    required?: boolean;
    options?: FieldOption[];
    layout?: 'full' | 'half';
    format?: string;
}

export interface FormSection {
    sectionTitle: string;
    fields?: FormField[];
    subsections?: FormSection[];
}

export type FormConfig = FormSection[];
