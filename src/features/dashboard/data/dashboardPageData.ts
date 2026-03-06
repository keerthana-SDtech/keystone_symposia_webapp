import type { SubmissionStatus } from '../types';

export const DASHBOARD_PAGE_CONTENT = {
  pageTitle: "Concepts",
  button: "Submit Concept",
  searchPlaceholder: "Search all concepts...",
  emptyState: "No submissions found.",
  accessRestricted: {
    message: "Access Restricted",
    subMessage: "You do not have permission to view the dashboard.",
  },
};

export interface StatusStyle {
  dot: string;
  pill: string;
}

export const STATUS_CONFIG: Record<SubmissionStatus, StatusStyle> = {
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

export const FALLBACK_STATUS: StatusStyle = {
  dot: 'bg-gray-500',
  pill: 'border-gray-200 text-gray-700',
};

export const SUBMISSION_STATUSES = Object.keys(STATUS_CONFIG) as SubmissionStatus[];

export const TABLE_COLUMNS = [
  { key: 'title',     label: 'Title',     width: 'w-[30%]' },
  { key: 'submitter', label: 'Submitter', width: 'w-[15%]' },
  { key: 'category',  label: 'Category',  width: 'w-[20%]' },
  { key: 'date',      label: 'Date',      width: 'w-[15%]' },
  { key: 'status',    label: 'Status',    width: 'w-[20%]' },
];

export const DASHBOARD_METRIC_CARDS = [
  { id: "new-concepts",       value: "12", label: "New Concepts",        icon: "File"   },
  { id: "sab-approved",       value: "43", label: "SAB Approved",        icon: "Check"  },
  { id: "proposal-submitted", value: "10", label: "Proposal Submitted",  icon: "Loader" },
  { id: "revision-required",  value: "46", label: "Revision Required",   icon: "Alert"  },
];

export const FILTER_PANEL_CONTENT = {
  title: "Filter",
  dateFrom: "From Date",
  dateTo: "To Date",
  statusLabel: "Status",
  statusPlaceholder: "Select status",
  clearAll: "Clear All",
  cancel: "Cancel",
  done: "Done",
};
