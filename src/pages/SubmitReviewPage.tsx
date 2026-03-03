import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageShell } from "../components/layout/PageShell";
import { BackgroundDecorations } from "../components/layout/BackgroundDecorations";
import { Button } from "../components/ui/button";
import { Stepper } from "../features/form-submission/components/stepper";
import { ConceptOverviewStep } from "../features/review/components/steps/ConceptOverviewStep";
import { OrganizerDetailsStep } from "../features/review/components/steps/OrganizerDetailsStep";
import { ConferenceRationaleStep } from "../features/review/components/steps/ConferenceRationaleStep";
import {
  conceptOverviewSchema,
  organizerDetailsSchema,
  conferenceRationaleSchema,
  submitReviewSchema,
  type SubmitReviewValues,
} from "../features/review/schema/submitReview.schema";
import { STEPS } from "../features/review/data/reviewFormConstants";


const stepSchemas = [conceptOverviewSchema, organizerDetailsSchema, conferenceRationaleSchema];

export default function SubmitReviewPage() {
  const navigate = useNavigate();
  const { conceptId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [attemptedSteps, setAttemptedSteps] = useState<string[]>([]);

  const activeSection = STEPS[activeIndex].id;

  const methods = useForm<SubmitReviewValues>({
    resolver: zodResolver(submitReviewSchema),
    mode: "onChange",
    defaultValues: {
      conferenceTitle: "",
      description: "",
      institute: "",
      scientificCategory: "",
      organizerName: "",
      organizerEmail: "",
      organizerInstitute: "",
      coOrganizerName: "",
      coOrganizerEmail: "",
      relevanceOfTopic: "",
      scientificQuality: "",
      topicDistinctness: "",
      organizerExpertise: "",
      generalComments: "",
    },
  });

  const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    const stepSchema = stepSchemas[activeIndex];
    const stepFields = Object.keys(stepSchema.shape) as (keyof SubmitReviewValues)[];
    const isValid = await trigger(stepFields);

    setAttemptedSteps((prev) => [...new Set([...prev, activeSection])]);

    if (isValid) {
      setCompletedSteps((prev) => [...new Set([...prev, activeSection])]);
      setActiveIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSectionChange = (id: string) => {
    const idx = STEPS.findIndex((s) => s.id === id);
    if (idx <= activeIndex) {
      setActiveIndex(idx);
    }
  };

  const onSubmit = (data: SubmitReviewValues) => {
    console.log("Review submitted:", data);
    // TODO: connect to real API
    navigate(`/reviewer/review/${conceptId}/submitted`);
  };

  return (
    <PageShell className="relative pb-32 bg-[#FAFBFD] min-h-screen overflow-hidden">
      <BackgroundDecorations />

      <div className="w-full max-w-[1720px] mx-auto pt-8 px-6 lg:px-12 relative z-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Submit Review Questionnaire</h1>

        <div className="flex gap-0 items-start">
          {/* Reusable Stepper from form-submission — negative margin counteracts Stepper's built-in md:mt-2 */}
          <div className="-mt-2 min-h-[700px]">
            <Stepper
              sections={STEPS}
              activeSection={activeSection}
              activeIndex={activeIndex}
              completedSteps={completedSteps}
              attemptedSteps={attemptedSteps}
              isActiveValid={false}
              onSectionChange={handleSectionChange}
            />
          </div>

          {/* Form Card */}
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 bg-white rounded-[10px] rounded-tl-none border border-slate-200 shadow-[2px_2px_8px_rgba(0,0,0,0.04)] p-10 lg:px-14 min-h-[700px]"
            >
              {activeIndex === 0 && <ConceptOverviewStep />}
              {activeIndex === 1 && <OrganizerDetailsStep />}
              {activeIndex === 2 && <ConferenceRationaleStep />}
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-4 flex justify-end gap-3 z-50">
        <Button
          type="button"
          variant="outline"
          className="px-8 border-slate-300 text-slate-700 h-11"
          onClick={() => navigate(`/reviewer/review/${conceptId}`)}
        >
          Cancel
        </Button>

        {activeIndex > 0 && (
          <Button
            type="button"
            variant="outline"
            className="px-8 border-slate-300 text-slate-700 h-11"
            onClick={handleBack}
          >
            Back
          </Button>
        )}

        {activeIndex < STEPS.length - 1 ? (
          <Button
            type="button"
            className="bg-[#58008e] hover:bg-[#4a0078] text-white px-10 h-11"
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            className="bg-[#58008e] hover:bg-[#4a0078] text-white px-10 h-11"
            onClick={handleSubmit(onSubmit)}
          >
            Submit Review
          </Button>
        )}
      </div>
    </PageShell>
  );
}
