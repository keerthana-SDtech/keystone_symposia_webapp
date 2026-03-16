export const EMAIL_TEMPLATES_PAGE_CONTENT = {
  pageTitle:    "Email Templates",
  subtitle:     "Create and manage notification templates",
  createButton: "+",
  emptyList:    "No templates yet. Click + to create one.",
  emptyForm:    "Select a template or create a new one.",
};

export const EVENT_KEY_OPTIONS = [
  "on_submission",
  "on_status_change",
  "on_review_assigned",
  "on_stage_transition",
  "on_review_window_opening",
  "on_review_submitted",
  "on_user_invited",
  "on_password_reset",
  "on_concept_approved",
  "on_concept_rejected",
];

export interface EmailTemplate {
  id:           string;
  entityTypeId?: string | null;
  eventKey:     string;
  subject:      string;
  bodyTemplate: string;
  isActive:     boolean;
}

export interface EmailTemplateFormState {
  entityTypeId: string;
  eventKey:     string;
  subject:      string;
  bodyTemplate: string;
  isActive:     boolean;
}

export const EMPTY_TEMPLATE_FORM: EmailTemplateFormState = {
  entityTypeId: "",
  eventKey:     "",
  subject:      "",
  bodyTemplate: "",
  isActive:     true,
};
