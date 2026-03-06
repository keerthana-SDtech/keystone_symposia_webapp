import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { MetricCards } from './MetricCards';
import { SearchBar } from './SearchBar';
import { FilterSort } from './FilterSort';
import { FilterPanel } from './FilterPanel';
import { StatusBadge } from './StatusBadge';
import { useSubmissionsTable } from '../hooks/useSubmissionsTable';
import type { SubmissionsTableProps } from '../types';
import { TABLE_COLUMNS, DASHBOARD_PAGE_CONTENT } from '../data/dashboardPageData';
import { LoadingSpinner } from '../../../components/feedback/LoadingSpinner';
import { EmptyState } from '../../../components/feedback/EmptyState';

export const SubmissionsTable = ({
    title,
    submissions,
    total,
    metrics,
    loading,
    navigationBasePath,
    submitButton,
    searchPlaceholder = 'Search',
    showMetrics = true,
    accessRestriction,
    sortOption,
    onSortSelect,
    filterParams,
    onFilterChange,
    search,
    onSearchChange,
    selectedMetric,
    onMetricClick,
    onMetricClear,
    hasMore,
    fetchNextPage,
}: SubmissionsTableProps) => {
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = useState(false);

    const { sentinelRef } = useSubmissionsTable({ hasMore, fetchNextPage });

    const filterActive = !!(
        filterParams.dateFrom ||
        filterParams.dateTo ||
        (filterParams.statuses?.length ?? 0) > 0
    );

    const displayTotal = total ?? submissions.length;

    // ── Guards ────────────────────────────────────────────────────────────────

    if (accessRestriction?.restricted) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-[24px] font-semibold text-[#1e293b] mb-2 tracking-tight">
                    {accessRestriction.message ?? 'Access Restricted'}
                </h2>
                <p className="text-[15px] text-[#64748b]">
                    {accessRestriction.subMessage ?? 'You do not have permission to view this page.'}
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full py-20 flex justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            <FilterPanel
                isOpen={filterOpen}
                filterParams={filterParams}
                onApply={onFilterChange}
                onClose={() => setFilterOpen(false)}
            />

            <div className="w-full">

                {/* Header */}
                {selectedMetric ? (
                    <div className="flex items-center gap-2 mb-8 mt-2">
                        <button
                            onClick={onMetricClear}
                            aria-label="Back"
                            className="text-gray-500 hover:text-gray-900 transition-colors p-1 -ml-2 rounded-full hover:bg-gray-100"
                        >
                            <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
                        </button>
                        <h1 className="text-[28px] font-medium text-[#111827] tracking-tight leading-none">
                            {selectedMetric.title} ({displayTotal})
                        </h1>
                    </div>
                ) : (
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight">
                            {title} ({displayTotal})
                        </h1>
                        {submitButton && (
                            <Button
                                onClick={submitButton.onClick}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 rounded-md font-medium text-[14px]"
                            >
                                {submitButton.label}
                            </Button>
                        )}
                    </div>
                )}

                {/* Metric cards */}
                {showMetrics && !selectedMetric && metrics.length > 0 && (
                    <MetricCards metrics={metrics} onMetricClick={onMetricClick} />
                )}

                {/* Table card */}
                <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-4 flex items-center justify-between border-b border-gray-200">
                        <SearchBar
                            value={search}
                            onChange={onSearchChange}
                            placeholder={selectedMetric ? `Search in ${selectedMetric.title}...` : searchPlaceholder}
                        />
                        <FilterSort
                            onFilter={() => setFilterOpen(true)}
                            filterActive={filterActive}
                            sortOption={sortOption}
                            onSortSelect={onSortSelect}
                        />
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAFAFA] border-b border-gray-200">
                                    {TABLE_COLUMNS.map(col => (
                                        <th key={col.key} className={`py-4 px-6 text-[13px] font-medium text-gray-500 ${col.width}`}>
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {submissions.map(row => (
                                    <tr
                                        key={row.id}
                                        onClick={() => navigate(`${navigationBasePath}/${row.id}`)}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                    >
                                        <td className="py-4 px-6 text-[14px] font-medium text-gray-900">{row.title}</td>
                                        <td className="py-4 px-6 text-[14px] text-gray-500">{row.submitter}</td>
                                        <td className="py-4 px-6 text-[14px] text-gray-500">{row.category}</td>
                                        <td className="py-4 px-6 text-[14px] text-gray-500">{row.date}</td>
                                        <td className="py-4 px-6">
                                            <StatusBadge status={row.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Infinite scroll sentinel */}
                    <div ref={sentinelRef} className="h-10 flex items-center justify-center" aria-hidden="true">
                        {hasMore && <LoadingSpinner size="sm" />}
                    </div>

                    {/* Empty state */}
                    {submissions.length === 0 && (
                        <EmptyState message={DASHBOARD_PAGE_CONTENT.emptyState} />
                    )}

                </div>
            </div>
        </>
    );
};
