export const EMAIL_TRIGGERS_PAGE_CONTENT = {
  pageTitle:         "Email Triggers",
  subtitle:          "Automate email notifications for events",
  createButton:      "Create",
  searchPlaceholder: "Search",
  emptyState:        "No email triggers found.",
};

export const EMAIL_TRIGGERS_TABLE_COLUMNS = [
  { key: "name",            label: "Name",             width: "w-[18%]" },
  { key: "description",     label: "Description",      width: "w-[20%]" },
  { key: "emailTemplate",   label: "Email Template",   width: "w-[16%]" },
  { key: "sendTo",          label: "Send to",          width: "w-[14%]" },
  { key: "enabled",         label: "Enable/Disable",   width: "w-[10%]" },
  { key: "actions",         label: "Actions",          width: "w-[6%]"  },
];

export const SEND_TO_OPTIONS = [
  "Ideator",
  "Reviewer",
  "Keystone Staff",
  "Study Group",
  "Organizer",
  "Admin",
];

export const ACTION_OPTIONS = [
  "On Submission",
  "On Status Change",
  "On Review Assigned",
  "On Stage Transition",
  "On Review Window Opening",
  "On Review Submitted",
  "On User Invited",
  "On Password Reset",
  "On Concept Approved",
  "On Concept Rejected",
];

export interface EmailTrigger {
  id:             string;
  name:           string;
  description:    string;
  emailTemplate:  string;   // subject of linked template (display only)
  emailTemplateId?: string | null;
  sendTo:         string[];
  fromStage:      string;
  toStage:        string;
  action:         string;
  enabled:        boolean;
}

export const CREATE_TRIGGER_CONTENT = {
  createTitle: "Create Trigger",
  editTitle:   "Edit Email Trigger",
  viewTitle:   "View Email Trigger",
  fields: {
    name:          { label: "Name",             placeholder: "Enter name",            required: true  },
    description:   { label: "Description",      placeholder: "Enter description",     required: false },
    emailTemplate: { label: "Email Template",   placeholder: "Select email template", required: true  },
    sendTo:        { label: "Send To",          placeholder: "Select send to"                        },
    fromStage:     { label: "From Stage",       placeholder: "Select from stage"                     },
    toStage:       { label: "To Stage",         placeholder: "Select to stage"                       },
    action:        { label: "Action",           placeholder: "Select action"                         },
    enabled:       { label: "Enable email trigger"                                                    },
  },
  cancel: "Cancel",
  add:    "Create",
  save:   "Save",
};
