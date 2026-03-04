import type { RefObject } from 'react';

// ── Domain types ──────────────────────────────────────────────────────────────

export type SubmissionStatus =
    | 'New Submission'
    | 'Shortlisted'
    | 'Banked'
    | 'Rejected'
    | 'Study Group Review'
    | 'SAB Board Meeting'
    | 'Proposal Inprogress'
    | 'Ready for SAB Review'
    | 'SAB Proposal In Review'
    | 'Final Revision'
    | 'Proposal Finalized';

export interface DashboardMetric {
    id: string;
    title: string;
    value: number;
    type: 'new' | 'approved' | 'submitted' | 'updates';
    statuses: SubmissionStatus[];
}

export interface SubmissionSummary {
    id: string;
    title: string;
    submitter: string;
    category: string;
    date: string;
    status: SubmissionStatus;
}

// ── Shared config types ───────────────────────────────────────────────────────

export interface SubmitButtonConfig {
    label: string;
    onClick: () => void;
}

export interface AccessRestrictionConfig {
    restricted: boolean;
    message?: string;
    subMessage?: string;
}

// ── Sort ──────────────────────────────────────────────────────────────────────

export type SortOption = 'az' | 'za' | 'newest' | 'oldest' | null;

// ── Filter ────────────────────────────────────────────────────────────────────

export interface FilterParams {
    dateFrom?: string;        // YYYY-MM-DD
    dateTo?: string;          // YYYY-MM-DD
    statuses?: SubmissionStatus[];
}

export interface FilterPanelProps {
    isOpen: boolean;
    filterParams: FilterParams;
    onApply: (params: FilterParams) => void;
    onClose: () => void;
}

// ── Component prop types ──────────────────────────────────────────────────────

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export interface FilterSortProps {
    onFilter: () => void;
    filterActive: boolean;
    sortOption: SortOption;
    onSortSelect: (option: SortOption) => void;
}

export interface StatusBadgeProps {
    status: SubmissionStatus;
}

export interface SubmissionsTableProps {
    title: string;
    submissions: SubmissionSummary[];
    metrics: DashboardMetric[];
    loading: boolean;
    navigationBasePath: string;
    submitButton?: SubmitButtonConfig;
    searchPlaceholder?: string;
    showMetrics?: boolean;
    batchSize?: number;
    accessRestriction?: AccessRestrictionConfig;
    sortOption: SortOption;
    onSortSelect: (option: SortOption) => void;
    filterParams: FilterParams;
    onFilterChange: (params: FilterParams) => void;
}

// ── Hook types ────────────────────────────────────────────────────────────────

export interface UseSubmissionsTableOptions {
    submissions: SubmissionSummary[];
    batchSize?: number;
}

export interface UseSubmissionsTableResult {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedMetric: DashboardMetric | null;
    setSelectedMetric: (metric: DashboardMetric | null) => void;
    filteredSubmissions: SubmissionSummary[];
    visibleRows: SubmissionSummary[];
    hasMore: boolean;
    sentinelRef: RefObject<HTMLDivElement | null>;
}
