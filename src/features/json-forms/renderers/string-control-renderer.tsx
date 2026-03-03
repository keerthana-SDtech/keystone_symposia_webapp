import { withJsonFormsControlProps } from '@jsonforms/react';
import { isStringControl, rankWith, and, not, isEnumControl } from '@jsonforms/core';
import type { ControlProps } from '@jsonforms/core';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';

const StringControlRenderer = ({
  data,
  handleChange,
  path,
  label,
  required,
  errors,
  uischema,
  enabled,
  visible,
}: ControlProps) => {
  if (!visible) return null;

  const isMulti = (uischema as any).options?.multi === true;
  const isPassword = (uischema as any).options?.format === 'password';
  const placeholder = (uischema as any).options?.placeholder ?? '';
  const hint = (uischema as any).options?.hint as string | undefined;
  const hasError = Boolean(errors && errors.length > 0);

  return (
    <div className="flex flex-col gap-2 items-start">
      <Label className="text-[13px] font-semibold text-[#111827]">
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </Label>
      {hint && <p className="text-[12px] text-slate-500 -mt-1">{hint}</p>}

      {isMulti ? (
        <Textarea
          value={data ?? ''}
          onChange={(e) => handleChange(path, e.target.value)}
          placeholder={placeholder}
          disabled={!enabled}
          rows={4}
          className={`w-full bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] resize-none ${hasError ? 'border-red-500 bg-red-50/50' : 'hover:border-gray-300'}`}
        />
      ) : (
        <Input
          type={isPassword ? 'password' : 'text'}
          value={data ?? ''}
          onChange={(e) => handleChange(path, e.target.value)}
          placeholder={placeholder}
          disabled={!enabled}
          autoComplete={isPassword ? 'current-password' : undefined}
          className={`h-11 w-full bg-[#f9fafb] border-gray-200 focus:bg-white focus:border-primary transition-all text-[#111827] text-[14.5px] ${hasError ? 'border-red-500 bg-red-50/50' : 'hover:border-gray-300'}`}
        />
      )}

      {hasError && (
        <p className="text-[11px] text-red-500 font-semibold px-1">{errors}</p>
      )}
    </div>
  );
};

export const stringControlTester = rankWith(3, and(isStringControl, not(isEnumControl)));
export default withJsonFormsControlProps(StringControlRenderer);
