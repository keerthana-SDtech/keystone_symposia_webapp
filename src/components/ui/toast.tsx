import * as React from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";
import { cn } from "../../lib/utils";

export type ToastVariant = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  visible: boolean;
}

const VARIANT_STYLES: Record<ToastVariant, { wrapper: string; icon: React.ReactNode }> = {
  "success": {
    wrapper: "bg-green-50 border border-green-200 text-green-800",
    icon: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
  },
  "error": {
    wrapper: "bg-red-50 border border-red-200 text-red-800",
    icon: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
  },
  "info": {
    wrapper: "bg-blue-50 border border-blue-200 text-blue-800",
    icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  },
};

export function Toast({ message, variant = "success", onClose, visible }: ToastProps) {
  if (!visible) return null;

  const { wrapper, icon } = VARIANT_STYLES[variant];

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-[100]",
        "flex items-center gap-3 px-5 py-3 rounded-lg shadow-md min-w-[320px] max-w-[480px]",
        "animate-in fade-in slide-in-from-bottom-2 duration-200",
        wrapper
      )}
      role="alert"
    >
      {icon}
      <span className="text-[14px] font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
