import { Clock } from "lucide-react";
import { STUDY_GROUP_BANNER_CONTENT } from "../data/keystoneActionsData";

interface StudyGroupBannerProps {
    status: string;
}

export const StudyGroupBanner = ({ status }: StudyGroupBannerProps) => {
    if (status !== STUDY_GROUP_BANNER_CONTENT.triggerStatus) return null;

    const { days, hours, minutes } = STUDY_GROUP_BANNER_CONTENT.timer;

    return (
        <div className="mb-6 bg-white border border-gray-200 rounded-[12px] shadow-sm flex items-center p-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Left Accent border */}
            <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#36429A]" />

            <div className="flex items-center gap-5 flex-1 pl-2">
                <div className="w-12 h-12 bg-[#F8F9FA] border border-gray-100 rounded-[14px] flex items-center justify-center text-gray-500 flex-shrink-0">
                    <Clock className="w-[22px] h-[22px]" strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="text-[17px] font-bold text-gray-900 mb-1 tracking-tight">
                        {STUDY_GROUP_BANNER_CONTENT.heading}
                    </h3>
                    <p className="text-[14px] text-gray-600">
                        {STUDY_GROUP_BANNER_CONTENT.description}
                    </p>
                </div>
            </div>

            {/* Timer Section */}
            <div className="flex items-start gap-5 pr-6">
                <div className="flex flex-col items-center">
                    <div className="text-[32px] font-medium text-[#111827] leading-none mb-1.5 tracking-tight">
                        {String(days.initial).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">{days.label}</div>
                </div>
                <div className="text-[24px] text-gray-300 font-light mt-[2px]">:</div>
                <div className="flex flex-col items-center">
                    <div className="text-[32px] font-medium text-[#111827] leading-none mb-1.5 tracking-tight">
                        {String(hours.initial).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">{hours.label}</div>
                </div>
                <div className="text-[24px] text-gray-300 font-light mt-[2px]">:</div>
                <div className="flex flex-col items-center">
                    <div className="text-[32px] font-medium text-[#111827] leading-none mb-1.5 tracking-tight">
                        {String(minutes.initial).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">{minutes.label}</div>
                </div>
            </div>
        </div>
    );
};
