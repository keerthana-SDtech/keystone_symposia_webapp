import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../../app/providers/useAuthContext';
import { useSubmissionsQuery } from '../hooks/useSubmissionsQuery';
import { buildMetrics, STATUS_TO_STAGES } from '../api/conceptsApi';
import { SubmissionsTable } from './SubmissionsTable';
import type { SortOption, FilterParams, DashboardMetric } from '../types';

export const DashboardView = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [sortOption, setSortOption] = useState<SortOption>(null);
    const [filterParams, setFilterParams] = useState<FilterParams>({});

    // Server-side search with 300ms debounce
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    // Metric card stage filter
    const [stages, setStages] = useState<string[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<DashboardMetric | null>(null);

    const cycleId = searchParams.get('cycleId') ?? undefined;

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useSubmissionsQuery(
        user?.role,
        sortOption,
        filterParams,
        debouncedSearch,
        cycleId,
        stages,
    );

    const submissions = data?.pages.flatMap(p => p.data) ?? [];
    const total = data?.pages[0]?.total;
    const stageCounts = data?.pages[0]?.stageCounts ?? {};
    const metrics = buildMetrics(stageCounts);

    const handleMetricClick = (metric: DashboardMetric) => {
        const dbStages = metric.statuses.flatMap(s => STATUS_TO_STAGES[s] ?? []);
        setStages([...new Set(dbStages)]);
        setSelectedMetric(metric);
    };

    const handleMetricClear = () => {
        setStages([]);
        setSelectedMetric(null);
    };

    if (!user) return null;

    return (
        <SubmissionsTable
            title="Concepts"
            submissions={submissions}
            total={total}
            metrics={metrics}
            loading={isLoading}
            navigationBasePath="/dashboard"
            submitButton={{
                label: 'Submit Concept',
                onClick: () => navigate('/submission'),
            }}
            searchPlaceholder="Search all concepts..."
            showMetrics={true}
            sortOption={sortOption}
            onSortSelect={setSortOption}
            filterParams={filterParams}
            onFilterChange={setFilterParams}
            search={search}
            onSearchChange={setSearch}
            selectedMetric={selectedMetric}
            onMetricClick={handleMetricClick}
            onMetricClear={handleMetricClear}
            hasMore={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            accessRestriction={{
                restricted: user.role === 'external_scientist',
                message: 'Access Restricted',
                subMessage: 'You do not have permission to view the dashboard.',
            }}
        />
    );
};
