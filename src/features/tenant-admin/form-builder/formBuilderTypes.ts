/**
 * formBuilderTypes.ts
 *
 * TypeScript types that mirror the backend DB schema for the Form Builder
 * (config-svc). These are used exclusively for API request/response shapes —
 * NOT for UI state. UI-level types live in formBuilderData.ts.
 *
 * Backend routes reference:
 *   POST   /config/form-definitions
 *   GET    /config/form-definitions
 *   GET    /config/form-definitions/:id         (full nested)
 *   PUT    /config/form-definitions/:id
 *   DELETE /config/form-definitions/:id
 *   POST   /config/form-definitions/:id/sections
 *   DELETE /config/sections/:sectionId
 *   POST   /config/sections/:sectionId/fields
 *   POST   /config/fields/:fieldId/options
 *   POST   /config/fields/:fieldId/lookup-config (upsert)
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

/** fieldType values accepted by the backend. Maps 1-to-1 with DB enum. */
export type BackendFieldType =
  | 'text' | 'textarea' | 'number' | 'date' | 'email' | 'url' | 'phone'
  | 'radio' | 'checkbox' | 'checkbox_group'
  | 'select' | 'multi_select'
  | 'lookup' | 'lookup_multi'
  | 'file' | 'paragraph' | 'rich_text'
  | 'array' | 'group' | 'field_association'
  | 'divider' | 'label';

// ─── Response types ───────────────────────────────────────────────────────────

export interface ApiFieldOption {
  id:           string;
  fieldId:      string;
  optionLabel:  string;
  optionValue:  string;
  displayOrder: number;
  isDefault:    boolean;
}

export interface ApiLookupConfig {
  id:          string;
  fieldId:     string;
  url:         string;
  resultPath:  string;
  labelPath:   string;
  valuePath:   string;
  createdAt:   string;
}

export interface ApiFormField {
  id:               string;
  sectionId:        string;
  fieldLabel:       string;
  fieldKey:         string;
  fieldType:        BackendFieldType;
  placeholder:      string | null;
  helperText:       string | null;
  defaultValue:     string | null;
  isRequired:       boolean;
  isReadonly:       boolean;
  isHidden:         boolean;
  isLookup:         boolean;
  minLength:        number | null;
  maxLength:        number | null;
  minValue:         number | null;
  maxValue:         number | null;
  regexPattern:     string | null;
  regexMessage:     string | null;
  displayOrder:     number;
  columnSpan:       number;
  paragraphContent: string | null;
  options:          ApiFieldOption[];
  lookupConfig:     ApiLookupConfig | null;
}

export interface ApiFormSection {
  id:           string;
  formId:       string;
  sectionName:  string;
  sectionKey:   string;
  description:  string | null;
  icon:         string | null;
  displayOrder: number;
  isVisible:    boolean;
  fields:       ApiFormField[];
}

/**
 * Full nested response from GET /config/form-definitions/:id
 * Includes sections → fields → options + lookupConfig.
 */
export interface ApiFormFull {
  id:           string;
  tenantId:     string;
  entityTypeId: string | null;
  formName:     string;
  slug:         string | null;
  description:  string | null;
  module:       string | null;
  formType:     'admin' | 'application';
  version:      number;
  isActive:     boolean;
  isPublished:  boolean;
  publishedAt:  string | null;
  createdBy:    string | null;
  createdAt:    string;
  updatedAt:    string;
  sections:     ApiFormSection[];
}

/**
 * Summary-only form returned by GET /config/form-definitions (list).
 * No sections/fields nested.
 */
export type ApiFormSummary = Omit<ApiFormFull, 'sections'>;

// ─── Request body types ───────────────────────────────────────────────────────

/**
 * POST /config/form-definitions
 * Only formName is required; everything else is optional.
 */
export interface CreateFormBody {
  formName:     string;
  description?: string;
  module?:      string;
  formType?:    'admin' | 'application';
  isActive?:    boolean;
  entityTypeId?: string;
}

/**
 * PUT /config/form-definitions/:id
 * All fields optional — only provided fields are updated.
 */
export interface UpdateFormBody {
  formName?:    string;
  description?: string;
  module?:      string;
  formType?:    'admin' | 'application';
  isActive?:    boolean;
}

/**
 * POST /config/form-definitions/:id/sections
 */
export interface CreateSectionBody {
  sectionName:  string;
  sectionKey:   string;
  displayOrder: number;
  isVisible?:   boolean;
}

/**
 * POST /config/sections/:sectionId/fields
 */
export interface CreateFieldBody {
  fieldLabel:       string;
  fieldKey:         string;
  fieldType:        BackendFieldType;
  displayOrder:     number;
  isRequired?:      boolean;
  isLookup?:        boolean;
  helperText?:      string;
  regexPattern?:    string;
  regexMessage?:    string;
  minLength?:       number;
  maxLength?:       number;
  paragraphContent?: string;
}

/**
 * POST /config/fields/:fieldId/options
 */
export interface CreateOptionBody {
  optionLabel:  string;
  optionValue:  string;
  displayOrder: number;
  isDefault?:   boolean;
}

/**
 * POST /config/fields/:fieldId/lookup-config  (upsert)
 */
export interface UpsertLookupBody {
  url:        string;
  resultPath: string;
  labelPath:  string;
  valuePath:  string;
}
