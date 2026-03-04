import { withJsonFormsControlProps, JsonForms } from '@jsonforms/react';
import { and, isControl, rankWith, scopeEndsWith, schemaMatches } from '@jsonforms/core';
import type { ControlProps } from '@jsonforms/core';
import { User } from 'lucide-react';
import { ArrayItemCard } from '../../../components/ui/array-item-card';
import { AddItemButton } from '../../../components/ui/add-item-button';
import { useArrayFormItems } from '../hooks/use-array-form-items';

const organizerItemUiSchema = {
  type: 'HorizontalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/name', label: 'Name', options: { placeholder: 'Enter name' } },
    { type: 'Control', scope: '#/properties/institute', label: 'Institute', options: { placeholder: 'Enter institute' } },
  ],
} as any;

const createOrganizer = () => ({ name: '', institute: '' });

const OrganizerArrayRenderer = ({ data, handleChange, path, schema, renderers }: ControlProps) => {
  const { items, itemSchema, validationMode, update, add } = useArrayFormItems({
    data, handleChange, path, schema, createItem: createOrganizer,
  });

  return (
    <div className="flex flex-col gap-4">
      {items.map((org, index) => (
        <ArrayItemCard
          key={index}
          icon={<User className="w-4 h-4 text-slate-400" />}
          title={`Organizer Details ${index + 1}`}
        >
          <JsonForms
            schema={itemSchema}
            uischema={organizerItemUiSchema}
            data={org}
            renderers={renderers ?? []}
            validationMode={validationMode}
            onChange={({ data: newData }) => update(index, newData)}
          />
        </ArrayItemCard>
      ))}
      <AddItemButton label="Add Organiser" onClick={add} />
    </div>
  );
};

export const organizerArrayTester = rankWith(
  5,
  and(
    isControl,
    schemaMatches((schema) => schema?.type === 'array'),
    scopeEndsWith('organizers')
  )
);
export default withJsonFormsControlProps(OrganizerArrayRenderer);
