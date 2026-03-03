import { FileText } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../../../../components/ui/input";
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
import { INSTITUTES, SCIENTIFIC_CATEGORIES } from "../../data/reviewFormConstants";

export function ConceptOverviewStep() {
  const { register, control, formState: { errors } } = useFormContext<SubmitReviewValues>();

  return (
    <div className="flex flex-col gap-7">
      <StepHeader icon={<FileText />} title="Concept Overview" step={1} totalSteps={3} />

      <FormField
        label="Conference Title"
        htmlFor="conferenceTitle"
        required
        error={errors.conferenceTitle?.message}
      >
        <Input
          id="conferenceTitle"
          placeholder="Enter conference title"
          className="h-11 text-sm"
          {...register("conferenceTitle")}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="description"
        required
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          placeholder="Enter description"
          className="min-h-[120px] text-sm resize-none"
          {...register("description")}
        />
      </FormField>

      {/* Institute & Scientific Category (2 columns) */}
      <div className="grid grid-cols-2 gap-6">
        <FormField label="Institute" required error={errors.institute?.message}>
          <Controller
            name="institute"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full h-11 text-sm">
                  <SelectValue placeholder="Select institute" />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUTES.map((inst) => (
                    <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Scientific Category" required error={errors.scientificCategory?.message}>
          <Controller
            name="scientificCategory"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full h-11 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SCIENTIFIC_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>
    </div>
  );
}
