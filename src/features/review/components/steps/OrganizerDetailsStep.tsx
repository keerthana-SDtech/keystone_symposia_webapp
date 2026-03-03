import { User } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../../../../components/ui/input";
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
import { INSTITUTES } from "../../data/reviewFormConstants";

export function OrganizerDetailsStep() {
  const { register, control, formState: { errors } } = useFormContext<SubmitReviewValues>();

  return (
    <div className="flex flex-col gap-7">
      <StepHeader icon={<User />} title="Organizer Details" step={2} totalSteps={3} />

      {/* Primary Organizer */}
      <div className="flex flex-col gap-5">
        <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">
          Primary Organizer
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            htmlFor="organizerName"
            required
            error={errors.organizerName?.message}
          >
            <Input
              id="organizerName"
              placeholder="Enter organizer name"
              className="h-11 text-sm"
              {...register("organizerName")}
            />
          </FormField>

          <FormField
            label="Email Address"
            htmlFor="organizerEmail"
            required
            error={errors.organizerEmail?.message}
          >
            <Input
              id="organizerEmail"
              type="email"
              placeholder="organizer@institution.edu"
              className="h-11 text-sm"
              {...register("organizerEmail")}
            />
          </FormField>
        </div>

        <FormField label="Institute" required error={errors.organizerInstitute?.message}>
          <Controller
            name="organizerInstitute"
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
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Co-Organizer (optional) */}
      <div className="flex flex-col gap-5">
        <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">
          Co-Organizer <span className="text-slate-400 normal-case font-normal">(Optional)</span>
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Full Name" htmlFor="coOrganizerName">
            <Input
              id="coOrganizerName"
              placeholder="Enter co-organizer name"
              className="h-11 text-sm"
              {...register("coOrganizerName")}
            />
          </FormField>

          <FormField label="Email Address" htmlFor="coOrganizerEmail">
            <Input
              id="coOrganizerEmail"
              type="email"
              placeholder="co-organizer@institution.edu"
              className="h-11 text-sm"
              {...register("coOrganizerEmail")}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
