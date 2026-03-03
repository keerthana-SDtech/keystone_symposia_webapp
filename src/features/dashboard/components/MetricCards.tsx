import { File, Check, Loader } from "lucide-react";
import type { DashboardMetric } from "../types";

export const MetricCards = ({ metrics, onMetricClick }: { metrics: DashboardMetric[], onMetricClick?: (metric: DashboardMetric) => void }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'new': return <File className="h-5 w-5 text-gray-400 stroke-[1.5]" />;
            case 'approved': return <Check className="h-5 w-5 text-gray-400 stroke-[1.5]" />;
            case 'submitted': return <Loader className="h-5 w-5 text-gray-400 stroke-[1.5]" />;
            case 'updates': return <span className="text-gray-400 font-semibold text-lg">!</span>;
            default: return <File className="h-5 w-5 text-gray-400 stroke-[1.5]" />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
                <div
                    key={metric.id}
                    onClick={() => onMetricClick?.(metric)}
                    className="bg-white rounded-[10px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-[32px] font-semibold text-[#111827] leading-none mb-2">{metric.value}</h3>
                            <p className="text-[#6b7280] text-[14px] font-medium">{metric.title}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f9fafb]">
                            {getIcon(metric.type)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
