import type { SubmissionStatus } from '../types';

export interface StatusStyle {
    dot: string;
    pill: string;
}

export const statusConfig: Record<SubmissionStatus, StatusStyle> = {
    'New Submission':         { dot: 'bg-purple-500', pill: 'border-purple-200 text-purple-700' },
    'Shortlisted':            { dot: 'bg-green-500',  pill: 'border-green-200 text-green-700' },
    'Banked':                 { dot: 'bg-gray-400',   pill: 'border-gray-200 text-gray-700' },
    'Rejected':               { dot: 'bg-red-500',    pill: 'border-red-200 text-red-700' },
    'Study Group Review':     { dot: 'bg-yellow-400', pill: 'border-yellow-200 text-yellow-700' },
    'SAB Board Meeting':      { dot: 'bg-yellow-400', pill: 'border-yellow-200 text-yellow-700' },
    'Proposal Inprogress':    { dot: 'bg-blue-500',   pill: 'border-blue-200 text-blue-700' },
    'Ready for SAB Review':   { dot: 'bg-blue-500',   pill: 'border-blue-200 text-blue-700' },
    'SAB Proposal In Review': { dot: 'bg-yellow-400', pill: 'border-yellow-200 text-yellow-700' },
    'Final Revision':         { dot: 'bg-blue-500',   pill: 'border-blue-200 text-blue-700' },
    'Proposal Finalized':     { dot: 'bg-green-500',  pill: 'border-green-200 text-green-700' },
};

export const fallbackStatus: StatusStyle = {
    dot: 'bg-gray-500',
    pill: 'border-gray-200 text-gray-700',
};

export const SUBMISSION_STATUSES = Object.keys(statusConfig) as SubmissionStatus[];
