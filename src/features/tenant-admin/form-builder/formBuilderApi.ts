/**
 * formBuilderApi.ts
 *
 * Three concerns live here, kept in separate sections:
 *
 *  1. PRIMITIVE API CALLS   — one function per backend endpoint.
 *  2. FIELD-TYPE MAPPING    — translation between UI labels and backend enums.
 *  3. COMPOUND OPERATIONS   — saveNewForm / saveEditForm orchestrate multiple
 *                             API calls to persist a full form (definition +
 *                             sections + fields + options + lookup config).
 *  4. RESPONSE MAPPER       — ApiFormFull → FormBuilderItem + FormItem[].
 *
 * All functions are async/await. Errors propagate to the caller so the
 * component can decide how to surface them (toast, inline message, etc.).
 */

import { httpClient } from '../../../lib/httpClient';
import type {
  ApiFormFull,
  ApiFormSummary,
  ApiFormSection,
  ApiFormField,
  BackendFieldType,
  CreateFormBody,
  UpdateFormBody,
  CreateSectionBody,
  CreateFieldBody,
  CreateOptionBody,
  UpsertLookupBody,
} from './formBuilderTypes';
import type {
  FormBuilderItem,
  FormBuilderTab,
  FormItem,
  FieldItem,
  SectionItem,
} from './formBuilderData';

// ─── 1. PRIMITIVE API CALLS ───────────────────────────────────────────────────

const BASE = '/config/form-definitions';

/**
 * List all form definitions (summary only — no nested sections/fields).
 * GET /config/form-definitions
 */
async function listForms(): Promise<ApiFormSummary[]> {
  const { data } = await httpClient.get<ApiFormSummary[]>(BASE);
  return data;
}

/**
 * Fetch a single form definition with full nested sections → fields.
 * GET /config/form-definitions/:id
 */
async function getForm(id: string): Promise<ApiFormFull> {
  const { data } = await httpClient.get<ApiFormFull>(`${BASE}/${id}`);
  return data;
}

/**
 * Create a new form definition. Returns the created row (no sections yet).
 * POST /config/form-definitions
 */
async function createForm(body: CreateFormBody): Promise<ApiFormSummary> {
  const { data } = await httpClient.post<ApiFormSummary>(BASE, body);
  return data;
}

/**
 * Update form definition metadata (partial update).
 * PUT /config/form-definitions/:id
 */
async function updateForm(id: string, body: UpdateFormBody): Promise<ApiFormSummary> {
  const { data } = await httpClient.put<ApiFormSummary>(`${BASE}/${id}`, body);
  return data;
}

/**
 * Delete a form definition and all its sections/fields (cascade).
 * DELETE /config/form-definitions/:id
 */
async function deleteForm(id: string): Promise<void> {
  await httpClient.delete(`${BASE}/${id}`);
}

/**
 * Add a section to a form.
 * POST /config/form-definitions/:formId/sections
 */
async function createSection(formId: string, body: CreateSectionBody): Promise<ApiFormSection> {
  const { data } = await httpClient.post<ApiFormSection>(`${BASE}/${formId}/sections`, body);
  return data;
}

/**
 * Delete a section (and all its fields) by ID.
 * DELETE /config/sections/:sectionId
 */
async function deleteSection(sectionId: string): Promise<void> {
  await httpClient.delete(`/config/sections/${sectionId}`);
}

/**
 * Add a field to a section.
 * POST /config/sections/:sectionId/fields
 */
async function createField(sectionId: string, body: CreateFieldBody): Promise<ApiFormField> {
  const { data } = await httpClient.post<ApiFormField>(`/config/sections/${sectionId}/fields`, body);
  return data;
}

/**
 * Add a static option (for radio / checkbox / select fields).
 * POST /config/fields/:fieldId/options
 */
async function createOption(fieldId: string, body: CreateOptionBody): Promise<void> {
  await httpClient.post(`/config/fields/${fieldId}/options`, body);
}

/**
 * Create or replace the lookup config for a field.
 * POST /config/fields/:fieldId/lookup-config
 */
async function upsertLookupConfig(fieldId: string, body: UpsertLookupBody): Promise<void> {
  await httpClient.post(`/config/fields/${fieldId}/lookup-config`, body);
}

// ─── 2. FIELD-TYPE MAPPING ────────────────────────────────────────────────────

/**
 * Mapping from the UI field-type label (shown in the dropdown) to the
 * backend enum value stored in the DB.
 *
 * Example API request body:
 *   { "fieldType": "radio" }   ← user chose "Radio Button" in the UI
 */
const UI_TO_BACKEND: Record<string, BackendFieldType> = {
  'Text Field':               'text',
  'Text Area':                'textarea',
  'Radio Button':             'radio',
  'Checkbox':                 'checkbox_group',
  'Dropdown - Single select': 'select',
  'Dropdown - Multi select':  'multi_select',
  'Paragraph':                'paragraph',
  'File Upload':              'file',
  'Look Up':                  'lookup',
};

