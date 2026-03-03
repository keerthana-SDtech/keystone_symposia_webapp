import { useNavigate, useParams } from 'react-router-dom';
import { FileText, User, BookOpen } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { BackgroundDecorations } from '../components/layout/BackgroundDecorations';
import { MultiStepJsonForm } from '../features/json-forms/components/multi-step-json-form';
import {
  reviewJsonSchema,
  reviewStepUiSchemas,
  REVIEW_STEP_FIELDS,
} from '../features/json-forms/schemas/review.schemas';
import { STEPS, SUBMIT_REVIEW_PAGE_CONTENT } from '../features/review/data/reviewFormConstants';

const STEP_ICONS = [<FileText />, <User />, <BookOpen />];

export default function SubmitReviewPage() {
  const navigate = useNavigate();
  const { conceptId } = useParams();

  return (
    <PageShell className="relative pb-32 bg-[#FAFBFD] min-h-screen overflow-hidden">
      <BackgroundDecorations />

      <div className="w-full max-w-[1720px] mx-auto pt-8 px-6 lg:px-12 relative z-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          {SUBMIT_REVIEW_PAGE_CONTENT.pageTitle}
        </h1>

        <MultiStepJsonForm
          schema={reviewJsonSchema}
          stepUiSchemas={reviewStepUiSchemas}
          stepFields={REVIEW_STEP_FIELDS}
          steps={STEPS}
          stepIcons={STEP_ICONS}
          onSubmit={() => navigate(`/reviewer/review/${conceptId}/submitted`)}
          onCancel={() => navigate(`/reviewer/review/${conceptId}`)}
          cancelLabel={SUBMIT_REVIEW_PAGE_CONTENT.buttons.cancel}
          nextLabel={SUBMIT_REVIEW_PAGE_CONTENT.buttons.next}
          backLabel={SUBMIT_REVIEW_PAGE_CONTENT.buttons.back}
          submitLabel={SUBMIT_REVIEW_PAGE_CONTENT.buttons.submit}
        />
      </div>
    </PageShell>
  );
}
