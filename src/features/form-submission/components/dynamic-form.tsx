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

const collectScopeKeys = (el: any): string[] => {
    if (!el) return [];
    if (el.type === "Control" && el.scope) return [scopeToKey(el.scope as string)];
    if (el.elements) return (el.elements as any[]).flatMap(collectScopeKeys);
    return [];
};

// ─── Layout Renderers ─────────────────────────────────────────────────────────
// Uses JsonFormsDispatch so children share the SAME form context (fixes uneditable fields)

const VerticalLayoutComponent = (props: LayoutProps) => {
    const { uischema, schema, path, renderers, cells, visible } = props;
    if (!visible) return null;
    const elements: UISchemaElement[] = (uischema as any).elements ?? [];

    return (
        <div className="flex flex-col gap-6">
            {elements.map((el, i) => (
                <JsonFormsDispatch
                    key={i}
                    schema={schema}
                    uischema={el}
                    path={path}
                    renderers={renderers}
                    cells={cells}
                />
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
                <JsonFormsDispatch
                    key={i}
                    schema={schema}
                    uischema={el}
                    path={path}
                    renderers={renderers}
                    cells={cells}
                />
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
            {hasError && (
                <p className="text-[11px] text-red-500 font-semibold px-1">{errors}</p>
            )}
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
            {hasError && (
                <p className="text-[11px] text-red-500 font-semibold px-1">{errors}</p>
            )}
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
            <Select
                value={(data as string) ?? ""}
                onValueChange={(val) => handleChange(path, val)}
            >
                <SelectTrigger
                    className={`h-11 w-full bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] ${hasError ? "border-red-500 bg-red-50/50" : "hover:border-gray-300"}`}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                            {opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hasError && (
                <p className="text-[11px] text-red-500 font-semibold px-1">{errors}</p>
            )}
        </div>
    );
};

const InputRenderer = withJsonFormsControlProps(InputComponent);
const TextareaRenderer = withJsonFormsControlProps(TextareaComponent);
const SelectRenderer = withJsonFormsControlProps(SelectComponent);

// Tester helpers
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
    validateActiveSection: () => Promise<boolean>;
    validateAll: () => Promise<Record<string, number>>;
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

        // Always-current ref to avoid stale closures in the imperative handle
        const formDataRef = useRef<Record<string, unknown>>(formData);
        formDataRef.current = formData;

        const handleChange = useCallback(
            ({ data: newData, errors }: { data: Record<string, unknown>; errors?: any[] }) => {
                setFormData(newData);
                formDataRef.current = newData;

                if (activeSectionId && onActiveSectionValidChange) {
                    const activeSection = sections.find((s) => s.id === activeSectionId);
                    if (activeSection) {
                        const sectionKeys = collectScopeKeys(activeSection.uischema);
                        const activeErrors = (errors ?? []).filter((e: any) =>
                            sectionKeys.includes(scopeToKey(e.instancePath ?? ""))
                        );
                        onActiveSectionValidChange(activeErrors.length === 0);
                    }
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

                    const activeSection = sections.find((s) => s.id === activeSectionId);
                    if (!activeSection) return true;

                    const sectionKeys = collectScopeKeys(activeSection.uischema);
                    const required = (schema.required ?? []) as string[];
                    const missing = sectionKeys.filter(
                        (k) => required.includes(k) && !formDataRef.current[k]
                    );
                    return missing.length === 0;
                },

                validateAll: async () => {
                    const all: Record<string, boolean> = {};
                    sections.forEach((s) => (all[s.id] = true));
                    setShowValidation(all);

                    const required = (schema.required ?? []) as string[];
                    const result: Record<string, number> = {};
                    for (const section of sections) {
                        const keys = collectScopeKeys(section.uischema);
                        result[section.id] = keys.filter(
                            (k) => required.includes(k) && !formDataRef.current[k]
                        ).length;
                    }
                    return result;
                },

                submitForm: () => {
                    onSubmit(formDataRef.current);
                },
            }),
            [activeSectionId, onSubmit, schema.required, sections]
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
                        <div
                            key={section.id}
                            id={section.id}
                            className={isHidden ? "hidden" : "pb-12"}
                        >
                            <JsonForms
                                schema={schema}
                                uischema={section.uischema}
                                data={formData}
                                renderers={customRenderers}
                                onChange={handleChange}
                                validationMode={
                                    showValidation[section.id]
                                        ? "ValidateAndShow"
                                        : "ValidateAndHide"
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