/**
 * Reverse mapping — used when hydrating the editor from saved API data.
 * Unknown backend types fall back to "Text Field".
 */
const BACKEND_TO_UI: Partial<Record<BackendFieldType, string>> = {
  text:            'Text Field',
  textarea:        'Text Area',
  radio:           'Radio Button',
  checkbox:        'Checkbox',
  checkbox_group:  'Checkbox',
  select:          'Dropdown - Single select',
  multi_select:    'Dropdown - Multi select',
  paragraph:       'Paragraph',
  file:            'File Upload',
  lookup:          'Look Up',
  lookup_multi:    'Look Up',
};

/** Convert a display name to a URL-safe key (max 100 chars). */
function toKey(str: string, fallback: string): string {
  const slug = str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
  return slug || fallback;
}

/** Lightweight UID for mapping rows that don't yet have a backend ID. */
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── 3. COMPOUND OPERATIONS ───────────────────────────────────────────────────

/**
 * Persist all sections and root-level fields for a form definition.
 *
 * The backend requires every field to live inside a section. Root-level fields
 * (added directly to the form without a wrapping section in the UI) are
 * automatically grouped into a synthetic "Fields" section.
 *
 * Each section and field is created sequentially to preserve displayOrder.
 * Within a field, options are created in parallel (order preserved via
 * displayOrder attribute).
 */
async function saveSectionsAndFields(formId: string, items: FormItem[]): Promise<void> {
  const rootFields = items.filter((i): i is FieldItem  => i.kind === 'field');
  const sections   = items.filter((i): i is SectionItem => i.kind === 'section');

  let sectionOrder = 0;

  // Wrap any root-level fields in a synthetic "Fields" section
  if (rootFields.length > 0) {
    const defaultSection = await createSection(formId, {
      sectionName:  'Fields',
      sectionKey:   'fields',
      displayOrder: sectionOrder++,
    });
    await saveFieldsToSection(defaultSection.id, rootFields);
  }

  // Create each explicit section, then its fields
  for (const section of sections) {
    const created = await createSection(formId, {
      sectionName:  section.title || `Section ${sectionOrder + 1}`,
      sectionKey:   toKey(section.title, `section-${sectionOrder}`),
      displayOrder: sectionOrder++,
    });
    await saveFieldsToSection(created.id, section.fields);
  }
}

/**
 * Create all fields for a given section, including their options and lookup
 * config when applicable.
 *
 * Field creation is sequential (preserves displayOrder). Option creation for
 * each field is parallelised since the displayOrder attribute carries the
 * ordering information.
 */
async function saveFieldsToSection(sectionId: string, fields: FieldItem[]): Promise<void> {
  for (let i = 0; i < fields.length; i++) {
    const f            = fields[i];
    const backendType  = UI_TO_BACKEND[f.type] ?? 'text';
    const label        = f.title.trim() || `Field ${i + 1}`;
    const fieldKey     = toKey(label, `field-${i}`);

    /*
     * Build the CreateFieldBody.
     *
     * Validation mapping:
     *   - Text Field / File Upload → showValidation + validationMessage → helperText
     *   - Text Area                → cbValidations (Max/Min character)   → maxLength/minLength
     *   - Paragraph                → paraValidations (Length type)       → minLength/maxLength
     *                                paraValidations (Pattern type)      → regexPattern
     *   - Checkbox / Multi-select  → cbValidations (Select at least/most) — stored in uiOptions
     *                                (no direct DB column maps; stored as helper text for now)
     */
    const body: CreateFieldBody = {
      fieldLabel:   label,
      fieldKey,
      fieldType:    backendType,
      displayOrder: i,
      isRequired:   f.required,
    };

    // Paragraph: store content as paragraphContent
    if (f.type === 'Paragraph' && f.validationMessage) {
      body.paragraphContent = f.validationMessage;
    }

    // Lookup field flag
    if (f.type === 'Look Up') {
      body.isLookup = true;
    }

    // Text Field / File Upload: validation message → helperText
    if (
      (f.type === 'Text Field' || f.type === 'File Upload') &&
      f.showValidation &&
      f.validationMessage
    ) {
      body.helperText = f.validationMessage;
    }

    // Text Area: character length constraints
    if (f.type === 'Text Area' && f.cbValidations.length > 0) {
      const maxRow = f.cbValidations.find(r => r.type === 'Maximum character');
      const minRow = f.cbValidations.find(r => r.type === 'Minimum character');
      if (maxRow?.number) body.maxLength = parseInt(maxRow.number, 10);
      if (minRow?.number) body.minLength = parseInt(minRow.number, 10);
    }

    // Paragraph: length / pattern validation rows
    if (f.type === 'Paragraph' && f.paraValidations.length > 0) {
      const lenRow = f.paraValidations.find(r => r.type === 'Length');
      if (lenRow) {
        if (lenRow.minValue) body.minLength = parseFloat(lenRow.minValue);
        if (lenRow.maxValue) body.maxLength = parseFloat(lenRow.maxValue);
      }
      const patRow = f.paraValidations.find(r => r.type === 'Pattern');
      if (patRow?.minValue) body.regexPattern = patRow.minValue;
    }

    const createdField = await createField(sectionId, body);

    // ── Field options (radio / checkbox / select) ─────────────────────────
    const isOptionBased = [
      'Radio Button', 'Checkbox',
      'Dropdown - Single select', 'Dropdown - Multi select',
    ].includes(f.type);

    if (isOptionBased && f.options.length > 0) {
      // Create all options in parallel — displayOrder carries the sequence
      await Promise.all(
        f.options
          .filter(opt => opt.text.trim())
          .map((opt, j) =>
            createOption(createdField.id, {
              optionLabel:  opt.text,
              optionValue:  toKey(opt.text, `opt-${j}`),
              displayOrder: j,
            })
          )
      );
    }

    // ── Lookup config ─────────────────────────────────────────────────────
    if (f.type === 'Look Up' && f.lookupUrlTemplate.trim()) {
      await upsertLookupConfig(createdField.id, {
        url:        f.lookupUrlTemplate,
        resultPath: f.lookupResultPath || '.',
        labelPath:  f.lookupLabelPath  || 'label',
        valuePath:  f.lookupValuePath  || 'value',
      });
    }
  }
}

