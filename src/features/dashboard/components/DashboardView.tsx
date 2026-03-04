import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../../app/providers/useAuthContext';
import { useSubmissionsQuery } from '../hooks/useSubmissionsQuery';
import { SubmissionsTable } from './SubmissionsTable';
import type { SortOption, FilterParams } from '../types';

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
            title="Concepts"
            submissions={data?.submissions ?? []}
            metrics={data?.metrics ?? []}
            loading={isLoading}
            navigationBasePath="/dashboard"
            submitButton={{
                label: 'Submit Concept',
                onClick: () => navigate('/submission'),
            }}
            searchPlaceholder="Search all concepts..."
            showMetrics={true}
            batchSize={20}
            sortOption={sortOption}
            onSortSelect={setSortOption}
            filterParams={filterParams}
            onFilterChange={setFilterParams}
            accessRestriction={{
                restricted: user.role === 'external_scientist',
                message: 'Access Restricted',
                subMessage: 'You do not have permission to view the dashboard.',
            }}
        />
    );
};
