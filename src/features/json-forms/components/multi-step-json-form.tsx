import { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import type { JsonSchema, UISchemaElement, ValidationMode } from '@jsonforms/core';
import type { ErrorObject } from 'ajv';
import { Button } from '../../../components/ui/button';
import { StepHeader } from '../../../components/ui/step-header';
import { Stepper } from '../../form-submission/components/stepper';
import { customRenderers } from '../renderers/renderers';
import { isStepValid } from '../utils/step-validation';

interface MultiStepJsonFormProps {
  schema: JsonSchema;
  stepUiSchemas: UISchemaElement[];
  stepFields: string[][];
  steps: { id: string; label: string; headerLabel?: string }[];
  stepIcons?: React.ReactNode[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  onSaveAsDraft?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  nextLabel?: string;
  backLabel?: string;
}

export function MultiStepJsonForm({
  schema,
  stepUiSchemas,
  stepFields,
  steps,
  stepIcons,
  initialData = {},
  onSubmit,
  onCancel,
  onSaveAsDraft,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  nextLabel = 'Next',
  backLabel = 'Back',
}: MultiStepJsonFormProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [attemptedSteps, setAttemptedSteps] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const [validationMode, setValidationMode] = useState<ValidationMode>('ValidateAndHide');

  const activeSection = steps[activeIndex].id;

  useEffect(() => {
    setValidationMode('ValidateAndHide');
  }, [activeIndex]);

  const handleChange = ({ data: newData, errors: newErrors }: { data: any; errors: ErrorObject[] }) => {
    setData(newData ?? {});
    setErrors(newErrors ?? []);
  };

  const handleNext = () => {
    setAttemptedSteps((prev) => [...new Set([...prev, activeSection])]);
    setValidationMode('ValidateAndShow');

    if (isStepValid(errors, stepFields[activeIndex])) {
      setCompletedSteps((prev) => [...new Set([...prev, activeSection])]);
      setValidationMode('ValidateAndHide');
      setActiveIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSectionChange = (id: string) => {
    const idx = steps.findIndex((s) => s.id === id);
    if (idx <= activeIndex) setActiveIndex(idx);
  };

  const isLastStep = activeIndex === steps.length - 1;

  return (
    <>
      <div className="flex gap-0 items-start">
        <div className="-mt-2 min-h-[700px]">
          <Stepper
            sections={steps}
            activeSection={activeSection}
            activeIndex={activeIndex}
            completedSteps={completedSteps}
            attemptedSteps={attemptedSteps}
            isActiveValid={isStepValid(errors, stepFields[activeIndex])}
            onSectionChange={handleSectionChange}
          />
        </div>

        <div className="flex-1 bg-white rounded-[10px] rounded-tl-none border border-slate-200 shadow-[2px_2px_8px_rgba(0,0,0,0.04)] p-10 lg:px-14 min-h-[700px]">
          <div className="flex flex-col gap-7">
            <StepHeader
              icon={stepIcons?.[activeIndex]}
              title={steps[activeIndex].headerLabel ?? steps[activeIndex].label}
              step={activeIndex + 1}
              totalSteps={steps.length}
            />
            <JsonForms
              schema={schema}
              uischema={stepUiSchemas[activeIndex]}
              data={data}
              renderers={customRenderers}
              onChange={handleChange}
              validationMode={validationMode}
            />
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-4 flex justify-end gap-3 z-50">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="px-8 border-slate-300 text-slate-700 h-11"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        )}

        {onSaveAsDraft && (
          <Button
            type="button"
            variant="ghost"
            className="text-slate-600 text-[13px] h-9"
            onClick={onSaveAsDraft}
          >
            Save as Draft
          </Button>
        )}

        <Button
          type="button"
          variant={onCancel ? 'outline' : 'secondary'}
          className="px-8 border-slate-300 text-slate-700 h-11"
          onClick={handleBack}
          disabled={activeIndex === 0}
        >
          {backLabel}
        </Button>

        <Button
          type="button"
          className="bg-[#58008e] hover:bg-[#4a0078] text-white px-10 h-11"
          onClick={isLastStep ? () => onSubmit(data) : handleNext}
        >
          {isLastStep ? submitLabel : nextLabel}
        </Button>
      </div>
    </>
  );
}
