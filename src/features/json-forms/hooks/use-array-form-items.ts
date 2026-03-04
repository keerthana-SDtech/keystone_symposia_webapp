import { useJsonForms } from '@jsonforms/react';
import type { ValidationMode } from '@jsonforms/core';

interface UseArrayFormItemsOptions<T> {
  data: any;
  handleChange: (path: string, value: any) => void;
  path: string;
  schema: any;
  createItem: () => T;
}

interface UseArrayFormItemsResult<T> {
  items: T[];
  itemSchema: any;
  validationMode: ValidationMode;
  update: (index: number, itemData: T) => void;
  add: () => void;
  remove: (index: number) => void;
}

/**
 * Shared hook for JSON Forms array renderers.
 * Handles item CRUD operations and reads validationMode from the parent form context.
 */
export function useArrayFormItems<T>({
  data,
  handleChange,
  path,
  schema,
  createItem,
}: UseArrayFormItemsOptions<T>): UseArrayFormItemsResult<T> {
  const { core } = useJsonForms();
  const validationMode: ValidationMode = core?.validationMode ?? 'ValidateAndHide';

  const items: T[] = data ?? [createItem()];
  const itemSchema = schema?.items;

  const update = (index: number, itemData: T) =>
    handleChange(path, items.map((item, i) => (i === index ? itemData : item)));

  const add = () => handleChange(path, [...items, createItem()]);

  const remove = (index: number) =>
    handleChange(path, items.filter((_, i) => i !== index));

  return { items, itemSchema, validationMode, update, add, remove };
}
