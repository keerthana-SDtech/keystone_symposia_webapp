import { useQuery } from '@tanstack/react-query';
import { fetchConcepts } from '../api/conceptsApi';
import type { SortOption, FilterParams } from '../types';

export const SUBMISSIONS_QUERY_KEY = 'dashboard-submissions' as const;

export function useSubmissionsQuery(
    role: string | undefined,
    sort: SortOption,
    filter: FilterParams,
    cycleId?: string,
    stage?: string,
) {
    return useQuery({
        queryKey: [SUBMISSIONS_QUERY_KEY, role, sort, filter, cycleId, stage] as const,
        queryFn: () => fetchConcepts({ cycleId, stage, sort, filter }),
        enabled: !!role,
        staleTime: 0,
    });
}
