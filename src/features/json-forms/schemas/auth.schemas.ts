import type { JsonSchema, UISchemaElement } from '@jsonforms/core';

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginJsonSchema: JsonSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
  required: ['email', 'password'],
};

export const loginUiSchema: UISchemaElement = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/email',
      label: 'Email',
      options: { placeholder: 'Enter email' },
    },
    {
      type: 'Control',
      scope: '#/properties/password',
      label: 'Password',
      options: { placeholder: 'Enter password', format: 'password' },
    },
  ],
} as any;

// ─── Signup ───────────────────────────────────────────────────────────────────

export const signupJsonSchema: JsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    confirmPassword: { type: 'string', minLength: 6 },
  },
  required: ['name', 'email', 'password', 'confirmPassword'],
};

export const signupUiSchema: UISchemaElement = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name',
      label: 'Name',
      options: { placeholder: 'Enter your name' },
    },
    {
      type: 'Control',
      scope: '#/properties/email',
      label: 'Email',
      options: { placeholder: 'Enter email' },
    },
    {
      type: 'Control',
      scope: '#/properties/password',
      label: 'Password',
      options: { placeholder: 'Create password', format: 'password' },
    },
    {
      type: 'Control',
      scope: '#/properties/confirmPassword',
      label: 'Confirm Password',
      options: { placeholder: 'Repeat password', format: 'password' },
    },
  ],
} as any;
