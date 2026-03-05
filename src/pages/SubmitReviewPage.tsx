import { useNavigate, useParams } from 'react-router-dom';
import { File, User } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { BackgroundDecorations } from '../components/layout/BackgroundDecorations';
import { MultiStepJsonForm } from '../features/json-forms/components/multi-step-json-form';
import reviewImage from '../assets/image.png';
import {
  reviewJsonSchema,
  reviewStepUiSchemas,
  REVIEW_STEP_FIELDS,
} from '../features/json-forms/schemas/review.schemas';
import { STEPS, SUBMIT_REVIEW_PAGE_CONTENT } from '../features/review/data/reviewFormConstants';

const STEP_ICONS = [
    <div className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-[#F9FAFB] p-[5px] mr-[6.25px]"><File className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" /></div>,
    <div className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-[#F9FAFB] p-[5px] mr-[6.25px]"><User className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" /></div>,
    <div className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-[#F9FAFB] p-[5px] mr-[6.25px]"><img src={reviewImage} alt="Review" className="h-[20px] w-[20px]" /></div>
];

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
