import { httpClient } from '../../../lib/httpClient';
import type { SubmissionSummary, DashboardMetric, SubmissionStatus, SortOption, FilterParams } from '../types';

// Shape returned by GET /keystone/concepts (Drizzle camelCase)
interface ConceptItem {
    id: string;
    title?: string;
    submitterId?: string;
    categoryId?: string;
    createdAt?: string;
    submittedAt?: string;
    stage?: string;
    name?: string;
    submitter?: string;
    submittedBy?: string;
    createdBy?: string;
    category?: string;
    scientificCategory?: string;
    date?: string;
    status?: string;
}

function mapStage(stage: string | undefined): SubmissionStatus {
    switch (stage) {
        case 'draft':              return 'New Submission';
        case 'submitted':          return 'New Submission';
        case 'shortlisted':        return 'Shortlisted';
        case 'banked':             return 'Banked';
        case 'rejected':           return 'Rejected';
        case 'organizer_assigned': return 'Proposal Inprogress';
        case 'proposal_submitted': return 'SAB Proposal In Review';
        case 'finalized':          return 'Proposal Finalized';
        default:                   return (stage ?? 'New Submission') as SubmissionStatus;
    }
}

type ConceptsApiResponse = ConceptItem[] | { data?: ConceptItem[]; concepts?: ConceptItem[]; items?: ConceptItem[] };

interface UserProfile { identityId: string; firstName?: string; lastName?: string; email?: string; }

function mapConcept(
    c: ConceptItem,
    userMap: Record<string, string>,
    categoryMap: Record<string, string>,
): SubmissionSummary {
    const rawDate = c.submittedAt ?? c.createdAt ?? c.date ?? '';
    const formattedDate = rawDate
        ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '';

    const submitter = c.submitter ?? c.submittedBy ?? c.createdBy
        ?? (c.submitterId ? (userMap[c.submitterId] ?? c.submitterId) : '');
    const category = c.category ?? c.scientificCategory ?? categoryMap[c.id] ?? c.categoryId ?? '';

    return {
        id: c.id,
        title: c.title ?? c.name ?? 'Untitled',
        submitter,
        category,
        date: formattedDate,
        status: mapStage(c.stage ?? c.status),
    };
}

function buildMetrics(submissions: SubmissionSummary[]): DashboardMetric[] {
    return [
        { id: 'm1', title: 'New Concepts', value: submissions.filter(s => s.status === 'New Submission').length, type: 'new', statuses: ['New Submission'] },
        { id: 'm2', title: 'SAB Board Meeting', value: submissions.filter(s => s.status === 'SAB Board Meeting').length, type: 'approved', statuses: ['SAB Board Meeting'] },
        { id: 'm3', title: 'Proposal Submitted', value: submissions.filter(s => s.status === 'SAB Proposal In Review' || s.status === 'Proposal Inprogress').length, type: 'submitted', statuses: ['SAB Proposal In Review', 'Proposal Inprogress'] },
        { id: 'm4', title: 'Proposal Updates', value: submissions.filter(s => s.status === 'Proposal Inprogress' || s.status === 'Final Revision').length, type: 'updates', statuses: ['Proposal Inprogress', 'Final Revision'] },
    ];
}

export interface ConceptsQueryParams {
    cycleId?: string;
    stage?: string;
    sort?: SortOption;
    filter?: FilterParams;
}

export async function fetchConcepts({ cycleId, stage, sort, filter }: ConceptsQueryParams) {
    const params: Record<string, unknown> = {};
    if (cycleId) params.cycleId = cycleId;
    if (stage) params.stage = stage;
    if (sort) params.sort = sort;
    if (filter?.statuses?.length) params.status = filter.statuses;
    if (filter?.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter?.dateTo) params.dateTo = filter.dateTo;

    const { data: raw } = await httpClient.get<ConceptsApiResponse>('/keystone/concepts', { params });

    const items: ConceptItem[] = Array.isArray(raw)
        ? raw
        : (raw.data ?? raw.concepts ?? raw.items ?? []);

    // Bulk-fetch submitter names (falls back to UUID on permission error or failure)
    const submitterIds = [...new Set(items.map(c => c.submitterId).filter(Boolean))] as string[];
    const userMap: Record<string, string> = submitterIds.length
        ? await Promise.all(
            submitterIds.map(id =>
                httpClient.get<UserProfile>(`/keystone/users/${id}`)
                    .then(({ data: u }) => [id, [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || id] as [string, string])
                    .catch(() => [id, id] as [string, string])
            )
        ).then(entries => Object.fromEntries(entries))
        : {};

    // Fetch scientificCategory from each concept's formData in parallel
    const categoryMap: Record<string, string> = await Promise.all(
        items.map(c =>
            httpClient.get<{ formData?: { fieldKey: string; fieldValue?: string | null }[] }>(`/keystone/concepts/${c.id}`)
                .then(({ data }) => {
                    const field = (data.formData ?? []).find(f => f.fieldKey === 'scientificCategory');
                    return [c.id, field?.fieldValue ?? ''] as [string, string];
                })
                .catch(() => [c.id, ''] as [string, string])
        )
    ).then(entries => Object.fromEntries(entries));

    const submissions = items.map(c => mapConcept(c, userMap, categoryMap));
    return { submissions, metrics: buildMetrics(submissions) };
}

