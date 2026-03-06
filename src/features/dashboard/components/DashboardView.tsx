import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../../app/providers/useAuthContext';
import { useSubmissionsQuery } from '../hooks/useSubmissionsQuery';
import { SubmissionsTable } from './SubmissionsTable';
import type { SortOption, FilterParams } from '../types';
import { DASHBOARD_PAGE_CONTENT } from '../data/dashboardPageData';

export const DashboardView = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [sortOption, setSortOption] = useState<SortOption>(null);
    const [filterParams, setFilterParams] = useState<FilterParams>({});

    const cycleId = searchParams.get('cycleId') ?? undefined;
    const stage = searchParams.get('stage') ?? undefined;

    const { data, isLoading } = useSubmissionsQuery(user?.role, sortOption, filterParams, cycleId, stage);

    if (!user) return null;

    return (
        <SubmissionsTable
            title={DASHBOARD_PAGE_CONTENT.pageTitle}
            submissions={data?.submissions ?? []}
            metrics={data?.metrics ?? []}
            loading={isLoading}
            navigationBasePath="/dashboard"
            submitButton={{
                label: DASHBOARD_PAGE_CONTENT.button,
                onClick: () => navigate('/submission'),
            }}
            searchPlaceholder={DASHBOARD_PAGE_CONTENT.searchPlaceholder}
            showMetrics={true}
            batchSize={20}
            sortOption={sortOption}
            onSortSelect={setSortOption}
            filterParams={filterParams}
            onFilterChange={setFilterParams}
            accessRestriction={{
                restricted: user.role === 'external_scientist',
                message: DASHBOARD_PAGE_CONTENT.accessRestricted.message,
                subMessage: DASHBOARD_PAGE_CONTENT.accessRestricted.subMessage,
            }}
        />
    );
};
