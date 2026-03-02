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
}

export function Stepper({
    sections,
    activeSection,
    activeIndex,
    completedSteps,
    attemptedSteps,
    isActiveValid,
    onSectionChange
}: StepperProps) {
    const stepperContainerRef = useRef<HTMLDivElement>(null);
    const activeNodeRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full md:w-[280px] bg-[#f0f2f5] rounded-[10px] md:rounded-r-none md:rounded-l-[10px] pt-5 md:pt-8 pb-4 md:pb-12 border border-gray-200 md:border-r-0 shrink-0 relative md:mt-2 md:-mr-[1px] z-0 h-fit">
            <h2 className="text-[16.5px] font-semibold text-[#374151] px-5 md:px-8 mb-5 tracking-tight hidden md:block">Steps</h2>
            <div className="h-[1px] bg-gray-200 mb-6 mx-6 hidden md:block" />
            <div
                ref={stepperContainerRef}
                className="relative px-0 md:px-8 flex flex-row justify-center md:justify-start overflow-hidden md:block md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0"
            >
                {sections.map((section, index) => {
                    const isActive = activeSection === section.id;
                    const isCompleted = completedSteps.includes(section.id) && !isActive;
                    const isGreenNode = isCompleted;
                    const isMobileVisible = index >= activeIndex - 1 && index <= activeIndex + 1;

                    return (
                        <div key={`wrapper-${section.id}`} className={cn("contents md:block", !isMobileVisible && "hidden")}>
                            {/* Inject a hidden empty node if this is the very first step on mobile, to push it to the center */}
                            {index === 0 && isActive && (
                                <div className="w-[40px] shrink-0 md:hidden" />
                            )}
                            <div
                                ref={isActive ? activeNodeRef : null}
                                className={cn(
                                    "relative z-10 flex flex-col md:flex-row items-center md:items-start md:mb-[35px] cursor-pointer group shrink-0",
                                    !isMobileVisible && "hidden md:flex",
                                    isActive ? "w-[160px] md:w-auto" : "w-[40px] md:w-auto"
                                )}
                                onClick={() => onSectionChange(section.id)}
                            >
                                {/* Desktop Segmented Line */}
                                {index < sections.length - 1 && (
                                    <div className={cn(
                                        "hidden md:block absolute left-[15px] top-[32px] bottom-[-35px] w-[2px] z-[-1] transition-colors",
                                        isGreenNode ? "bg-[#56b47c]" : "bg-[#e5e7eb]"
                                    )} />
                                )}

                                {/* Mobile Segmented Line (only between visible siblings, and ONLY leading up to active step) */}
                                {index < sections.length - 1 && (index < activeIndex) && (
                                    <div className={cn(
                                        "md:hidden absolute left-[50%] top-[15px] w-[200%] h-[2px] z-[-1] transition-colors",
                                        isGreenNode ? "bg-[#56b47c]" : "bg-[#e5e7eb]"
                                    )} />
                                )}

                                <div className={cn(
                                    "flex items-center justify-center w-[32px] h-[32px] rounded-full border-[2px] text-[14px] font-medium transition-all md:mt-[-2px] shrink-0",
                                    isActive
                                        ? isActiveValid
                                            ? "border-[#56b47c] bg-[#e8f5e9] text-[#111827]"
                                            : attemptedSteps.includes(section.id)
                                                ? "border-[#ef4444] bg-white text-gray-900"
                                                : "border-[#9ca3af] bg-white text-[#111827]"
                                        : isCompleted
                                            ? "border-[#56b47c] bg-[#56b47c] text-white"
                                            : "border-[#e5e7eb] bg-[#f0f2f5] md:bg-white text-[#9ca3af] group-hover:border-gray-300"
                                )}>
                                    {isCompleted ? <Check className="w-[18px] h-[18px] stroke-[2.5]" /> : (index + 1)}
                                </div>
                                <div className={cn(
                                    "md:ml-4 mt-2 md:mt-0 md:pt-[2.5px] transition-colors tracking-tight text-center md:text-left px-2 md:px-0 w-full md:w-auto",
                                    "hidden md:block", // Hide text on mobile by default
                                    isActive && "block", // Show only active text on mobile
                                    isActive
                                        ? "text-[#111827] font-semibold text-[13px] md:text-[15px] md:whitespace-normal"
                                        : "text-gray-400 md:text-[#4b5563] group-hover:text-[#374151] text-[11px] md:text-[15px] truncate md:overflow-visible md:whitespace-normal"
                                )}>
                                    {section.label}
                                </div>
                            </div>

                            {/* Inject a hidden empty node if this is the very last step on mobile, to push it to the center */}
                            {index === sections.length - 1 && isActive && (
                                <div className="w-[40px] shrink-0 md:hidden" />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
