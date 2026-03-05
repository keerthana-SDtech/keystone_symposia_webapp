import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    useCallback,
} from "react";
import { JsonForms, JsonFormsDispatch, withJsonFormsControlProps, withJsonFormsLayoutProps } from "@jsonforms/react";
import {
    rankWith,
    isStringControl,
    and,
    schemaMatches,
    uiTypeIs,
    type ControlProps,
    type LayoutProps,
    type UISchemaElement,
} from "@jsonforms/core";
import type { FormDefinition } from "../../form-builder/types";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const scopeToKey = (scope: string) => scope.split("/").pop() ?? scope;

/** Recursively collect all property keys referenced in a uischema tree */
const collectScopeKeys = (el: any): string[] => {
    if (!el) return [];
    if (el.type === "Control" && el.scope) return [scopeToKey(el.scope as string)];
    if (el.elements) return (el.elements as any[]).flatMap(collectScopeKeys);
    return [];
};

/**
 * Extract a field key from an AJV error.
 * - Property-level errors (minLength, format, …): instancePath = "/fieldName"
 * - Required errors: instancePath = "" + params.missingProperty = "fieldName"
 */
const getAjvErrorKey = (e: any): string | null => {
    if (e.instancePath && e.instancePath !== "") {
        return scopeToKey(e.instancePath as string);
    }
    if (e.keyword === "required" && e.params?.missingProperty) {
        return e.params.missingProperty as string;
    }
    return null;
};

/**
 * Count validation errors for a section using the schema directly.
 * Checks required + minLength so we don't depend on a second Ajv instance.
 */
function countSchemaErrors(
    sectionKeys: string[],
    data: Record<string, unknown>,
    schema: any
): number {
    const required: string[] = schema.required ?? [];
    const properties: Record<string, any> = schema.properties ?? {};
    let count = 0;
    for (const key of sectionKeys) {
        const value = data[key];
        const isEmpty = value === undefined || value === null || value === "";
        if (required.includes(key) && isEmpty) { count++; continue; }
        const prop = properties[key];
        if (prop?.minLength && typeof value === "string" && value.length < prop.minLength) count++;
    }
    return count;
}

// ─── Layout Renderers ─────────────────────────────────────────────────────────

const VerticalLayoutComponent = (props: LayoutProps) => {
    const { uischema, schema, path, renderers, cells, visible } = props;
    if (!visible) return null;
    const elements: UISchemaElement[] = (uischema as any).elements ?? [];
    return (
        <div className="flex flex-col gap-6">
            {elements.map((el, i) => (
                <JsonFormsDispatch key={i} schema={schema} uischema={el} path={path} renderers={renderers} cells={cells} />
            ))}
        </div>
    );
};

const HorizontalLayoutComponent = (props: LayoutProps) => {
    const { uischema, schema, path, renderers, cells, visible } = props;
    if (!visible) return null;
    const elements: UISchemaElement[] = (uischema as any).elements ?? [];
    return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            {elements.map((el, i) => (
                <JsonFormsDispatch key={i} schema={schema} uischema={el} path={path} renderers={renderers} cells={cells} />
            ))}
        </div>
    );
};

const VerticalLayoutRenderer = withJsonFormsLayoutProps(VerticalLayoutComponent);
const HorizontalLayoutRenderer = withJsonFormsLayoutProps(HorizontalLayoutComponent);

// ─── Field Renderers ──────────────────────────────────────────────────────────

const InputComponent = (props: ControlProps) => {
    const { path, label, data, handleChange, errors, schema, uischema, required } = props;
    const inputType = (schema as any).format === "email" ? "email" : "text";
    const placeholder = (uischema as any).options?.placeholder ?? "";
    const hasError = !!errors;
    return (
        <div className="space-y-2 flex flex-col items-start w-full">
            <Label htmlFor={path} className="text-[13px] font-semibold text-[#111827]">
                {label}
                {required && <span className="text-red-500 ml-1 font-bold">*</span>}
            </Label>
            <Input
                id={path}
                type={inputType}
                placeholder={placeholder}
                value={(data as string) ?? ""}
                onChange={(e) => handleChange(path, e.target.value)}
                className={`h-11 bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] ${hasError ? "border-red-500 bg-red-50/50" : "hover:border-gray-300"}`}
            />
            {hasError && <p className="text-[11px] text-red-500 font-semibold px-1">{errors}</p>}
        </div>
    );
};

