import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { BackgroundDecorations } from '../components/layout/BackgroundDecorations';
import { SuccessCard } from '../components/ui/success-card';

export default function ProposalSubmittedPage() {
  const navigate = useNavigate();

  return (
    <PageShell className="relative min-h-screen bg-[#FAFBFD] overflow-hidden">
      <BackgroundDecorations />

      <div className="relative z-10 w-full max-w-[620px] mx-auto px-6 pt-20">
        <SuccessCard
          title="Conference Proposal Submitted!"
          subtitle="Thank you for submitting your proposal"
          ctaLabel="Go to Dashboard"
          onCta={() => navigate('/organizer')}
        >
          <div className="w-full flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
            <Mail className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="text-left">
              <p className="text-[13px] text-slate-500">Email confirmation sent to:</p>
              <p className="text-[13px] font-medium text-slate-700">abc@gmail.com</p>
            </div>
          </div>
        </SuccessCard>
      </div>
    </PageShell>
  );
}
