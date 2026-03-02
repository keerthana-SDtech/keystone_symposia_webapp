import { Mail, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { PageShell } from "../../../components/layout/PageShell";
import { BackgroundDecorations } from "../../../components/layout/BackgroundDecorations";

interface SubmissionSuccessViewProps {
    isExternal: boolean;
    userEmail?: string;
    onReturnToHome: () => void;
    onSubmitNewConcept: () => void;
    onViewSubmission: () => void;
}

export function SubmissionSuccessView({
    isExternal,
    userEmail,
    onReturnToHome,
    onSubmitNewConcept,
    onViewSubmission
}: SubmissionSuccessViewProps) {
    return (
        <PageShell className="relative pb-24 bg-[#FAFBFD] min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background circular decorations */}
            <BackgroundDecorations />

            <div className="relative z-10 w-full max-w-2xl px-6 pt-16">
                <div className="bg-white rounded-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-200 p-12 text-center">
                    <div className="mx-auto w-14 h-14 bg-[#f8f9fa] rounded-xl flex items-center justify-center mb-6">
                        <div className="w-[34px] h-[34px] rounded-full border border-[#56b47c] flex items-center justify-center bg-transparent">
                            <Check className="w-[18px] h-[18px] text-[#56b47c] stroke-[2]" />
                        </div>
                    </div>

                    <h2 className="text-[22px] font-bold text-[#111827] mb-3 tracking-tight">
                        Concept Successfully Submitted !
                    </h2>

                    <p className="text-[15px] text-[#6b7280] mb-8 font-medium">
                        Thank you for submitting your conference concept
                    </p>

                    {isExternal ? (
                        <div className="max-w-md mx-auto">
                            <div className="bg-[#f9fafb] border border-gray-200 rounded-lg p-5 mb-8 text-left flex items-start gap-4">
                                <div className="mt-0.5 w-7 h-7 bg-[#56b47c] rounded-full flex items-center justify-center shrink-0">
                                    <Mail className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[15px] font-semibold text-[#374151] mb-1">
                                        Email confirmation sent to: {userEmail || "your email"}
                                    </h3>
                                    <p className="text-[14px] text-gray-500">
                                        you'll receive updates about your submission via email.
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={onSubmitNewConcept}
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
                                Return to Home
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
}
