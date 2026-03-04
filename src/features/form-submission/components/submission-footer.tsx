import { Button } from "../../../components/ui/button";

interface SubmissionFooterProps {
    submitMode: "single" | "bulk";
    isFirstStep: boolean;
    isLastStep: boolean;
    isSubmitting: boolean;
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
                        variant="outline"
                        onClick={onBack}
                        disabled={isFirstStep}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 md:px-8 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={onNext}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px] transition-all"
                        disabled={isSubmitting}
                    >
                        {isLastStep
                            ? (isSubmitting ? "Submitting..." : "Submit")
                            : "Next"}
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 md:px-8 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={bulkHook.submitBulk}
                        disabled={!bulkHook.success || bulkHook.isSubmittingBulk || bulkHook.bulkSuccess}
                        className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-4 md:py-5 font-medium rounded-md text-[13px] md:text-[14px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {bulkHook.isSubmittingBulk ? "Submitting..." : "Submit"}
                    </Button>
                </>
            )}
        </footer>
    );
}
