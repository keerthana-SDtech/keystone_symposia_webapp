import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../app/providers/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { MetricCards } from './MetricCards';
import { SubmissionsTable } from './SubmissionsTable';
import { getDashboardData } from '../api/mockData';
import { Button } from "../../../components/ui/button";
import type { DashboardMetric, SubmissionSummary } from '../types';

export const DashboardView = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
    const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<DashboardMetric | null>(null);

    useEffect(() => {
        const loadMockData = async () => {
            if (user?.role) {
                // In future, roles can pass specific status filters to getDashboardData(user.role, ['SAB Board Meeting'])
                const data = await getDashboardData(user.role);
                setMetrics(data.metrics);
                setSubmissions(data.submissions);
            }
            setLoading(false);
        };

        loadMockData();
    }, [user?.role]);

    const filteredSubmissions = selectedMetric
        ? submissions.filter(s => selectedMetric.statuses?.includes(s.status))
        : submissions;

    if (!user) {
        return null;
    }

    if (user.role === 'external_scientist') {
        return (
            <div className="w-full py-10 flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Restricted</h2>
                <p className="text-gray-500">You do not have permission to view the dashboard.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full py-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {selectedMetric ? (
                <div className="flex items-center gap-2 mb-8 mt-2">
                    <button
                        onClick={() => setSelectedMetric(null)}
                        className="text-gray-500 hover:text-gray-900 transition-colors p-1 -ml-2 cursor-pointer rounded-full hover:bg-gray-100"
                        aria-label="Back to Concepts"
                    >
                        <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
                    </button>
                    <h1 className="text-[28px] font-medium text-[#111827] tracking-tight leading-none">
                        {selectedMetric.title} ({filteredSubmissions.length})
                    </h1>
                </div>
            ) : (
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight">
                        Concepts ({submissions.length})
                    </h1>
                    <Button
                        onClick={() => navigate("/submission")}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 rounded-md font-medium text-[14px]"
                    >
                        Submit Concept
                    </Button>
                </div>
            )}

            {!selectedMetric && (
                <MetricCards metrics={metrics} onMetricClick={setSelectedMetric} />
            )}
            <SubmissionsTable
                submissions={filteredSubmissions}
                searchPlaceholder={selectedMetric ? `Search in ${selectedMetric.title}...` : "Search all concepts..."}
            />
        </div>
    );
};
