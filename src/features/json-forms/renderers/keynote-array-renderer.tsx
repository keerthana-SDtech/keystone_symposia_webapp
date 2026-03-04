import { withJsonFormsControlProps, JsonForms } from '@jsonforms/react';
import { and, isControl, rankWith, scopeEndsWith, schemaMatches } from '@jsonforms/core';
import type { ControlProps } from '@jsonforms/core';
import { Users } from 'lucide-react';
import { ArrayItemCard } from '../../../components/ui/array-item-card';
import { AddItemButton } from '../../../components/ui/add-item-button';
import { useArrayFormItems } from '../hooks/use-array-form-items';

const mainFieldsUiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/keynoteSpeaker', label: 'Keynote Speaker', options: { placeholder: 'Enter speaker name' } },
        { type: 'Control', scope: '#/properties/institute', label: 'Institute', options: { placeholder: 'Enter institute' } },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/talkTitle', label: 'Talk Title', options: { placeholder: 'Enter talk title' } },
        { type: 'Control', scope: '#/properties/gender', label: 'Gender' },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/affiliation', label: 'Affiliation' },
        { type: 'Control', scope: '#/properties/occupation', label: 'Occupation' },
      ],
    },
  ],
} as any;

const urUiSchema = {
  type: 'Control',
  scope: '#/properties/ur',
  label: 'UR',
} as any;

const createSpeaker = () => ({
  keynoteSpeaker: '',
  institute: '',
  talkTitle: '',
  gender: '',
  affiliation: '',
  occupation: '',
  ur: '',
});

const KeynoteArrayRenderer = ({ data, handleChange, path, schema, renderers }: ControlProps) => {
  const { items, itemSchema, validationMode, update, add, remove } = useArrayFormItems({
    data, handleChange, path, schema, createItem: createSpeaker,
  });

  return (
    <div className="flex flex-col gap-4">
      {items.map((speaker, index) => (
        <ArrayItemCard
          key={index}
          icon={<Users className="w-4 h-4 text-slate-400" />}
          title={`Keynote Speaker ${index + 1}`}
          onDelete={() => remove(index)}
        >
          <JsonForms
            schema={itemSchema}
            uischema={mainFieldsUiSchema}
            data={speaker}
            renderers={renderers ?? []}
            validationMode={validationMode}
            onChange={({ data: newData }) => update(index, newData)}
          />
          <div className="grid grid-cols-2 gap-6">
            <JsonForms
              schema={itemSchema}
              uischema={urUiSchema}
              data={speaker}
              renderers={renderers ?? []}
              validationMode={validationMode}
              onChange={({ data: newData }) => update(index, newData)}
            />
          </div>
        </ArrayItemCard>
      ))}
      <AddItemButton label="Add Keynote Speaker" onClick={add} showInfo />
    </div>
  );
};

export const keynoteArrayTester = rankWith(
  5,
  and(
    isControl,
    schemaMatches((schema) => schema?.type === 'array'),
    scopeEndsWith('keynoteSpeakers')
  )
);
export default withJsonFormsControlProps(KeynoteArrayRenderer);
