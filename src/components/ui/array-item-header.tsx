import * as React from 'react';
import { Trash2 } from 'lucide-react';

interface ArrayItemHeaderProps {
  icon: React.ReactNode;
  title: string;
  onDelete?: () => void;
}

/**
 * Reusable header row for array form items.
 * Renders icon + title on the left and an optional trash button on the right.
 * Used standalone inside shared cards (e.g. plenary speakers) and
 * composed inside ArrayItemCard for fully bordered items.
 */
export function ArrayItemHeader({ icon, title, onDelete }: ArrayItemHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-700 font-semibold text-[14px]">
        {icon}
        {title}
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
