import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { JsonFormsDispatch } from '@jsonforms/react';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import type { LayoutProps } from '@jsonforms/core';

const VerticalLayoutRenderer = ({ uischema, schema, path, renderers, cells, visible }: LayoutProps) => {
  if (!visible) return null;

  return (
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
  );
};

export const verticalLayoutTester = rankWith(1, uiTypeIs('VerticalLayout'));
export default withJsonFormsLayoutProps(VerticalLayoutRenderer);
