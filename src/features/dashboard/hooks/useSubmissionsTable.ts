import { useRef, useEffect } from 'react';

export interface UseSubmissionsTableOptions {
    hasMore: boolean;
    fetchNextPage: () => void;
}

export interface UseSubmissionsTableResult {
    sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export function useSubmissionsTable({ hasMore, fetchNextPage }: UseSubmissionsTableOptions): UseSubmissionsTableResult {
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) fetchNextPage();
            },
            { root: null, threshold: 0.1, rootMargin: '0px 0px 200px 0px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, fetchNextPage]);

    return { sentinelRef };
}
