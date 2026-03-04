import { Info } from 'lucide-react';
import { Button } from './button';

interface AddItemButtonProps {
  label: string;
  onClick: () => void;
  showInfo?: boolean;
}

/**
 * Ghost "+" button used at the bottom of array form sections to add a new item.
 * Optionally shows an info icon after the label.
 */
export function AddItemButton({ label, onClick, showInfo = false }: AddItemButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="w-fit text-primary text-[13px] font-medium px-0 hover:bg-transparent hover:text-primary/80 flex items-center gap-1"
      onClick={onClick}
    >
      + {label}
      {showInfo && <Info className="w-3.5 h-3.5 text-slate-400" />}
    </Button>
  );
}