/**
 * Create a brand-new form definition with all its sections and fields.
 *
 * Example API sequence for a form with one section containing two fields:
 *
 *   POST /config/form-definitions
 *     Body: { formName: "Concept Submission", formType: "application", isActive: true }
 *     → { id: "uuid-form", ... }
 *
 *   POST /config/form-definitions/uuid-form/sections
 *     Body: { sectionName: "Basics", sectionKey: "basics", displayOrder: 0 }
 *     → { id: "uuid-sec", ... }
 *
 *   POST /config/sections/uuid-sec/fields
 *     Body: { fieldLabel: "Title", fieldKey: "title", fieldType: "text", displayOrder: 0 }
 *     → { id: "uuid-field-1", ... }
 *
 *   POST /config/sections/uuid-sec/fields
 *     Body: { fieldLabel: "Abstract", fieldKey: "abstract", fieldType: "textarea", displayOrder: 1 }
 *     → { id: "uuid-field-2", ... }
 */
export async function saveNewForm(
  details: { formName: string; description: string; module: string; enabled: boolean },
  items:   FormItem[],
  formType: FormBuilderTab,
): Promise<void> {
  const form = await createForm({
    formName:  details.formName,
    description: details.description || undefined,
    module:    details.module   || undefined,
    formType,
    isActive:  details.enabled,
  });

  await saveSectionsAndFields(form.id, items);
}

/**
 * Persist an edited form.
 *
 * Strategy: update metadata, delete all existing sections (cascade deletes
 * their fields), then re-create sections + fields from the current UI state.
 * This is a "replace" approach — simple and safe for the current UI which
 * doesn't track individual field IDs after the initial load.
 *
 * Example API sequence:
 *
 *   PUT /config/form-definitions/uuid-form
 *     Body: { formName: "Updated Name", isActive: false }
 *
 *   DELETE /config/sections/uuid-sec-1
 *   DELETE /config/sections/uuid-sec-2   ← both run in parallel
 *
 *   POST /config/form-definitions/uuid-form/sections  ← re-create
 *     Body: { sectionName: "Basics", sectionKey: "basics", displayOrder: 0 }
 *   ...
 */
export async function saveEditForm(
  formId:   string,
  details:  { formName: string; description: string; module: string; enabled: boolean },
  items:    FormItem[],
): Promise<void> {
  // Fetch current form to get existing section IDs for deletion
  const current = await getForm(formId);

  // Update metadata and delete all sections in parallel
  await Promise.all([
    updateForm(formId, {
      formName:    details.formName,
      description: details.description || undefined,
      module:      details.module      || undefined,
      isActive:    details.enabled,
    }),
    ...current.sections.map(s => deleteSection(s.id)),
  ]);

  // Re-create sections + fields
  await saveSectionsAndFields(formId, items);
}

/**
 * Toggle the isActive flag for a form (used by the enable/disable toggle in
 * the list table).
 *
 * PUT /config/form-definitions/:id
 *   Body: { isActive: true | false }
 */
export async function toggleFormActive(id: string, isActive: boolean): Promise<void> {
  await updateForm(id, { isActive });
}

