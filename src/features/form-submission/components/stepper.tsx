import { useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";

interface StepperProps {
    sections: { id: string; label: string; }[];
    activeSection: string;
    activeIndex: number;
    completedSteps: string[];
    attemptedSteps: string[];
    isActiveValid: boolean;
    onSectionChange: (id: string) => void;
    /** Map of sectionId → error count (from validateAll) */
    sectionErrors?: Record<string, number>;
}

export function Stepper({
    sections,
    activeSection,
    activeIndex,
    completedSteps,
    attemptedSteps,
    isActiveValid,
    onSectionChange,
    sectionErrors = {},
}: StepperProps) {
    const stepperContainerRef = useRef<HTMLDivElement>(null);
    const activeNodeRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full md:w-[260px] bg-white rounded-[10px] pt-5 md:pt-7 pb-6 md:pb-10 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0 h-fit">
            <h2 className="text-[16px] font-semibold text-[#374151] px-5 md:px-7 mb-4 tracking-tight hidden md:block">Steps</h2>
            <div className="h-[1px] bg-gray-200 mb-5 mx-5 md:mx-7 hidden md:block" />
            <div
                ref={stepperContainerRef}
                className="relative px-0 md:px-7 flex flex-row justify-center md:justify-start overflow-hidden md:block md:overflow-visible gap-4 md:gap-0 pb-2 md:pb-0"
            >
                {sections.map((section, index) => {
                    const isActive = activeSection === section.id;
                    const isCompleted = completedSteps.includes(section.id) && !isActive;
                    const isMobileVisible = index >= activeIndex - 1 && index <= activeIndex + 1;

                    return (
                        <div key={`wrapper-${section.id}`} className={cn("contents md:block", !isMobileVisible && "hidden")}>
                            {index === 0 && isActive && (
                                <div className="w-[40px] shrink-0 md:hidden" />
                            )}
                            <div
                                ref={isActive ? activeNodeRef : null}
                                className={cn(
                                    "relative z-10 flex flex-col md:flex-row items-center md:items-start md:mb-[32px] cursor-pointer group shrink-0",
                                    !isMobileVisible && "hidden md:flex",
                                    isActive ? "w-[160px] md:w-auto" : "w-[40px] md:w-auto"
                                )}
                                onClick={() => onSectionChange(section.id)}
                            >
                                {/* Connector line */}
                                {index < sections.length - 1 && (
                                    <div className={cn(
                                        "hidden md:block absolute left-[15px] top-[32px] bottom-[-32px] w-[2px] z-[-1] transition-colors",
                                        isCompleted ? "bg-[#56b47c]" : "bg-[#e5e7eb]"
                                    )} />
                                )}

                                {/* Mobile connector line */}
                                {index < sections.length - 1 && index < activeIndex && (
                                    <div className={cn(
                                        "md:hidden absolute left-[50%] top-[15px] w-[200%] h-[2px] z-[-1]",
                                        isCompleted ? "bg-[#56b47c]" : "bg-[#e5e7eb]"
                                    )} />
                                )}

                                {/* Circle */}
                                <div className={cn(
                                    "flex items-center justify-center w-[32px] h-[32px] rounded-full border-[2px] text-[14px] font-medium transition-all md:mt-[-2px] shrink-0",
                                    isActive
                                        ? attemptedSteps.includes(section.id) && !isActiveValid
                                            ? "border-[#ef4444] bg-[#ef4444] text-white"
                                            : "border-[#9ca3af] bg-white text-[#111827]"
                                        : isCompleted
                                            ? "border-[#56b47c] bg-[#56b47c] text-white"
                                            : "border-[#d1d5db] bg-white text-[#9ca3af] group-hover:border-gray-400"
                                )}>
                                    {isCompleted ? <Check className="w-[18px] h-[18px] stroke-[2.5]" /> : (index + 1)}
                                </div>

                                {/* Label + error count */}
                                <div className={cn(
                                    "md:ml-4 mt-2 md:mt-0 md:pt-[3px] transition-colors tracking-tight text-center md:text-left px-2 md:px-0 w-full md:w-auto",
                                    "hidden md:block",
                                    isActive && "block",
                                    isActive
                                        ? "text-[#111827] font-semibold text-[13px] md:text-[15px]"
                                        : "text-[#9ca3af] md:text-[#6b7280] group-hover:text-[#374151] text-[11px] md:text-[15px]"
                                )}>
                                    {section.label}
                                    {(sectionErrors[section.id] ?? 0) > 0 && (
                                        <p className="text-[11px] text-red-500 font-medium mt-0.5">
                                            {sectionErrors[section.id]} open item{sectionErrors[section.id] > 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {index === sections.length - 1 && isActive && (
                                <div className="w-[40px] shrink-0 md:hidden" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
