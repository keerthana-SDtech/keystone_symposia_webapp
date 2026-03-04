import type { JsonSchema, UISchemaElement } from '@jsonforms/core';
import {
  INSTITUTES,
  SCIENTIFIC_CATEGORIES,
  RELEVANCE_RATINGS,
  EXPERTISE_RATINGS,
} from '../../review/data/reviewFormConstants';

// ─── Full JSON Schema ─────────────────────────────────────────────────────────

export const reviewJsonSchema: JsonSchema = {
  type: 'object',
  properties: {
    // Step 1 – Concept Overview
    conferenceTitle: { type: 'string', minLength: 3 },
    description: { type: 'string', minLength: 10 },
    institute: { type: 'string', enum: INSTITUTES },
    scientificCategory: { type: 'string', enum: SCIENTIFIC_CATEGORIES },

    // Step 2 – Organizer Details
    organizerName: { type: 'string', minLength: 2 },
    organizerEmail: { type: 'string', format: 'email' },
    organizerInstitute: { type: 'string', enum: INSTITUTES },
    coOrganizerName: { type: 'string' },
    coOrganizerEmail: { type: 'string' },

    // Step 3 – Conference Rationale
    relevanceOfTopic: { type: 'string', enum: RELEVANCE_RATINGS },
    scientificQuality: { type: 'string', minLength: 20 },
    topicDistinctness: { type: 'string', minLength: 20 },
    organizerExpertise: { type: 'string', enum: EXPERTISE_RATINGS },
    generalComments: { type: 'string' },
  },
  required: [
    'conferenceTitle',
    'description',
    'institute',
    'scientificCategory',
    'organizerName',
    'organizerEmail',
    'organizerInstitute',
    'relevanceOfTopic',
    'scientificQuality',
    'topicDistinctness',
    'organizerExpertise',
  ],
};

// ─── Per-step field names (for validation scoping) ────────────────────────────

export const REVIEW_STEP_FIELDS: string[][] = [
  ['conferenceTitle', 'description', 'institute', 'scientificCategory'],
  ['organizerName', 'organizerEmail', 'organizerInstitute', 'coOrganizerName', 'coOrganizerEmail'],
  ['relevanceOfTopic', 'scientificQuality', 'topicDistinctness', 'organizerExpertise', 'generalComments'],
];

// ─── Per-step UI schemas ───────────────────────────────────────────────────────

export const reviewStepUiSchemas: UISchemaElement[] = [
  // Step 1 – Concept Overview
  {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/conferenceTitle',
        label: 'Conference Title',
        options: { placeholder: 'Enter conference title' },
      },
      {
        type: 'Control',
        scope: '#/properties/description',
        label: 'Description',
        options: { multi: true, placeholder: 'Enter description' },
      },
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/institute',
            label: 'Institute',
            options: { placeholder: 'Select institute' },
          },
          {
            type: 'Control',
            scope: '#/properties/scientificCategory',
            label: 'Scientific Category',
            options: { placeholder: 'Select category' },
          },
        ],
      },
    ],
  } as any,

  // Step 2 – Organizer Details
  {
    type: 'VerticalLayout',
    elements: [
      { type: 'Label', text: 'Primary Organizer' } as any,
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/organizerName',
            label: 'Full Name',
            options: { placeholder: 'Enter organizer name' },
          },
          {
            type: 'Control',
            scope: '#/properties/organizerEmail',
            label: 'Email Address',
            options: { placeholder: 'organizer@institution.edu' },
          },
        ],
      },
      {
        type: 'Control',
        scope: '#/properties/organizerInstitute',
        label: 'Institute',
        options: { placeholder: 'Select institute' },
      },
      { type: 'Label', options: { divider: true } } as any,
      { type: 'Label', text: 'Co-Organizer', options: { optional: true } } as any,
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/coOrganizerName',
            label: 'Full Name',
            options: { placeholder: 'Enter co-organizer name' },
          },
          {
            type: 'Control',
            scope: '#/properties/coOrganizerEmail',
            label: 'Email Address',
            options: { placeholder: 'co-organizer@institution.edu' },
          },
        ],
      },
    ],
  } as any,

  // Step 3 – Conference Rationale
  {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/relevanceOfTopic',
        label: 'Relevance of the Topic',
        options: { placeholder: 'Select relevance rating' },
      },
      {
        type: 'Control',
        scope: '#/properties/scientificQuality',
        label: 'Scientific Quality',
        options: {
          multi: true,
          placeholder: 'Strong methodology and innovation. The proposed speakers are top-tier...',
          hint: 'Comment on methodology, innovation, and proposed speaker quality.',
        },
      },
      {
        type: 'Control',
        scope: '#/properties/topicDistinctness',
        label: 'Topic Distinctness',
        options: {
          multi: true,
          placeholder: 'This concept is distinct from recent meetings because...',
          hint: 'Is this topic sufficiently distinct from recent Keystone Symposia?',
        },
      },
      {
        type: 'Control',
        scope: '#/properties/organizerExpertise',
        label: 'Organizer Expertise',
        options: { placeholder: 'Select expertise level' },
      },
      {
        type: 'Control',
        scope: '#/properties/generalComments',
        label: 'General Comments',
        options: { multi: true, placeholder: 'Any additional comments...' },
      },
    ],
  } as any,
];