/**
 * Delete a form and its entire section/field tree.
 * DELETE /config/form-definitions/:id
 */
export { deleteForm };

// ─── 4. RESPONSE MAPPER ───────────────────────────────────────────────────────

/**
 * Map a summary API row to the FormBuilderItem shape used by the list table.
 *
 * Field name differences:
 *   API            UI
 *   formName   →   name
 *   isActive   →   enabled
 *   formType   →   type
 */
export function mapSummaryToListItem(form: ApiFormSummary): FormBuilderItem {
  return {
    id:          form.id,
    name:        form.formName,
    description: form.description ?? '',
    module:      form.module      ?? '',
    enabled:     form.isActive,
    type:        form.formType as FormBuilderTab,
  };
}

/**
 * Map a full API form (with sections → fields) to the FormItem[] array
 * expected by CreateFormBuilderView's `initialItems` prop.
 *
 * The synthetic "Fields" section (sectionKey === 'fields', used to wrap
 * root-level fields at save time) is unwrapped back into root-level FieldItems.
 */
export function mapApiFormToItems(form: ApiFormFull): FormItem[] {
  const result: FormItem[] = [];

  for (const section of form.sections) {
    if (section.sectionKey === 'fields' && section.sectionName === 'Fields') {
      // Unwrap the synthetic wrapper — these are root-level fields in the UI
      result.push(...section.fields.map(mapApiFieldToUi));
    } else {
      const sectionItem: SectionItem = {
        kind:      'section',
        id:        section.id,
        title:     section.sectionName,
        collapsed: false,
        fields:    section.fields.map(mapApiFieldToUi),
      };
      result.push(sectionItem);
    }
  }

  return result;
}

/**
 * Map a single ApiFormField to the FieldItem shape used inside the editor.
 *
 * Validation round-trip:
 *   helperText   → validationMessage + showValidation: true
 *   maxLength    → cbValidations[0] { type: "Maximum character", number }
 *   minLength    → cbValidations[1] { type: "Minimum character", number }
 *   regexPattern → paraValidations[0] { type: "Pattern", minValue }
 *   min+maxLength for paragraph → paraValidations[0] { type: "Length" }
 *
 * Options: optionLabel → FieldOption.text (goTo navigation is not persisted
 * to the backend in the current schema, so it resets to empty on edit).
 */
function mapApiFieldToUi(f: ApiFormField): FieldItem {
  const uiType = BACKEND_TO_UI[f.fieldType] ?? 'Text Field';

  // Rebuild cbValidations from stored length constraints
  const cbValidations = (() => {
    const rows = [];
    if (f.maxLength != null) rows.push({ id: uid(), type: 'Maximum character', number: String(f.maxLength), customError: '' });
    if (f.minLength != null) rows.push({ id: uid(), type: 'Minimum character', number: String(f.minLength), customError: '' });
    return rows;
  })();

  // Rebuild paraValidations from stored length / regex constraints
  const paraValidations = (() => {
    const rows = [];
    if (f.minLength != null || f.maxLength != null) {
      rows.push({
        id:       uid(),
        type:     'Length',
        minValue: f.minLength != null ? String(f.minLength) : '',
        maxValue: f.maxLength != null ? String(f.maxLength) : '',
      });
    }
    if (f.regexPattern) {
      rows.push({ id: uid(), type: 'Pattern', minValue: f.regexPattern, maxValue: '' });
    }
    return rows;
  })();

  return {
    kind:              'field',
    id:                f.id,
    title:             f.fieldLabel,
    type:              uiType,
    options:           f.options.map(o => ({ text: o.optionLabel, goTo: '' })),
    showGoToField:     false,
    required:          f.isRequired,
    fieldAssociation:  false,
    associatedField:   '',
    showValidation:    !!(f.helperText || f.regexPattern),
    validationMessage: f.helperText ?? f.paragraphContent ?? '',
    paraValidations,
    cbValidations,
    lookupName:        '',
    lookupUrlTemplate: f.lookupConfig?.url        ?? '',
    lookupResultPath:  f.lookupConfig?.resultPath ?? '',
    lookupLabelPath:   f.lookupConfig?.labelPath  ?? '',
    lookupValuePath:   f.lookupConfig?.valuePath  ?? '',
  };
}

// ─── Public API object ────────────────────────────────────────────────────────

/**
 * Single import point for all Form Builder API operations.
 *
 * Usage in components:
 *   import { formBuilderApi } from './formBuilderApi';
 *   const forms = await formBuilderApi.listForms();
 */
export const formBuilderApi = {
  listForms,
  getForm,
  createForm,
  updateForm,
  deleteForm,
  toggleFormActive,
  saveNewForm,
  saveEditForm,
  mapSummaryToListItem,
  mapApiFormToItems,
};
