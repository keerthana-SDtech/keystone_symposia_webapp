import type { JsonSchema, UISchemaElement } from '@jsonforms/core';

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
    keynoteTitle: { type: 'string', minLength: 1 },
    keynoteSpeakerName: { type: 'string', minLength: 1 },
    keynoteSpeakerInstitute: { type: 'string', minLength: 1 },
    keynoteSpeakerBio: { type: 'string' },

    // Step 3 – Plenary Session
    plenarySessionTitle: { type: 'string', minLength: 1 },
    plenaryTopics: { type: 'string', minLength: 1 },
    expectedAttendees: { type: 'string' },
  },
  required: [
    'meetingTitle',
    'organizers',
    'keynoteTitle',
    'keynoteSpeakerName',
    'keynoteSpeakerInstitute',
    'plenarySessionTitle',
    'plenaryTopics',
  ],
};

// ─── Per-step field names (for validation scoping) ────────────────────────────

export const PROPOSAL_STEP_FIELDS: string[][] = [
  ['meetingTitle', 'organizers'],
  ['keynoteTitle', 'keynoteSpeakerName', 'keynoteSpeakerInstitute', 'keynoteSpeakerBio'],
  ['plenarySessionTitle', 'plenaryTopics', 'expectedAttendees'],
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
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/keynoteTitle',
        label: 'Keynote Title',
        options: { placeholder: 'Enter keynote session title' },
      },
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/keynoteSpeakerName',
            label: 'Speaker Name',
            options: { placeholder: 'Enter speaker name' },
          },
          {
            type: 'Control',
            scope: '#/properties/keynoteSpeakerInstitute',
            label: 'Speaker Institute',
            options: { placeholder: 'Enter speaker institute' },
          },
        ],
      },
      {
        type: 'Control',
        scope: '#/properties/keynoteSpeakerBio',
        label: 'Speaker Bio',
        options: { multi: true, placeholder: 'Enter brief speaker bio (optional)' },
      },
    ],
  } as any,

  // Step 3 – Plenary Session
  {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/plenarySessionTitle',
        label: 'Session Title',
        options: { placeholder: 'Enter plenary session title' },
      },
      {
        type: 'Control',
        scope: '#/properties/plenaryTopics',
        label: 'Topics Covered',
        options: { multi: true, placeholder: 'Describe the key topics to be covered' },
      },
      {
        type: 'Control',
        scope: '#/properties/expectedAttendees',
        label: 'Expected Attendees',
        options: { placeholder: 'Estimated number of attendees (optional)' },
      },
    ],
  } as any,
];
