import { Check } from "lucide-react";

interface SubmissionSuccessCardProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    className?: string;
}

export function SubmissionSuccessCard({ title, subtitle, children, className = '' }: SubmissionSuccessCardProps) {
    return (
        <div className={`bg-white rounded-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-200 p-12 text-center ${className}`}>
            <div className="mx-auto w-14 h-14 bg-[#f8f9fa] rounded-xl flex items-center justify-center mb-6">
                <div className="w-[34px] h-[34px] rounded-full border border-[#56b47c] flex items-center justify-center bg-transparent">
                    <Check className="w-[18px] h-[18px] text-[#56b47c] stroke-[2]" />
                </div>
            </div>

            <h2 className="text-[22px] font-bold text-[#111827] mb-3 tracking-tight">
                {title}
            </h2>

            <p className="text-[15px] text-[#6b7280] mb-8 font-medium">
                {subtitle}
            </p>

            {children}
        </div>
    );
}
