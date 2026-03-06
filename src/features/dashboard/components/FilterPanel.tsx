import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { SUBMISSION_STATUSES, FILTER_PANEL_CONTENT } from '../data/dashboardPageData';
import type { FilterPanelProps, SubmissionStatus } from '../types';

export const FilterPanel = ({ isOpen, filterParams, onApply, onClose }: FilterPanelProps) => {
    const [dateFrom, setDateFrom] = useState(filterParams.dateFrom ?? '');
    const [dateTo, setDateTo] = useState(filterParams.dateTo ?? '');
    const [statuses, setStatuses] = useState<SubmissionStatus[]>(filterParams.statuses ?? []);
    const [statusOpen, setStatusOpen] = useState(false);
    const statusRef = useRef<HTMLDivElement>(null);

    // Sync staged state whenever the panel opens
    useEffect(() => {
        if (isOpen) {
            setDateFrom(filterParams.dateFrom ?? '');
            setDateTo(filterParams.dateTo ?? '');
            setStatuses(filterParams.statuses ?? []);
            setStatusOpen(false);
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close status dropdown on outside click
    useEffect(() => {
        if (!statusOpen) return;
        const handler = (e: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
                setStatusOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [statusOpen]);

    if (!isOpen) return null;

    const toggleStatus = (s: SubmissionStatus) =>
        setStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const handleClearAll = () => {
        setDateFrom('');
        setDateTo('');
        setStatuses([]);
    };

    const handleDone = () => {
        onApply({
            ...(dateFrom ? { dateFrom } : {}),
            ...(dateTo   ? { dateTo }   : {}),
            ...(statuses.length ? { statuses } : {}),
        });
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-2xl flex flex-col">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{FILTER_PANEL_CONTENT.title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">{FILTER_PANEL_CONTENT.dateFrom}</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">{FILTER_PANEL_CONTENT.dateTo}</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={e => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Status multi-select */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">{FILTER_PANEL_CONTENT.statusLabel}</label>
                        <div ref={statusRef} className="relative">

                            {/* Trigger */}
                            <button
                                type="button"
                                onClick={() => setStatusOpen(prev => !prev)}
                                className="w-full min-h-[40px] px-3 py-2 border border-gray-200 rounded-md text-sm text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            >
                                {statuses.length === 0 ? (
                                    <span className="text-gray-400">{FILTER_PANEL_CONTENT.statusPlaceholder}</span>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                        {statuses.map(s => (
                                            <span
                                                key={s}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                            >
                                                {s}
                                                <button
                                                    type="button"
                                                    onClick={e => { e.stopPropagation(); toggleStatus(s); }}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            {statusOpen && (
                                <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-56 overflow-y-auto py-1">
                                    {SUBMISSION_STATUSES.map(s => (
                                        <label
                                            key={s}
                                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={statuses.includes(s)}
                                                onChange={() => toggleStatus(s)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary accent-primary"
                                            />
                                            <span className="text-sm text-gray-700">{s}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        {FILTER_PANEL_CONTENT.clearAll}
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            {FILTER_PANEL_CONTENT.cancel}
                        </button>
                        <button
                            onClick={handleDone}
                            className="px-4 py-2 text-sm text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
                        >
                            {FILTER_PANEL_CONTENT.done}
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};
