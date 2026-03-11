import { useRef, useState, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';

type SortOption = 'az' | 'za' | 'newest' | 'oldest' | null;

interface FilterSortProps {
    onFilter: () => void;
    filterActive: boolean;
    sortOption: SortOption;
    onSortSelect: (option: SortOption) => void;
}

const SORT_OPTIONS: { value: NonNullable<SortOption>; label: string }[] = [
    { value: 'az',     label: 'A to Z'     },
    { value: 'za',     label: 'Z to A'     },
    { value: 'newest', label: 'New to Old' },
    { value: 'oldest', label: 'Old to New' },
];

export const FilterSort = ({ onFilter, filterActive, sortOption, onSortSelect }: FilterSortProps) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const handleSelect = (value: NonNullable<SortOption>) => {
        onSortSelect(sortOption === value ? null : value);
        setOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onFilter}
                title="Filter"
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200"
            >
                <Filter className="h-4 w-4" />
                {filterActive && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
            </button>

            <div ref={containerRef} className="relative">
                <button
                    onClick={() => setOpen(prev => !prev)}
                    title="Sort"
                    className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    {sortOption !== null && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                </button>

                {open && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
                        {SORT_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                            >
                                <span
                                    className={`h-2 w-2 rounded-full shrink-0 ${
                                        sortOption === opt.value ? 'bg-red-500' : 'bg-transparent'
                                    }`}
                                />
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
