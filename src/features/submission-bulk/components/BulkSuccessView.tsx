import { Mail } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useAuthContext } from "../../../app/providers/useAuthContext";
import { SubmissionSuccessCard } from "../../form-submission/components/SubmissionSuccessCard";

interface BulkSuccessViewProps {
    onReturnToHome: () => void;
    onViewSubmission: () => void;
    onSubmitNew: () => void;
}

export function BulkSuccessView({ onReturnToHome, onViewSubmission, onSubmitNew }: BulkSuccessViewProps) {
    const { user } = useAuthContext();
    const isExternal = user?.role === "external_scientist";

    return (
        <SubmissionSuccessCard
            title="Bulk Upload Successfully Submitted !"
            subtitle="Thank you for submitting your conference concepts"
            className="w-full mt-2"
        >
            {isExternal ? (
                <div className="max-w-md mx-auto">
                    <div className="bg-[#f9fafb] border border-gray-200 rounded-lg p-5 mb-8 text-left flex items-start gap-4">
                        <div className="mt-0.5 w-7 h-7 bg-[#56b47c] rounded-full flex items-center justify-center shrink-0">
                            <Mail className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[15px] font-semibold text-[#374151] mb-1">
                                Email confirmation sent to: {user?.email || "your email"}
                            </h3>
                            <p className="text-[14px] text-gray-500">
                                you'll receive updates about your partial/full bulk submission via email.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={onSubmitNew}
                        className="bg-[#f3f4f6] hover:bg-gray-200 text-[#374151] border border-gray-200 font-medium px-6 py-2 h-auto"
                    >
                        Submit New Concept
                    </Button>
                </div>
            ) : (
                <div className="flex justify-center gap-4 mt-6">
                    <Button
                        onClick={onViewSubmission}
                        className="bg-[#f3f4f6] hover:bg-gray-200 text-[#374151] border border-gray-200 font-medium px-6 py-2.5 h-auto hover:text-[#374151]"
                    >
                        View Submission
                    </Button>
                    <Button
                        onClick={onReturnToHome}
                        className="bg-[#4b286d] hover:bg-[#3a1f54] text-white font-medium px-6 py-2.5 h-auto hover:text-white"
                    >
                        Return to Dashboard
                    </Button>
                </div>
            )}
        </SubmissionSuccessCard>
    );
}
