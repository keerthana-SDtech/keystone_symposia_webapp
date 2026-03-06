import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchConcepts } from '../api/conceptsApi';
import type { SortOption, FilterParams } from '../types';

export const SUBMISSIONS_QUERY_KEY = 'dashboard-submissions' as const;

export function useSubmissionsQuery(
    role: string | undefined,
    sort: SortOption,
    filter: FilterParams,
    search: string,
    cycleId?: string,
    stages?: string[],
) {
    return useInfiniteQuery({
        queryKey: [SUBMISSIONS_QUERY_KEY, role, sort, filter, search, cycleId, stages] as const,
        queryFn: ({ pageParam = 1 }) =>
            fetchConcepts({ cycleId, stages, sort, filter, search, page: pageParam as number, limit: 20 }),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        enabled: !!role,
        staleTime: 0,
    });
}
