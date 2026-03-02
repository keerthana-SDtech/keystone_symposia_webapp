import { Button } from "../../../components/ui/button";

interface SubmissionFooterProps {
    submitMode: "single" | "bulk";
    isFirstStep: boolean;
    isLastStep: boolean;
    isSubmitting: boolean;
    activeSection: string;
    onAttemptStep: (sectionId: string) => void;
    onBack: () => void;
    onNext: () => void;
    onCancel: () => void;
    bulkHook: {
        success: boolean;
        isSubmittingBulk: boolean;
        bulkSuccess: boolean;
        submitBulk: () => void;
    };
}

export function SubmissionFooter({
    submitMode,
    isFirstStep,
    isLastStep,
    isSubmitting,
    activeSection,
    onAttemptStep,
    onBack,
    onNext,
    onCancel,
    bulkHook
}: SubmissionFooterProps) {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 md:px-8 py-3 md:py-4 z-40 flex justify-end gap-2 md:gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
            {submitMode === "single" ? (
                <>
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        className="bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 px-4 md:px-6 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        disabled={isFirstStep}
                        className="bg-[#f3f4f6] hover:bg-gray-200 text-gray-600 hover:text-gray-800 px-6 md:px-8 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hidden md:inline-flex"
                    >
                        Back
                    </Button>
                    {isLastStep ? (
                        <Button
                            form="concept-form"
                            type="submit"
                            className="bg-[#4b286d] hover:bg-[#3a1f54] text-white px-6 md:px-8 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px] transition-all"
                            disabled={isSubmitting}
                            onClick={() => onAttemptStep(activeSection)}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    ) : (
                        <Button
                            onClick={onNext}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px] transition-all"
                        >
                            Next
                        </Button>
                    )}
                </>
            ) : (
                <>
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        className="bg-[#f3f4f6] hover:bg-gray-200 text-gray-600 hover:text-gray-800 px-4 md:px-8 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={bulkHook.submitBulk}
                        disabled={!bulkHook.success || bulkHook.isSubmittingBulk || bulkHook.bulkSuccess}
                        className="bg-[#4b286d] hover:bg-[#3a1f54] text-white px-6 md:px-8 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {bulkHook.isSubmittingBulk ? "Submitting..." : "Submit"}
                    </Button>
                </>
            )}
        </footer>
    );
}
