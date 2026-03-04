import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type {
    UseSubmissionsTableOptions,
    UseSubmissionsTableResult,
    DashboardMetric,
} from '../types';

const DEFAULT_BATCH_SIZE = 20;

export function useSubmissionsTable({
    submissions,
    batchSize = DEFAULT_BATCH_SIZE,
}: UseSubmissionsTableOptions): UseSubmissionsTableResult {

    // ── Search ────────────────────────────────────────────────────────────────

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // ── Metric filter ─────────────────────────────────────────────────────────

    const [selectedMetric, setSelectedMetric] = useState<DashboardMetric | null>(null);

    // ── Derived filtered list (sort is handled server-side) ───────────────────

    const filteredSubmissions = useMemo(() => {
        let result = selectedMetric
            ? submissions.filter(s => selectedMetric.statuses?.includes(s.status))
            : submissions;

        const query = debouncedSearch.trim().toLowerCase();
        if (query) {
            result = result.filter(s => s.title.toLowerCase().includes(query));
        }

        return result;
    }, [submissions, selectedMetric, debouncedSearch]);

    // ── Infinite scroll ───────────────────────────────────────────────────────

    const [visibleCount, setVisibleCount] = useState(batchSize);

    useEffect(() => {
        setVisibleCount(batchSize);
    }, [filteredSubmissions.length, batchSize]);

    const visibleRows = useMemo(
        () => filteredSubmissions.slice(0, visibleCount),
        [filteredSubmissions, visibleCount]
    );

    const hasMore = visibleCount < filteredSubmissions.length;

    const loadMore = useCallback(() => {
        if (hasMore) {
            setVisibleCount(prev => Math.min(prev + batchSize, filteredSubmissions.length));
        }
    }, [hasMore, batchSize, filteredSubmissions.length]);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) loadMore();
            },
            { root: null, threshold: 0.1, rootMargin: '0px 0px 200px 0px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, loadMore]);

    return {
        searchTerm,
        setSearchTerm,
        selectedMetric,
        setSelectedMetric,
        filteredSubmissions,
        visibleRows,
        hasMore,
        sentinelRef,
    };
}