const TextareaComponent = (props: ControlProps) => {
    const { path, label, data, handleChange, errors, uischema, required } = props;
    const placeholder = (uischema as any).options?.placeholder ?? "";
    const hasError = !!errors;
    return (
        <div className="space-y-2 flex flex-col items-start w-full">
            <Label htmlFor={path} className="text-[13px] font-semibold text-[#111827]">
                {label}
                {required && <span className="text-red-500 ml-1 font-bold">*</span>}
            </Label>
            <Textarea
                id={path}
                placeholder={placeholder}
                value={(data as string) ?? ""}
                onChange={(e) => handleChange(path, e.target.value)}
                rows={4}
                className={`w-full bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] ${hasError ? "border-red-500 bg-red-50/50" : "hover:border-gray-300"}`}
            />
            {hasError && <p className="text-[11px] text-red-500 font-semibold px-1">{errors}</p>}
        </div>
    );
};

const SelectComponent = (props: ControlProps) => {
    const { path, label, data, handleChange, errors, schema, uischema, required } = props;
    const options = (schema.enum as string[]) ?? [];
    const placeholder = (uischema as any).options?.placeholder ?? "Select an option";
    const hasError = !!errors;
    return (
        <div className="space-y-2 flex flex-col items-start w-full">
            <Label htmlFor={path} className="text-[13px] font-semibold text-[#111827]">
                {label}
                {required && <span className="text-red-500 ml-1 font-bold">*</span>}
            </Label>
            <Select value={(data as string) ?? ""} onValueChange={(val) => handleChange(path, val)}>
                <SelectTrigger className={`h-11 w-full bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] ${hasError ? "border-red-500 bg-red-50/50" : "hover:border-gray-300"}`}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hasError && <p className="text-[11px] text-red-500 font-semibold px-1">{errors}</p>}
        </div>
    );
};

const InputRenderer = withJsonFormsControlProps(InputComponent);
const TextareaRenderer = withJsonFormsControlProps(TextareaComponent);
const SelectRenderer = withJsonFormsControlProps(SelectComponent);

const isMultiString = and(
    isStringControl,
    (_schema: any, uischema: any) => uischema?.options?.multi === true
);
const isEnumControl = and(
    isStringControl,
    schemaMatches((s: any) => Array.isArray(s.enum))
);

const customRenderers = [
    { tester: rankWith(20, uiTypeIs("VerticalLayout")), renderer: VerticalLayoutRenderer },
    { tester: rankWith(20, uiTypeIs("HorizontalLayout")), renderer: HorizontalLayoutRenderer },
    { tester: rankWith(10, isMultiString), renderer: TextareaRenderer },
    { tester: rankWith(9, isEnumControl), renderer: SelectRenderer },
    { tester: rankWith(2, isStringControl), renderer: InputRenderer },
];

// ─── Public Interface ─────────────────────────────────────────────────────────

export interface DynamicFormRef {
    /** Validates the active section. Returns true if valid. */
    validateActiveSection: () => Promise<boolean>;
    /** Validates ALL sections. Returns sectionId → error count. */
    validateAll: () => Promise<Record<string, number>>;
    /** Programmatically submit the current form data. */
    submitForm: () => void;
}

