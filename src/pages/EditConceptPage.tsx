import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, FileText, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { PageShell } from "../components/layout/PageShell";
import { DynamicForm, type DynamicFormRef } from "../features/form-submission/components/dynamic-form";
import { useEditConcept } from "../features/keystone-actions/hooks/useEditConcept";

export default function EditConceptPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const formRef = useRef<DynamicFormRef>(null);
    const { config, initialValues, isLoading, isSaving, error, saveForm } = useEditConcept(id!);
    const [activeSection, setActiveSection] = useState("");
    const [sectionErrors, setSectionErrors] = useState<Record<string, number>>({});

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !config) {
        return (
            <PageShell className="flex items-center justify-center bg-[#f9fafb]">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error || "Something went wrong."}</p>
                    <Button onClick={() => navigate(`/dashboard/${id}`)} className="bg-primary hover:bg-primary/90">
                        Go Back
                    </Button>
                </div>
            </PageShell>
        );
    }

    const sections = config.map(s => ({
        id: s.sectionTitle.toLowerCase().replace(/\s+/g, '-'),
        label: s.sectionTitle,
    }));

    const currentSection = activeSection || sections[0]?.id || "";

    const handleSave = async () => {
        const errors = await formRef.current?.validateAll();
        if (errors) {
            setSectionErrors(errors);
            const hasErrors = Object.values(errors).some(c => c > 0);
            if (hasErrors) return;
        }
        const form = document.getElementById('edit-concept-form') as HTMLFormElement | null;
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    };

    const handleSubmit = async (data: Record<string, unknown>) => {
        const ok = await saveForm(data);
        if (ok) navigate(`/dashboard/${id}`);
    };

    return (
        <PageShell className="bg-[#f9fafb] min-h-screen pb-24">
            <div className="w-full max-w-[1100px] mx-auto pt-8 px-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-8">
                    <button
                        onClick={() => navigate(`/dashboard/${id}`)}
                        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-[26px] font-bold text-[#111827]">Edit Concept</h1>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-[220px] shrink-0 bg-white rounded-[10px] border border-gray-200 p-4 h-fit">
                        <p className="text-[13px] font-semibold text-gray-700 mb-4">Sections</p>
                        <hr className="border-gray-100 mb-4" />
                        <nav className="flex flex-col gap-1">
                            {sections.map(s => {
                                const isActive = (currentSection === s.id);
                                const errCount = sectionErrors[s.id] ?? 0;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSection(s.id)}
                                        className={`text-left px-3 py-2.5 rounded-md transition-colors border-l-[3px] ${
                                            isActive
                                                ? 'border-[#581585] bg-purple-50/50 text-[#581585]'
                                                : 'border-transparent text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 text-[13px] font-medium">
                                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#581585]' : 'bg-gray-400'}`} />
                                            {s.label}
                                        </div>
                                        {errCount > 0 && (
                                            <p className="text-[11px] text-red-500 font-medium mt-0.5 pl-4">
                                                {errCount} open item{errCount > 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Form */}
                    <div className="flex-1 bg-white rounded-[10px] border border-gray-200 flex flex-col">
                        <div className="px-8 py-5 border-b border-gray-200 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400 stroke-[1.5]" />
                            <span className="text-[15px] font-semibold text-[#111827]">
                                {sections.find(s => s.id === currentSection)?.label ?? 'Concept Overview'}
                            </span>
                        </div>
                        <div className="px-8 py-8 flex-1">
                            <DynamicForm
                                ref={formRef}
                                config={config}
                                onSubmit={handleSubmit}
                                isSubmitting={isSaving}
                                hideSubmitButton
                                id="edit-concept-form"
                                activeSectionId={currentSection}
                                initialValues={initialValues ?? undefined}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 z-50">
                {error && <p className="text-sm text-red-500 self-center mr-auto">{error}</p>}
                <Button
                    variant="outline"
                    onClick={() => navigate(`/dashboard/${id}`)}
                    className="text-gray-700"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#581585] hover:bg-[#47116b] text-white px-8"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                </Button>
            </div>
        </PageShell>
    );
}
