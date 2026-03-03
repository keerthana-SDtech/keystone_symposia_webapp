import type { JsonSchema, UISchemaElement } from '@jsonforms/core';

export interface FormSection {
  id: string;
  label: string;
  uischema: UISchemaElement;
}

export interface FormDefinition {
  schema: JsonSchema;
  sections: FormSection[];
}
