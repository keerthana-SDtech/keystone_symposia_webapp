import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SubmissionDetail } from "../types";
import { ACTIVITY_TIMELINE_CONTENT } from "../data/keystoneActionsData";

interface ActivityTimelineProps {
    isOpen: boolean;
    onClose: () => void;
    detail: SubmissionDetail;
}

export const ActivityTimeline = ({ isOpen, onClose, detail }: ActivityTimelineProps) => {
    if (!isOpen) return null;

    const isRejected = detail.status === 'Rejected';
    const isShortlisted = detail.status === 'Shortlisted';
    const isBanked = detail.status === 'Banked';
    const hasFinalStatus = isRejected || isShortlisted || isBanked;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity top-0 left-0" onClick={onClose} />
            {/* Drawer */}
            <div className="relative w-[500px] h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-[20px] font-semibold text-gray-900">{ACTIVITY_TIMELINE_CONTENT.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 relative">
                    <div className="relative pl-1">

                        {/* Step 1 */}
                        <div className="relative flex gap-4 pb-10">
                            <div className="absolute left-[15px] top-[32px] bottom-[-4px] w-[2px] bg-[#58B957] z-0" />
                            <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center p-[3px]">
                                <div className="w-full h-full rounded-full bg-[#58B957] flex items-center justify-center text-white">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                            </div>
                            <div className="pt-1.5">
                                <h4 className="text-[15px] font-semibold text-gray-900 mb-1 leading-tight">{ACTIVITY_TIMELINE_CONTENT.steps[0].heading}</h4>
                                <p className="text-[14px] text-gray-500 leading-relaxed pr-6">
                                    {ACTIVITY_TIMELINE_CONTENT.steps[0].description}
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex gap-4">
                            <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center p-[3px]">
                                <div className="w-full h-full rounded-full bg-[#58B957] flex items-center justify-center text-white">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                            </div>
                            <div className="pt-1.5 relative">
                                <h4 className="text-[15px] font-semibold text-gray-900 mb-1 leading-tight">{ACTIVITY_TIMELINE_CONTENT.steps[1].heading}</h4>
                                <p className="text-[14px] text-gray-500 leading-relaxed pr-6">
                                    {ACTIVITY_TIMELINE_CONTENT.steps[1].description}
                                </p>

                                {hasFinalStatus && (
                                    <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-[13px] font-medium text-gray-700 shadow-sm leading-none">
                                        <span className={`w-1.5 h-1.5 rounded-full ${isRejected ? 'bg-red-500' :
                                            isShortlisted ? 'bg-[#58B957]' : 'bg-purple-500'
                                            }`} />
                                        {detail.status}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end">
                    <Button
                        onClick={onClose}
                        className="bg-[#581585] hover:bg-[#47116b] text-white text-[14px] font-medium px-8 h-10 rounded-[6px]"
                    >
                        {ACTIVITY_TIMELINE_CONTENT.doneButton}
                    </Button>
                </div>
            </div>
        </div>
    );
};
