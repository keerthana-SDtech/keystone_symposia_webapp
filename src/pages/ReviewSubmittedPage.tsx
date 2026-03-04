import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { BackgroundDecorations } from "../components/layout/BackgroundDecorations";
import { SuccessCard } from "../components/ui/success-card";
import { REVIEW_SUBMITTED_PAGE_CONTENT } from "../features/review/data/reviewFormConstants";

export default function ReviewSubmittedPage() {
  const navigate = useNavigate();

  return (
    <PageShell className="relative min-h-screen bg-[#FAFBFD] overflow-hidden">
      <BackgroundDecorations />

      <div className="relative z-10 w-full max-w-[620px] mx-auto px-6 pt-20">
        <SuccessCard
          title={REVIEW_SUBMITTED_PAGE_CONTENT.title}
          subtitle={REVIEW_SUBMITTED_PAGE_CONTENT.subtitle}
          ctaLabel={REVIEW_SUBMITTED_PAGE_CONTENT.cta}
          onCta={() => navigate("/reviewer/dashboard")}
        />
      </div>
    </PageShell>
  );
}
