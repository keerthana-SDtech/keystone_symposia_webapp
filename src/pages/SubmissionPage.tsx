import { useState, useRef, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { DynamicForm, type DynamicFormRef } from "../features/form-submission/components/dynamic-form";
import { useFormSubmission } from "../features/form-submission/hooks/use-form-submission";
import { Loader2, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { useAuthContext } from "../app/providers/useAuthContext";
import { useBulkSubmission } from "../features/submission-bulk/hooks/use-bulk-submission";

const BulkUpload = lazy(() => import("../features/submission-bulk/components/BulkUpload").then(m => ({ default: m.BulkUpload })));
const BulkSuccessView = lazy(() => import("../features/submission-bulk/components/BulkSuccessView").then(m => ({ default: m.BulkSuccessView })));
import { Stepper } from "../features/form-submission/components/stepper";
import { BackgroundDecorations } from "../components/layout/BackgroundDecorations";
import { SubmissionSuccessView } from "../features/form-submission/components/submission-success-view";
import { SubmissionFooter } from "../features/form-submission/components/submission-footer";
import { SUBMISSION_PAGE_CONTENT } from "../features/submission/data/submissionPageData";

export default function SubmissionPage() {
    const { definition, isLoading, isSubmitting, error, isSuccess, submitForm } = useFormSubmission();
    const bulkHook = useBulkSubmission();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [submitMode, setSubmitMode] = useState<"single" | "bulk">("single");
    const [activeSection, setActiveSection] = useState("");
    const [isActiveValid, setIsActiveValid] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [attemptedSteps, setAttemptedSteps] = useState<string[]>([]);
    const formRef = useRef<DynamicFormRef>(null);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-gray-500 font-medium">{SUBMISSION_PAGE_CONTENT.loadingText}</p>
                </div>
            </div>
        );
    }

    if (error || !definition) {
        return (
            <PageShell className="flex items-center justify-center bg-[#f9fafb]">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{SUBMISSION_PAGE_CONTENT.error.heading}</h2>
                    <p className="text-gray-600 mb-6">{error || SUBMISSION_PAGE_CONTENT.error.fallbackMessage}</p>
                    <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
                        {SUBMISSION_PAGE_CONTENT.error.retryButton}
                    </Button>
                </div>
            </PageShell>
        );
    }

    if (isSuccess) {
        return (
            <SubmissionSuccessView
                isExternal={user?.role === "external_scientist"}
                userEmail={user?.email}
                onReturnToHome={() => navigate("/dashboard")}
                onSubmitNewConcept={() => window.location.reload()}
                onViewSubmission={() => { }}
            />
        );
    }

    const sections = definition.sections.map((s) => ({ id: s.id, label: s.label }));

    if (!activeSection && sections.length > 0) {
        setActiveSection(sections[0].id);
    }

    const activeIndex = sections.findIndex(s => s.id === activeSection);
    const isLastStep = activeIndex === sections.length - 1;
    const isFirstStep = activeIndex === 0;

    // Auto-scroll logic removed as mobile now only shows 3 adjacent steps
    // (Container will naturally center the trio via flex utilities)

    const handleNext = async () => {
        if (!attemptedSteps.includes(activeSection)) {
            setAttemptedSteps(prev => [...prev, activeSection]);
        }

        if (!isLastStep) {
            const isValid = await formRef.current?.validateActiveSection();
            if (isValid) {
                if (!completedSteps.includes(activeSection)) {
                    setCompletedSteps([...completedSteps, activeSection]);
                }
                setActiveSection(sections[activeIndex + 1].id);
            }
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            setActiveSection(sections[activeIndex - 1].id);
        }
    };

    return (
        <PageShell className="relative pb-24 bg-[#FAFBFD] min-h-screen overflow-hidden">
            {/* Background circular decorations */}
            <BackgroundDecorations />

            <div className="w-full max-w-[1100px] mx-auto pt-6 md:pt-10 px-4 sm:px-6 md:px-8 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 md:mb-8">
                    <h1 className="text-[24px] md:text-[28px] font-medium text-[#111827] tracking-tight flex items-center">
                        {SUBMISSION_PAGE_CONTENT.pageTitle}
                    </h1>

                    {user?.role === "keystone_member" && (
                        <div className="flex bg-[#f4f5f7] p-[3px] rounded-[8px] border border-gray-200 shadow-sm">
                            <button
                                onClick={() => setSubmitMode("single")}
                                className={cn(
                                    "px-5 py-1.5 text-[14px] font-medium rounded-[6px] transition-all",
                                    submitMode === "single"
                                        ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                )}
                            >
                                {SUBMISSION_PAGE_CONTENT.tabs.single}
                            </button>
                            <button
                                onClick={() => setSubmitMode("bulk")}
                                className={cn(
                                    "px-5 py-1.5 text-[14px] font-medium rounded-[6px] transition-all",
                                    submitMode === "bulk"
                                        ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                )}
                            >
                                {SUBMISSION_PAGE_CONTENT.tabs.bulk}
                            </button>
                        </div>
                    )}
                </div>

                {submitMode === "single" ? (
                    <div className="flex flex-col md:flex-row w-full relative z-10 pb-[100px] gap-6 md:gap-0">
                        {/* Left Sidebar Stepper Component */}
                        <Stepper
                            sections={sections}
                            activeSection={activeSection}
                            activeIndex={activeIndex}
                            completedSteps={completedSteps}
                            attemptedSteps={attemptedSteps}
                            isActiveValid={isActiveValid}
                            onSectionChange={setActiveSection}
                        />

                        {/* Right Content */}
                        <div className="flex-1 bg-white rounded-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-200 min-h-[500px] z-10 flex flex-col pt-1 relative">
                            <div className="px-5 md:px-8 py-4 md:py-5 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-[10px]">
                                <div className="flex items-center text-[#111827] font-semibold text-[15px] md:text-[16px]">
                                    <FileText className="h-[18px] w-[18px] mr-2 text-gray-400 stroke-[1.5]" />
                                    {sections.find(s => s.id === activeSection)?.label || "Concept Overview"}
                                </div>
                                <div className="text-[12px] md:text-[13px] text-gray-500 font-medium">
                                    Step {sections.findIndex(s => s.id === activeSection) + 1} / {sections.length}
                                </div>
                            </div>

                            <div className="px-5 sm:px-6 md:px-10 py-6 md:py-8 flex-1">
                                <DynamicForm
                                    ref={formRef}
                                    definition={definition}
                                    onSubmit={submitForm}
                                    isSubmitting={isSubmitting}
                                    hideSubmitButton={true}
                                    id="concept-form"
                                    activeSectionId={activeSection}
                                    onActiveSectionValidChange={setIsActiveValid}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full relative z-10 pb-[100px]">
                        <Suspense fallback={
                            <div className="flex py-20 items-center justify-center">
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            </div>
                        }>
                            {bulkHook.bulkSuccess ? (
                                <BulkSuccessView
                                    onReturnToHome={() => navigate("/dashboard")}
                                    onViewSubmission={() => { }}
                                    onSubmitNew={() => window.location.reload()}
                                />
                            ) : (
                                <BulkUpload
                                    file={bulkHook.file}
                                    error={bulkHook.error}
                                    success={bulkHook.success}
                                    isUploading={bulkHook.isUploading}
                                    isDownloadingTemplate={bulkHook.isDownloadingTemplate}
                                    uploadFile={bulkHook.uploadFile}
                                    handleDownloadTemplate={bulkHook.handleDownloadTemplate}
                                />
                            )}
                        </Suspense>
                    </div>
                )}
            </div>

            {/* Sticky bottom footer */}
            {!(submitMode === "bulk" && bulkHook.bulkSuccess) && (
                <SubmissionFooter
                    submitMode={submitMode}
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    isSubmitting={isSubmitting}
                    activeSection={activeSection}
                    onAttemptStep={(sectionId) => {
                        if (!attemptedSteps.includes(sectionId)) {
                            setAttemptedSteps(prev => [...prev, sectionId]);
                        }
                    }}
                    onBack={handleBack}
                    onNext={handleNext}
                    onCancel={() => navigate("/dashboard")}
                    bulkHook={bulkHook}
                />
            )}
        </PageShell >
    );
}