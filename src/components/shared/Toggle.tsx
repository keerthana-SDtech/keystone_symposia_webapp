import { Check } from "lucide-react";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

export const Toggle = ({ checked, onChange, onClick }: ToggleProps) => (
  <button
    onClick={e => { onClick?.(e); e.stopPropagation(); onChange(); }}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked ? "bg-primary" : "bg-gray-300"
    }`}
    aria-checked={checked}
    role="switch"
    type="button"
  >
    <span
      className={`inline-flex items-center justify-center h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    >
      {checked && <Check className="w-2.5 h-2.5 text-primary stroke-[3]" />}
    </span>
  </button>
);
