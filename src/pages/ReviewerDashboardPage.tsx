import { PageShell } from "../components/layout/PageShell";
import { BackgroundDecorations } from "../components/layout/BackgroundDecorations";
import { ReviewDashboardQueues } from "../features/review/components/ReviewDashboardQueues";

export default function ReviewerDashboardPage() {
  return (
    <PageShell className="relative pb-24 bg-[#FAFBFD] min-h-screen overflow-hidden">
      <BackgroundDecorations />
      
      <div className="w-[96%] max-w-[1800px] mx-auto pt-10 relative z-10">
        <ReviewDashboardQueues />
      </div>
    </PageShell>
  );
}
