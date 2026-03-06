import { cn } from '../../../lib/utils';
import { STATUS_CONFIG, FALLBACK_STATUS } from '../data/dashboardPageData';
import type { SubmissionStatus } from '../types';

interface StatusBadgeProps {
    status: SubmissionStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const style = STATUS_CONFIG[status] ?? FALLBACK_STATUS;
    return (
        <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-white text-[13px]',
            style.pill
        )}>
            <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
            {status}
        </div>
    );
};
