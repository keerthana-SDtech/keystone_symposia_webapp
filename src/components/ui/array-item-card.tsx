import * as React from 'react';
import { ArrayItemHeader } from './array-item-header';

interface ArrayItemCardProps {
  icon: React.ReactNode;
  title: string;
  onDelete?: () => void;
  children: React.ReactNode;
}

/**
 * Reusable bordered card for a single item in an array-based form section.
 * Shows an icon + title header with an optional delete button on the right.
 * Used by organizer and keynote speaker array renderers.
 */
export function ArrayItemCard({ icon, title, onDelete, children }: ArrayItemCardProps) {
  return (
    <div className="border border-slate-200 rounded-[10px] p-5 flex flex-col gap-4">
      <ArrayItemHeader icon={icon} title={title} onDelete={onDelete} />
      {children}
    </div>
  );
}
