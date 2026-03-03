import { PageShell } from "../components/layout/PageShell";
import { Button } from "../components/ui/button";
import { File, Check, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_PAGE_CONTENT, DASHBOARD_METRIC_CARDS } from "../features/dashboard/data/dashboardPageData";

const ICON_MAP: Record<string, React.ReactNode> = {
    "File": <File className="h-5 w-5 text-gray-400 stroke-[1.5]" />,
    "Check": <Check className="h-5 w-5 text-gray-400 stroke-[1.5]" />,
    "Loader": <Loader className="h-5 w-5 text-gray-400 stroke-[1.5]" />,
    "Alert": <span className="text-gray-400 font-semibold text-lg">!</span>,
};

export default function DashboardPage() {
    const navigate = useNavigate();

    return (
        <PageShell className="relative pb-24 bg-[#FAFBFD] min-h-screen overflow-hidden">
            {/* Background circular decorations */}
            <div className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-5%] w-[800px] h-[800px] rounded-full border-[1.5px] border-gray-100" />
                <div className="absolute top-[-10%] right-[5%] w-[600px] h-[600px] rounded-full border-[1.5px] border-gray-100" />
                <div className="absolute top-[30%] right-[10%] w-[1200px] h-[1200px] rounded-full border-[1.5px] border-gray-50" />
            </div>

            <div className="w-full max-w-[1200px] mx-auto pt-10 px-8 relative z-10">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight">
                        {DASHBOARD_PAGE_CONTENT.pageTitle}
                    </h1>
                    <Button
                        onClick={() => navigate("/submission")}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 rounded-md font-medium text-[14px]"
                    >
                        {DASHBOARD_PAGE_CONTENT.button}
                    </Button>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {DASHBOARD_METRIC_CARDS.map((card) => (
                        <div key={card.id} className="bg-white rounded-[10px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-[32px] font-semibold text-[#111827] leading-none mb-2">{card.value}</h3>
                                    <p className="text-[#6b7280] text-[14px] font-medium">{card.label}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f9fafb]">
                                    {ICON_MAP[card.icon]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    );
}