interface DynamicFormProps {
    definition: FormDefinition;
    onSubmit: (data: Record<string, unknown>) => void;
    isSubmitting?: boolean;
    hideSubmitButton?: boolean;
    id?: string;
    activeSectionId?: string;
    onActiveSectionValidChange?: (isValid: boolean) => void;
    initialValues?: Record<string, string>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(
    (
        {
            definition,
            onSubmit,
            isSubmitting,
            hideSubmitButton,
            id,
            activeSectionId,
            onActiveSectionValidChange,
            initialValues,
        },
        ref
    ) => {
        const { schema, sections } = definition;

        const [formData, setFormData] = useState<Record<string, unknown>>(
            (initialValues as Record<string, unknown>) ?? {}
        );
        const [showValidation, setShowValidation] = useState<Record<string, boolean>>({});

        // Always-current ref for formData
        const formDataRef = useRef<Record<string, unknown>>(formData);
        formDataRef.current = formData;

        // Track AJV errors from JsonForms onChange — partitioned by sectionId
        const ajvErrorsRef = useRef<Record<string, any[]>>({});

        const handleChange = useCallback(
            ({ data: newData, errors }: { data: Record<string, unknown>; errors?: any[] }) => {
                setFormData(newData);
                formDataRef.current = newData;

                // Partition errors by section using the fixed getAjvErrorKey helper
                const bySection: Record<string, any[]> = {};
                for (const section of sections) {
                    const sectionKeys = new Set(collectScopeKeys(section.uischema));
                    bySection[section.id] = (errors ?? []).filter((e: any) => {
                        const key = getAjvErrorKey(e);
                        return key !== null && sectionKeys.has(key);
                    });
                }
                ajvErrorsRef.current = bySection;

                if (activeSectionId && onActiveSectionValidChange) {
                    const activeErrors = bySection[activeSectionId] ?? [];
                    onActiveSectionValidChange(activeErrors.length === 0);
                }
            },
            [activeSectionId, onActiveSectionValidChange, sections]
        );

        useImperativeHandle(
            ref,
            () => ({
                validateActiveSection: async () => {
                    if (!activeSectionId) return true;
                    setShowValidation((prev) => ({ ...prev, [activeSectionId]: true }));

                    // Primary: use errors from JsonForms' own AJV (via onChange)
                    const tracked = ajvErrorsRef.current[activeSectionId] ?? [];
                    if (tracked.length > 0) return false;

                    // Fallback for untouched fields: direct schema check
                    const activeSection = sections.find((s) => s.id === activeSectionId);
                    if (!activeSection) return true;
                    const keys = collectScopeKeys(activeSection.uischema);
                    return countSchemaErrors(keys, formDataRef.current, schema) === 0;
                },

                validateAll: async () => {
                    // Show validation UI on all sections
                    const all: Record<string, boolean> = {};
                    sections.forEach((s) => (all[s.id] = true));
                    setShowValidation(all);

                    const result: Record<string, number> = {};
                    for (const section of sections) {
                        const keys = collectScopeKeys(section.uischema);
                        // Use tracked AJV errors (from onChange) — these are the most accurate
                        const tracked = (ajvErrorsRef.current[section.id] ?? []).length;
                        // Fallback: direct schema check for untouched fields
                        const schema_ = countSchemaErrors(keys, formDataRef.current, schema);
                        // Take the max so we never under-report
                        result[section.id] = Math.max(tracked, schema_);
                    }
                    return result;
                },

                submitForm: () => {
                    onSubmit(formDataRef.current);
                },
            }),
            [activeSectionId, onSubmit, schema, sections]
        );

        return (
            <form
                id={id}
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(formDataRef.current);
                }}
                className="w-full"
            >
                {sections.map((section) => {
                    const isHidden = activeSectionId && activeSectionId !== section.id;
                    return (
                        <div key={section.id} id={section.id} className={isHidden ? "hidden" : "pb-12"}>
                            <JsonForms
                                schema={schema}
                                uischema={section.uischema}
                                data={formData}
                                renderers={customRenderers}
                                onChange={handleChange}
                                validationMode={
                                    showValidation[section.id] ? "ValidateAndShow" : "ValidateAndHide"
                                }
                            />
                        </div>
                    );
                })}

                {!hideSubmitButton && (
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 text-[15px] font-bold rounded-xl shadow-lg transition-all disabled:opacity-60"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Proposal"}
                        </button>
                    </div>
                )}
            </form>
        );
    }
);

DynamicForm.displayName = "DynamicForm";
