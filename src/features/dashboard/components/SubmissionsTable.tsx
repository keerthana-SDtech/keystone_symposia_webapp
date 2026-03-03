import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import type { SubmissionSummary, SubmissionStatus } from "../types";

const statusConfig: Record<SubmissionStatus, { color: string; border: string }> = {
    'New Submission': { color: 'bg-purple-500', border: 'border-purple-200 text-purple-700' },
    'Shortlisted': { color: 'bg-green-500', border: 'border-green-200 text-green-700' },
    'Banked': { color: 'bg-gray-400', border: 'border-gray-200 text-gray-700' },
    'Rejected': { color: 'bg-red-500', border: 'border-red-200 text-red-700' },
    'Study Group Review': { color: 'bg-yellow-400', border: 'border-yellow-200 text-yellow-700' },
    'SAB Board Meeting': { color: 'bg-yellow-400', border: 'border-yellow-200 text-yellow-700' },
    'Proposal Inprogress': { color: 'bg-blue-500', border: 'border-blue-200 text-blue-700' },
    'Ready for SAB Review': { color: 'bg-blue-500', border: 'border-blue-200 text-blue-700' },
    'SAB Proposal In Review': { color: 'bg-yellow-400', border: 'border-yellow-200 text-yellow-700' },
    'Final Revision': { color: 'bg-blue-500', border: 'border-blue-200 text-blue-700' },
    'Proposal Finalized': { color: 'bg-green-500', border: 'border-green-200 text-green-700' },
};

export const SubmissionsTable = ({
    submissions,
    searchPlaceholder = "Search"
}: {
    submissions: SubmissionSummary[];
    searchPlaceholder?: string;
}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Filter submissions based on debounced search
    const filteredSubmissions = useMemo(() => {
        if (!debouncedSearch.trim()) return submissions;

        const lowerSearch = debouncedSearch.toLowerCase();
        return submissions.filter(sub =>
            sub.title.toLowerCase().includes(lowerSearch)
        );
    }, [submissions, debouncedSearch]);

    return (
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200">
                        <Filter className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200">
                        <SlidersHorizontal className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Table Body */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#FAFAFA] border-b border-gray-200">
                            <th className="py-4 px-6 text-[13px] font-medium text-gray-500 w-[30%]">Title</th>
                            <th className="py-4 px-6 text-[13px] font-medium text-gray-500 w-[15%]">Submitter</th>
                            <th className="py-4 px-6 text-[13px] font-medium text-gray-500 w-[20%]">Category</th>
                            <th className="py-4 px-6 text-[13px] font-medium text-gray-500 w-[15%]">Date</th>
                            <th className="py-4 px-6 text-[13px] font-medium text-gray-500 w-[20%]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredSubmissions.map((submission) => {
                            const pillConfig = statusConfig[submission.status] || { color: 'bg-gray-500', border: 'border-gray-200 text-gray-700' };

                            return (
                                <tr
                                    key={submission.id}
                                    onClick={() => navigate(`/dashboard/${submission.id}`)}
                                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="py-4 px-6">
                                        <span className="text-[14px] font-medium text-gray-900">{submission.title}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-[14px] text-gray-500">{submission.submitter}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-[14px] text-gray-500">{submission.category}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-[14px] text-gray-500">{submission.date}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${pillConfig.border} bg-white text-[13px]`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${pillConfig.color}`} />
                                            {submission.status}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Empty State Layout */}
            {filteredSubmissions.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                    <p className="text-gray-500 text-sm">No submissions found.</p>
                </div>
            )}
        </div>
    );
};
