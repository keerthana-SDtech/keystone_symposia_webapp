import * as React from "react";
import { cn } from "../../lib/utils";

interface StepHeaderProps {
  icon: React.ReactNode;
  title: string;
  step: number;
  totalSteps: number;
  className?: string;
}

export function StepHeader({ icon, title, step, totalSteps, className }: StepHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between pb-5 border-b border-slate-200", className)}>
      <div className="flex items-center gap-3">
        <span className="text-slate-500 [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
        <h2 className="text-[17px] font-bold text-slate-800">{title}</h2>
      </div>
      <span className="text-sm text-slate-400 font-medium">
        Step {step} / {totalSteps}
      </span>
    </div>
  );
}
