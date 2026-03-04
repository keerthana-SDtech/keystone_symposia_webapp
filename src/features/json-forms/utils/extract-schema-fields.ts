import type { UISchemaElement } from '@jsonforms/core';

/**
 * Traverses a UI schema element and returns all field names
 * referenced by Control elements (extracted from their scope).
 *
 * e.g. scope "#/properties/conferenceTitle" → "conferenceTitle"
 */
export const extractUiSchemaFields = (element: UISchemaElement): string[] => {
  const fields: string[] = [];

  const traverse = (el: any) => {
    if (el?.type === 'Control' && typeof el?.scope === 'string') {
      const match = (el.scope as string).match(/#\/properties\/([^/]+)/);
      if (match) fields.push(match[1]);
    }
    if (Array.isArray(el?.elements)) el.elements.forEach(traverse);
  };

  traverse(element);
  return fields;
};
