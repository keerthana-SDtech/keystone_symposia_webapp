import { useNavigate } from 'react-router-dom';
import { FileText, Mic, LayoutList, Download } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { BackgroundDecorations } from '../components/layout/BackgroundDecorations';
import { Button } from '../components/ui/button';
import { Toast } from '../components/ui/toast';
import { useToast } from '../hooks/useToast';
import { MultiStepJsonForm } from '../features/json-forms/components/multi-step-json-form';
import {
  proposalJsonSchema,
  proposalStepUiSchemas,
  PROPOSAL_STEP_FIELDS,
} from '../features/json-forms/schemas/proposal.schemas';
import {
  PROPOSAL_STEPS,
  SUBMIT_PROPOSAL_PAGE_CONTENT,
} from '../features/organizer/data/submitProposalData';

const STEP_ICONS = [<FileText />, <Mic />, <LayoutList />];

export default function SubmitProposalPage() {
  const navigate = useNavigate();
  const { toast, showToast, closeToast } = useToast();

  const c = SUBMIT_PROPOSAL_PAGE_CONTENT;

  return (
    <PageShell className="relative pb-32 bg-[#FAFBFD] min-h-screen overflow-hidden">
      <BackgroundDecorations />

      <div className="w-full max-w-[1720px] mx-auto pt-8 px-6 lg:px-12 relative z-10">
        {/* Page header row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{c.pageTitle}</h1>
            <p className="text-[13px] text-slate-500 mt-1">{c.pageSubtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-2 text-slate-600 text-[13px] h-9"
              onClick={() => console.log('Download guidelines')}
            >
              <Download className="w-4 h-4" />
              {c.buttons.downloadGuidelines}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 border-slate-300 text-slate-700 text-[13px] h-9"
              onClick={() => showToast('Draft saved successfully.', 'success')}
            >
              {c.buttons.saveAsDraft}
            </Button>
          </div>
        </div>

        <MultiStepJsonForm
          schema={proposalJsonSchema}
          stepUiSchemas={proposalStepUiSchemas}
          stepFields={PROPOSAL_STEP_FIELDS}
          steps={PROPOSAL_STEPS}
          stepIcons={STEP_ICONS}
          initialData={{
            organizers: [{ name: '', institute: '' }],
            keynoteSpeakers: [{ keynoteSpeaker: '', institute: '', talkTitle: '', gender: '', affiliation: '', occupation: '', ur: '' }],
            plenarySessions: [{ speakers: [{ plenarySessionTitle: '', speakerName: '', institute: '', talkTitle: '', affiliation: '', occupation: '', ur: '' }] }],
          }}
          onSubmit={() => navigate('/organizer/proposal/submitted')}
          onSaveAsDraft={() => showToast('Draft saved successfully.', 'success')}
          nextLabel={c.buttons.next}
          backLabel={c.buttons.back}
          submitLabel={c.buttons.submit}
        />
      </div>

      <Toast
        message={toast.message}
        variant={toast.variant}
        visible={toast.visible}
        onClose={closeToast}
      />
    </PageShell>
  );
}
