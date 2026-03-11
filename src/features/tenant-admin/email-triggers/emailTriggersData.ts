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

export const SEND_TO_OPTIONS = [
  "Ideator",
  "Reviewer",
  "Keystone Staff",
  "Study Group",
  "Organizer",
  "Admin",
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

export const TRIGGER_EVENT_OPTIONS = [
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
  id:            string;
  name:          string;
  description:   string;
  emailTemplate: string;
  sendTo:        string[];
  enabled:       boolean;
}

export const MOCK_EMAIL_TRIGGERS: EmailTrigger[] = [
  { id: "01", name: "On Submission",        description: "Fires when a new concept is submitted",          emailTemplate: "Submission Confirmation",      sendTo: ["Ideator"],                    enabled: true  },
  { id: "02", name: "On Status Change",     description: "Fires whenever a concept status is updated",     emailTemplate: "Status Change Notification",   sendTo: ["Ideator"],                    enabled: false },
  { id: "03", name: "On Review Assigned",   description: "Fires when a reviewer is assigned",              emailTemplate: "Review Assignment",            sendTo: ["Reviewer"],                   enabled: true  },
  { id: "04", name: "On Stage Transition",  description: "Fires when a concept moves to a new stage",      emailTemplate: "Stage Transition Notice",       sendTo: ["Keystone Staff"],             enabled: true  },
  { id: "05", name: "On Review Window",     description: "Fires when a review window opens",               emailTemplate: "Review Window Opening",         sendTo: ["Study Group"],                enabled: true  },
  { id: "06", name: "On Review Submitted",  description: "Fires when a reviewer submits their review",     emailTemplate: "Review Submitted Notification", sendTo: ["Study Group","Keystone Staff"], enabled: true },
  { id: "07", name: "On User Invited",      description: "Fires when a new user is invited",               emailTemplate: "User Invitation",              sendTo: ["Organizer"],                  enabled: true  },
  { id: "08", name: "On Password Reset",    description: "Fires when a user requests a password reset",    emailTemplate: "Password Reset",               sendTo: ["Ideator"],                    enabled: true  },
  { id: "09", name: "On Concept Approved",  description: "Fires when a concept is approved",               emailTemplate: "Status Change Notification",   sendTo: ["Ideator","Organizer"],        enabled: true  },
  { id: "10", name: "On Concept Rejected",  description: "Fires when a concept is rejected",               emailTemplate: "Status Change Notification",   sendTo: ["Ideator"],                    enabled: false },
  { id: "11", name: "On Stage Reminder",    description: "Fires as a reminder before a stage deadline",    emailTemplate: "Stage Transition Notice",       sendTo: ["Keystone Staff","Reviewer"],  enabled: true  },
  { id: "12", name: "On Welcome",           description: "Fires when a new user completes registration",   emailTemplate: "Welcome Email",                sendTo: ["Ideator"],                    enabled: true  },
];

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
