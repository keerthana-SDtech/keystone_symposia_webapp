import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { JsonFormsDispatch } from '@jsonforms/react';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import type { LayoutProps } from '@jsonforms/core';

const GroupRenderer = ({ uischema, schema, path, renderers, cells, visible }: LayoutProps) => {
  if (!visible) return null;

  const label = (uischema as any).label;

  return (
    <div className="mt-6 flex flex-col gap-6">
      {label && (
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-[14px] pb-2 border-b border-slate-100">
          {label}
        </div>
      )}
      <div className="flex flex-col gap-6">
        {(uischema as any).elements?.map((child: any, index: number) => (
          <JsonFormsDispatch
            key={index}
            uischema={child}
            schema={schema}
            path={path}
            renderers={renderers}
            cells={cells}
          />
        ))}
      </div>
    </div>
  );
};

export const groupTester = rankWith(2, uiTypeIs('Group'));
export default withJsonFormsLayoutProps(GroupRenderer);
