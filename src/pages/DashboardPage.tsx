import { DashboardView } from "../features/dashboard";
import { PageShell } from "../components/layout/PageShell";

export default function DashboardPage() {
    return (
        <PageShell className="relative pb-24 bg-[#FAFBFD] min-h-screen overflow-hidden">
            {/* Background circular decorations */}
            <div className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-5%] w-[800px] h-[800px] rounded-full border-[1.5px] border-gray-100" />
                <div className="absolute top-[-10%] right-[5%] w-[600px] h-[600px] rounded-full border-[1.5px] border-gray-100" />
                <div className="absolute top-[30%] right-[10%] w-[1200px] h-[1200px] rounded-full border-[1.5px] border-gray-50" />
            </div>

            <div className="w-full max-w-[1650px] mx-auto pt-10 px-8 relative z-10">
                <DashboardView />
            </div>
        </PageShell>
    );
}
