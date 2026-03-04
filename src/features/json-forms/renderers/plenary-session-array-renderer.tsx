import { withJsonFormsControlProps, JsonForms } from '@jsonforms/react';
import { and, isControl, rankWith, scopeEndsWith, schemaMatches } from '@jsonforms/core';
import type { ControlProps } from '@jsonforms/core';
import { Users, Trash2, FileText } from 'lucide-react';
import { StepHeader } from '../../../components/ui/step-header';
import { AddItemButton } from '../../../components/ui/add-item-button';
import { ArrayItemHeader } from '../../../components/ui/array-item-header';
import { useArrayFormItems } from '../hooks/use-array-form-items';

interface PlenarySpeaker {
  plenarySessionTitle: string;
  speakerName: string;
  institute: string;
  talkTitle: string;
  affiliation: string;
  occupation: string;
  ur: string;
}

interface PlenarySession {
  speakers: PlenarySpeaker[];
}

const speakerMainUiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/plenarySessionTitle', label: 'Plenary Session Title', options: { placeholder: 'Enter plenary session title' } },
        { type: 'Control', scope: '#/properties/speakerName', label: 'Speaker Name', options: { placeholder: 'Enter speaker name' } },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/institute', label: 'Institute', options: { placeholder: 'Enter institute' } },
        { type: 'Control', scope: '#/properties/talkTitle', label: 'Talk Title', options: { placeholder: 'Enter talk title' } },
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

const createSpeaker = (): PlenarySpeaker => ({
  plenarySessionTitle: '',
  speakerName: '',
  institute: '',
  talkTitle: '',
  affiliation: '',
  occupation: '',
  ur: '',
});

const createSession = (): PlenarySession => ({ speakers: [createSpeaker()] });

const PlenarySessionArrayRenderer = ({ data, handleChange, path, schema, renderers }: ControlProps) => {
  const {
    items: sessions,
    itemSchema: sessionSchema,
    validationMode,
    update: updateSession,
    add: addSession,
    remove: removeSession,
  } = useArrayFormItems<PlenarySession>({ data, handleChange, path, schema, createItem: createSession });

  const speakerSchema = sessionSchema?.properties?.speakers?.items;

  const updateSpeaker = (si: number, pi: number, speakerData: PlenarySpeaker) => {
    updateSession(si, {
      ...sessions[si],
      speakers: sessions[si].speakers.map((sp, i) => (i === pi ? speakerData : sp)),
    });
  };

  const addSpeaker = (si: number) => {
    updateSession(si, { ...sessions[si], speakers: [...sessions[si].speakers, createSpeaker()] });
  };

  const removeSpeaker = (si: number, pi: number) => {
    updateSession(si, {
      ...sessions[si],
      speakers: sessions[si].speakers.filter((_, i) => i !== pi),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {sessions.map((session, si) => (
        <div key={si} className="flex flex-col gap-7">
          {si > 0 && (
            <StepHeader
              icon={<FileText />}
              title={`Plenary Session ${si + 1}`}
              action={
                <button
                  type="button"
                  onClick={() => removeSession(si)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              }
            />
          )}

          <div className="border border-slate-200 rounded-[10px] p-5 flex flex-col gap-5">
            {/* Session 1 trash button — shown inside the card only when multiple sessions exist */}
            {si === 0 && sessions.length > 1 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeSession(si)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            {session.speakers.map((speaker, pi) => (
              <div key={pi} className="flex flex-col gap-4">
                {pi > 0 && <hr className="border-slate-200" />}

                <ArrayItemHeader
                  icon={<Users className="w-4 h-4 text-slate-400" />}
                  title={`Speaker ${pi + 1}`}
                  onDelete={session.speakers.length > 1 ? () => removeSpeaker(si, pi) : undefined}
                />

                <JsonForms
                  schema={speakerSchema}
                  uischema={speakerMainUiSchema}
                  data={speaker}
                  renderers={renderers ?? []}
                  validationMode={validationMode}
                  onChange={({ data: newData }) => updateSpeaker(si, pi, newData)}
                />
                <div className="grid grid-cols-2 gap-6">
                  <JsonForms
                    schema={speakerSchema}
                    uischema={urUiSchema}
                    data={speaker}
                    renderers={renderers ?? []}
                    validationMode={validationMode}
                    onChange={({ data: newData }) => updateSpeaker(si, pi, newData)}
                  />
                </div>
              </div>
            ))}
            <AddItemButton label="Add Speaker" onClick={() => addSpeaker(si)} showInfo />
          </div>
        </div>
      ))}
      <AddItemButton label="Add Plenary Session" onClick={addSession} />
    </div>
  );
};

export const plenarySessionArrayTester = rankWith(
  5,
  and(
    isControl,
    schemaMatches((schema) => schema?.type === 'array'),
    scopeEndsWith('plenarySessions')
  )
);
export default withJsonFormsControlProps(PlenarySessionArrayRenderer);
