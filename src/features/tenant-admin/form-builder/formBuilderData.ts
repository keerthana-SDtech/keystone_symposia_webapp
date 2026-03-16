export const FORM_BUILDER_PAGE_CONTENT = {
  pageTitle:         "Form Builder",
  subtitle:          "Configure forms for various stages",
  createButton:      "Create",
  searchPlaceholder: "Search",
  emptyState:        "No forms found.",
};

export const FORM_BUILDER_TABS = [
  { key: "admin",       label: "Admin"       },
  { key: "application", label: "Application" },
] as const;

export type FormBuilderTab = typeof FORM_BUILDER_TABS[number]["key"];

export const FORM_BUILDER_TABLE_COLUMNS = [
  { key: "name",        label: "Name",            width: "w-[25%]" },
  { key: "description", label: "Description",      width: "w-[30%]" },
  { key: "module",      label: "Module",           width: "w-[20%]" },
  { key: "enabled",     label: "Enable/Disable",   width: "w-[14%]" },
  { key: "actions",     label: "Actions",          width: "w-[6%]"  },
];

export const MODULE_OPTIONS = [
  "Tenant",
  "User",
  "Role",
  "Workflow & Stage",
  "Status Creation",
  "Template Creation",
  "Trigger Creation",
  "Concept",
  "Proposal",
  "Review",
];

export interface FormBuilderItem {
  id:          string;
  name:        string;
  description: string;
  module:      string;
  enabled:     boolean;
  type:        FormBuilderTab;
}

export const MOCK_FORM_BUILDER_ITEMS: FormBuilderItem[] = [
  { id: "01", name: "tenant creation",          description: "Fires when a new concept is submitted",       module: "Tenant",            enabled: true,  type: "admin" },
  { id: "02", name: "user creation",            description: "Fires whenever a concept status is updated",  module: "User",              enabled: true,  type: "admin" },
  { id: "03", name: "role creation",            description: "Fires when a reviewer is assigned",           module: "Role",              enabled: true,  type: "admin" },
  { id: "04", name: "Workflow stage creation",  description: "Fires when a concept moves to a new stage",   module: "Workflow & Stage",  enabled: false, type: "admin" },
  { id: "05", name: "status creation",          description: "Fires when a concept moves to a new stage",   module: "Status Creation",   enabled: true,  type: "admin" },
  { id: "06", name: "template creation",        description: "Fires when a concept moves to a new stage",   module: "Template Creation", enabled: true,  type: "admin" },
  { id: "07", name: "trigger creation",         description: "Fires when a concept moves to a new stage",   module: "Trigger Creation",  enabled: false, type: "admin" },
  { id: "08", name: "concept submission",       description: "Form for submitting a new concept",           module: "Concept",           enabled: true,  type: "application" },
  { id: "09", name: "proposal form",            description: "Form for submitting a proposal",              module: "Proposal",          enabled: true,  type: "application" },
  { id: "10", name: "review form",              description: "Form for submitting a review",                module: "Review",            enabled: true,  type: "application" },
  { id: "11", name: "profile update",           description: "Form for updating user profile",              module: "User",              enabled: true,  type: "application" },
  { id: "12", name: "concept edit",             description: "Form for editing an existing concept",        module: "Concept",           enabled: false, type: "application" },
];

export const CREATE_FORM_CONTENT = {
  createTitle: "Create Form",
  editTitle:   "Edit Form",
  fields: {
    name:        { label: "Form Name",    placeholder: "Enter form name",    required: true  },
    description: { label: "Description", placeholder: "Enter description",  required: false },
    module:      { label: "Module",      placeholder: "Select module",      required: true  },
    type:        { label: "Form Type",   placeholder: "Select form type",   required: true  },
    enabled:     { label: "Enable Form"                                                     },
  },
  cancel: "Cancel",
  add:    "Add",
  save:   "Save",
};
