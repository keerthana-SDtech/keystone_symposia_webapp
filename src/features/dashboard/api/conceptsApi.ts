import { httpClient } from '../../../lib/httpClient';
import type { SubmissionSummary, DashboardMetric, SortOption, FilterParams } from '../types';

// Shape returned by GET /keystone/concepts (enriched)
interface ConceptItem {
    id: string;
    title?: string;
    submitterId?: string;
    categoryId?: string;
    createdAt?: string;
    submittedAt?: string;
    stage?: string;
    submitterFirstName?: string;
    submitterLastName?: string;
    submitterEmail?: string;
    scientificCategory?: string;
}

export interface PaginatedConceptsResult {
    data: SubmissionSummary[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    stageCounts: Record<string, number>;
}

function mapStage(stage: string | undefined): SubmissionSummary['status'] {
    switch (stage) {
        case 'draft':              return 'New Submission';
        case 'submitted':          return 'New Submission';
        case 'shortlisted':        return 'Shortlisted';
        case 'banked':             return 'Banked';
        case 'rejected':           return 'Rejected';
        case 'organizer_assigned': return 'Proposal Inprogress';
        case 'proposal_submitted': return 'SAB Proposal In Review';
        case 'finalized':          return 'Proposal Finalized';
        default:                   return (stage ?? 'New Submission') as SubmissionSummary['status'];
    }
}

function mapConcept(c: ConceptItem): SubmissionSummary {
    const rawDate = c.submittedAt ?? c.createdAt ?? '';
    const formattedDate = rawDate
        ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '';

    const submitter = [c.submitterFirstName, c.submitterLastName].filter(Boolean).join(' ')
        || c.submitterEmail
        || c.submitterId
        || '';

    return {
        id: c.id,
        title: c.title ?? 'Untitled',
        submitter,
        category: c.scientificCategory ?? '',
        date: formattedDate,
        status: mapStage(c.stage),
    };
}

export function buildMetrics(stageCounts: Record<string, number>): DashboardMetric[] {
    return [
        { id: 'm1', title: 'New Concepts',       value: (stageCounts.draft ?? 0) + (stageCounts.submitted ?? 0),                                           type: 'new',       statuses: ['New Submission'] },
        { id: 'm2', title: 'SAB Board Meeting',  value: stageCounts.sab_board_meeting ?? 0,                                                                type: 'approved',  statuses: ['SAB Board Meeting'] },
        { id: 'm3', title: 'Proposal Submitted', value: (stageCounts.proposal_submitted ?? 0) + (stageCounts.organizer_assigned ?? 0),                      type: 'submitted', statuses: ['SAB Proposal In Review', 'Proposal Inprogress'] },
        { id: 'm4', title: 'Proposal Updates',   value: stageCounts.organizer_assigned ?? 0,                                                                type: 'updates',   statuses: ['Proposal Inprogress', 'Final Revision'] },
    ];
}

// Maps frontend status labels → DB stage values (exported for DashboardView metric-click handler)
export const STATUS_TO_STAGES: Record<string, string[]> = {
    'New Submission':         ['draft', 'submitted'],
    'Shortlisted':            ['shortlisted'],
    'Banked':                 ['banked'],
    'Rejected':               ['rejected'],
    'Proposal Inprogress':    ['organizer_assigned'],
    'SAB Proposal In Review': ['proposal_submitted'],
    'Proposal Finalized':     ['finalized'],
    'SAB Board Meeting':      ['sab_board_meeting'],
    'Final Revision':         ['finalized'],
};

export interface ConceptsQueryParams {
    cycleId?: string;
    stages?: string[];
    sort?: SortOption;
    filter?: FilterParams;
    search?: string;
    page?: number;
    limit?: number;
}

export async function fetchConcepts({ cycleId, stages, sort, filter, search, page, limit }: ConceptsQueryParams): Promise<PaginatedConceptsResult> {
    const params: Record<string, unknown> = {};
    if (cycleId) params.cycleId = cycleId;
    if (sort) params.sort = sort;
    if (search?.trim()) params.search = search.trim();
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (filter?.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter?.dateTo) params.dateTo = filter.dateTo;

    // Merge metric-card stages with filter-panel statuses (converted to DB stages)
    const filterStages = filter?.statuses?.flatMap(s => STATUS_TO_STAGES[s] ?? []) ?? [];
    const allStages = [...new Set([...(stages ?? []), ...filterStages])];
    if (allStages.length) params.stages = allStages;

    const { data: raw } = await httpClient.get<{ data: ConceptItem[]; total: number; page: number; limit: number; hasMore: boolean; stageCounts: Record<string, number> }>(
        '/keystone/concepts', { params }
    );

    return {
        data: raw.data.map(mapConcept),
        total: raw.total,
        page: raw.page,
        limit: raw.limit,
        hasMore: raw.hasMore,
        stageCounts: raw.stageCounts,
    };
}
