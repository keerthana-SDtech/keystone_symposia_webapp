export const EMAIL_TRIGGERS_PAGE_CONTENT = {
  pageTitle:         "Email Triggers",
  subtitle:          "Automate email notifications for events",
  createButton:      "Create",
  searchPlaceholder: "Search",
  emptyState:        "No email triggers found.",
};

export const EMAIL_TRIGGERS_TABLE_COLUMNS = [
  { key: "name",            label: "Name",             width: "w-[18%]" },
  { key: "description",     label: "Description",      width: "w-[22%]" },
  { key: "emailTemplate",   label: "Email Template",   width: "w-[18%]" },
  { key: "sendTo",          label: "Send to",          width: "w-[16%]" },
  { key: "enabled",         label: "Enable/Disable",   width: "w-[12%]" },
  { key: "actions",         label: "Actions",          width: "w-[6%]"  },
];


export const EMAIL_TEMPLATE_OPTIONS = [
  "Submission Confirmation",
  "Status Change Notification",
  "Review Assignment",
  "Stage Transition Notice",
  "Review Window Opening",
  "Review Submitted Notification",
  "User Invitation",
  "Password Reset",
  "Welcome Email",
];


export interface EmailTrigger {
  id:            string;
  name:          string;
  description:   string;
  emailTemplate: string;
  sendTo:        string[];
  enabled:       boolean;
}


export const CREATE_TRIGGER_CONTENT = {
  createTitle: "Create Email Trigger",
  editTitle:   "Edit Email Trigger",
  viewTitle:   "View Email Trigger",
  fields: {
    name:          { label: "Trigger Name",    placeholder: "Enter trigger name",    required: true  },
    description:   { label: "Description",     placeholder: "Enter description",     required: false },
    emailTemplate: { label: "Email Template",  placeholder: "Select email template", required: true  },
    sendTo:        { label: "Send To",         placeholder: "Select recipients"                      },
    enabled:       { label: "Enable Trigger"                                                         },
  },
  cancel: "Cancel",
  add:    "Add",
  save:   "Save",
};
