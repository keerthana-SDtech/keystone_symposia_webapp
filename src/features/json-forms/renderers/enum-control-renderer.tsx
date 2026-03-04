import { withJsonFormsControlProps } from '@jsonforms/react';
import { isEnumControl, rankWith } from '@jsonforms/core';
import type { ControlProps } from '@jsonforms/core';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

const EnumControlRenderer = ({
  data,
  handleChange,
  path,
  label,
  required,
  errors,
  schema,
  uischema,
  visible,
}: ControlProps) => {
  if (!visible) return null;

  const options = (schema.enum as string[]) ?? [];
  const placeholder = (uischema as any).options?.placeholder ?? 'Select...';
  const hasError = Boolean(errors && errors.length > 0);

  return (
    <div className="flex flex-col gap-2 items-start">
      <Label className="text-[13px] font-semibold text-[#111827]">
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </Label>

      <Select value={data ?? ''} onValueChange={(val) => handleChange(path, val)}>
        <SelectTrigger
          className={`h-11 w-full bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] ${hasError ? 'border-red-500 bg-red-50/50' : 'hover:border-gray-300'}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasError && (
        <p className="text-[11px] text-red-500 font-semibold px-1">{errors}</p>
      )}
    </div>
  );
};

export const enumControlTester = rankWith(3, isEnumControl);
export default withJsonFormsControlProps(EnumControlRenderer);
