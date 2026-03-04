import { BookOpen } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { StepHeader } from "../../../../components/ui/step-header";
import { FormField } from "../../../../components/ui/form-field";
import type { SubmitReviewValues } from "../../schema/submitReview.schema";
import { RELEVANCE_RATINGS, EXPERTISE_RATINGS } from "../../data/reviewFormConstants";

export function ConferenceRationaleStep() {
  const { register, control, formState: { errors } } = useFormContext<SubmitReviewValues>();

  return (
    <div className="flex flex-col gap-7">
      <StepHeader icon={<BookOpen />} title="Conference Rationale" step={3} totalSteps={3} />

      <FormField
        label="Relevance of the Topic"
        required
        error={errors.relevanceOfTopic?.message}
      >
        <Controller
          name="relevanceOfTopic"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-11 text-sm">
                <SelectValue placeholder="Select relevance rating" />
              </SelectTrigger>
              <SelectContent>
                {RELEVANCE_RATINGS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField
        label="Scientific Quality"
        htmlFor="scientificQuality"
        required
        hint="Comment on methodology, innovation, and proposed speaker quality."
        error={errors.scientificQuality?.message}
      >
        <Textarea
          id="scientificQuality"
          placeholder="Strong methodology and innovation. The proposed speakers are top-tier..."
          className="min-h-[110px] text-sm resize-none"
          {...register("scientificQuality")}
        />
      </FormField>

      <FormField
        label="Topic Distinctness"
        htmlFor="topicDistinctness"
        required
        hint="Is this topic sufficiently distinct from recent Keystone Symposia?"
        error={errors.topicDistinctness?.message}
      >
        <Textarea
          id="topicDistinctness"
          placeholder="This concept is distinct from recent meetings because..."
          className="min-h-[110px] text-sm resize-none"
          {...register("topicDistinctness")}
        />
      </FormField>

      <FormField
        label="Organizer Expertise"
        required
        error={errors.organizerExpertise?.message}
      >
        <Controller
          name="organizerExpertise"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full h-11 text-sm">
                <SelectValue placeholder="Select expertise level" />
              </SelectTrigger>
              <SelectContent>
                {EXPERTISE_RATINGS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label="General Comments" htmlFor="generalComments">
        <Textarea
          id="generalComments"
          placeholder="Any additional comments..."
          className="min-h-[100px] text-sm resize-none"
          {...register("generalComments")}
        />
      </FormField>
    </div>
  );
}
