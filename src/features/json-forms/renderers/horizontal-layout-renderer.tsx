import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { JsonFormsDispatch } from '@jsonforms/react';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import type { LayoutProps } from '@jsonforms/core';

const HorizontalLayoutRenderer = ({ uischema, schema, path, renderers, cells, visible }: LayoutProps) => {
  if (!visible) return null;

  const elements = (uischema as any).elements ?? [];

  return (
    <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${elements.length}, 1fr)` }}>
      {elements.map((child: any, index: number) => (
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

export const horizontalLayoutTester = rankWith(1, uiTypeIs('HorizontalLayout'));
export default withJsonFormsLayoutProps(HorizontalLayoutRenderer);
