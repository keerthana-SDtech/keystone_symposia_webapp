import type { JsonSchema, UISchemaElement } from '@jsonforms/core';

// ─── Enum constants ────────────────────────────────────────────────────────────

export const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
export const AFFILIATIONS = ['Academic', 'Industry', 'Government', 'Non-profit', 'Other'];
export const OCCUPATIONS = [
  'Professor',
  'Researcher',
  'Post-doctoral Fellow',
  'PhD Student',
  'Industry Scientist',
  'Other',
];
export const UR_OPTIONS = ['Yes', 'No', 'Prefer not to say'];

// ─── Full JSON Schema ─────────────────────────────────────────────────────────

export const proposalJsonSchema: JsonSchema = {
  type: 'object',
  properties: {
    // Step 1 – Overview
    meetingTitle: { type: 'string', minLength: 1 },
    organizers: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          institute: { type: 'string', minLength: 1 },
        },
        required: ['name', 'institute'],
      },
    },

    // Step 2 – Keynote Address
    keynoteSpeakers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          keynoteSpeaker: { type: 'string' },
          institute: { type: 'string' },
          talkTitle: { type: 'string' },
          gender: { type: 'string', enum: GENDERS },
          affiliation: { type: 'string', enum: AFFILIATIONS },
          occupation: { type: 'string', enum: OCCUPATIONS },
          ur: { type: 'string', enum: UR_OPTIONS },
        },
      },
    },

    // Step 3 – Plenary Session
    plenarySessions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          speakers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                plenarySessionTitle: { type: 'string' },
                speakerName: { type: 'string' },
                institute: { type: 'string' },
                talkTitle: { type: 'string' },
                affiliation: { type: 'string', enum: AFFILIATIONS },
                occupation: { type: 'string', enum: OCCUPATIONS },
                ur: { type: 'string', enum: UR_OPTIONS },
              },
            },
          },
        },
      },
    },
  },
  required: ['meetingTitle', 'organizers'],
};

// ─── Per-step field names (for validation scoping) ────────────────────────────

export const PROPOSAL_STEP_FIELDS: string[][] = [
  ['meetingTitle', 'organizers'],
  ['keynoteSpeakers'],
  ['plenarySessions'],
];

// ─── Per-step UI schemas ───────────────────────────────────────────────────────

export const proposalStepUiSchemas: UISchemaElement[] = [
  // Step 1 – Overview
  {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/meetingTitle',
        label: 'Meeting Title',
        options: { placeholder: 'Enter conference title' },
      },
      {
        type: 'Control',
        scope: '#/properties/organizers',
        label: 'Organizer Details',
      },
    ],
  } as any,

  // Step 2 – Keynote Address
  {
    type: 'Control',
    scope: '#/properties/keynoteSpeakers',
    label: 'Keynote Speakers',
  } as any,

  // Step 3 – Plenary Session
  {
    type: 'Control',
    scope: '#/properties/plenarySessions',
    label: 'Plenary Sessions',
  } as any,
];
