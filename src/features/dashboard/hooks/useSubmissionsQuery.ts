import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../api/mockData';
import type { SortOption, FilterParams } from '../types';

export const SUBMISSIONS_QUERY_KEY = 'dashboard-submissions' as const;

export function useSubmissionsQuery(
    role: string | undefined,
    sort: SortOption,
    filter: FilterParams,
) {
    return useQuery({
        queryKey: [SUBMISSIONS_QUERY_KEY, role, sort, filter] as const,
        queryFn: () => getDashboardData(role!, sort, filter),
        enabled: !!role,
        staleTime: 30_000,
    });
}
