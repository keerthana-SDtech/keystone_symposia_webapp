import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { rankWith, uiTypeIs } from '@jsonforms/core';

const LabelRenderer = ({ uischema, visible }: any) => {
  if (!visible) return null;

  const isOptional = uischema.options?.optional;
  const isDivider = uischema.options?.divider;

  if (isDivider) {
    return <div className="h-px bg-slate-100" />;
  }

  return (
    <h3 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">
      {uischema.text}
      {isOptional && (
        <span className="text-slate-400 normal-case font-normal ml-1">(Optional)</span>
      )}
    </h3>
  );
};

export const labelTester = rankWith(10, uiTypeIs('Label'));
export default withJsonFormsLayoutProps(LabelRenderer);
