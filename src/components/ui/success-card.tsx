import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

interface SuccessCardProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Generic success/confirmation card.
 * Shows a green check circle, a title, optional subtitle, and an optional CTA button.
 */
export function SuccessCard({
  title,
  subtitle,
  ctaLabel,
  onCta,
  className,
  children,
}: SuccessCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-[2px_4px_16px_rgba(0,0,0,0.06)] px-12 py-14 flex flex-col items-center text-center gap-5",
        className
      )}
    >
      {/* Green border-only circle with check tick */}
      <div className="w-14 h-14 rounded-full border-2 border-[#56b47c] flex items-center justify-center">
        <Check className="w-6 h-6 text-[#56b47c]" strokeWidth={2} />
      </div>

      {/* Title */}
      <h1 className="text-[20px] font-bold text-slate-800 leading-snug">{title}</h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[14px] text-slate-400 -mt-1">{subtitle}</p>
      )}

      {/* Extra content (e.g. email confirmation box) */}
      {children}

      {/* CTA Button */}
      {ctaLabel && onCta && (
        <Button
          type="button"
          className="bg-[#58008e] hover:bg-[#4a0078] text-white px-8 h-10 mt-2 rounded-lg text-sm font-medium"
          onClick={onCta}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
