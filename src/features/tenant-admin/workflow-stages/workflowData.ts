export const WORKFLOW_PAGE_CONTENT = {
  pageTitle:  "Workflow & Stages",
  subtitle:   "Manage workflow and their stages.",
  infoBanner: "Drag and arrange to configure lifecycle stages and transitions.",
  saveOrder:  "Save Order",
  addStage:   "Add Stage",
  emptyState: "No stages found.",
};

export const ROLE_OPTIONS = ["Mentor", "Keystone Staff", "Study Group", "Organizer", "SAB Member", "Super Admin", "Admin"];
export const STATUS_ACTION_OPTIONS  = ["Shortlist", "Bank", "Reject", "Approve", "Escalate"];
export const ALLOWED_ACTION_OPTIONS = ["View", "Edit", "Submit", "Review", "Delete", "Export"];

export interface Stage {
  id: string;
  name: string;
  description: string;
  roles: string[];
  locked: boolean;
  whoCanAdvance: string[];
  stageOrder: string;
  fromStage: string;
  toStage: string;
  statusActions: string[];
  allowedActions: string[];
}

export const MOCK_STAGES: Stage[] = [
  { id: "1",  name: "Concept Submitted",              description: "Initial concept submission phase",                         roles: ["Mentor","Keystone Staff"],     locked: false, whoCanAdvance: [], stageOrder: "1",  fromStage: "",                           toStage: "Screening",                     statusActions: [],                          allowedActions: ["View","Submit"]          },
  { id: "2",  name: "Screening",                      description: "(Shortlisted / Rejected / Banked)",                        roles: ["Keystone Staff"],              locked: false, whoCanAdvance: [], stageOrder: "2",  fromStage: "Concept Submitted",          toStage: "Study Group Review Window",     statusActions: ["Shortlist","Bank","Reject"], allowedActions: ["View","Edit"]          },
  { id: "3",  name: "Study Group Review Window",      description: "Study group review happens",                               roles: ["Study Group"],                 locked: false, whoCanAdvance: [], stageOrder: "3",  fromStage: "Screening",                  toStage: "Study Group Review In Progress", statusActions: [],                         allowedActions: ["View","Review"]          },
  { id: "4",  name: "Study Group Review In Progress", description: "Study group review in progress",                           roles: ["Study Group"],                 locked: false, whoCanAdvance: [], stageOrder: "4",  fromStage: "Study Group Review Window",  toStage: "SAB Board Meeting",             statusActions: [],                          allowedActions: ["View","Edit","Review"]   },
  { id: "5",  name: "SAB Board Meeting",              description: "Concept presented to Scientific Advisory Board",           roles: ["Keystone Staff"],              locked: false, whoCanAdvance: [], stageOrder: "5",  fromStage: "Study Group Review In Progress", toStage: "Proposal In Progress",        statusActions: [],                          allowedActions: ["View"]                  },
  { id: "6",  name: "Proposal In Progress",           description: "Organizer submits detailed conference program",            roles: ["Organizer","Keystone Staff"],  locked: false, whoCanAdvance: [], stageOrder: "6",  fromStage: "SAB Board Meeting",          toStage: "Ready for SAB Review",          statusActions: [],                          allowedActions: ["View","Edit","Submit"]   },
  { id: "7",  name: "Ready for SAB Review",           description: "SAB Review window opens",                                 roles: ["Keystone Staff","SAB Member"], locked: false, whoCanAdvance: [], stageOrder: "7",  fromStage: "Proposal In Progress",       toStage: "SAB Proposal In Review",        statusActions: [],                          allowedActions: ["View","Review"]          },
  { id: "8",  name: "SAB Proposal In Review",         description: "SAB Review window in progress",                           roles: ["SAB Member"],                  locked: false, whoCanAdvance: [], stageOrder: "8",  fromStage: "Ready for SAB Review",       toStage: "Final Revision",                statusActions: [],                          allowedActions: ["View","Review","Edit"]   },
  { id: "9",  name: "Final Revision",                 description: "Comments from SAB sent to organizer",                     roles: ["Organizer","Keystone Staff"],  locked: false, whoCanAdvance: [], stageOrder: "9",  fromStage: "SAB Proposal In Review",     toStage: "Proposal Finalised",            statusActions: [],                          allowedActions: ["View","Edit","Submit"]   },
  { id: "10", name: "Proposal Finalised",             description: "Proposal fully approved for symposium",                   roles: ["Keystone Staff"],              locked: false, whoCanAdvance: [], stageOrder: "10", fromStage: "Final Revision",             toStage: "",                              statusActions: [],                          allowedActions: ["View"]                  },
];

export const ADD_STAGE_CONTENT = {
  createTitle: "Add Stage",
  editTitle:   "Edit Stage",
  sections: { basicInfo: "Basic Info", configuration: "Configuration" },
  fields: {
    name:           { label: "Stage Name",                  placeholder: "Enter stage name",               required: true  },
    description:    { label: "Description",                 placeholder: "Enter description",              required: false },
    whoCanAdvance:  { label: "Who can advance this stage?", placeholder: "Select who can advance",         required: true  },
    stageOrder:     { label: "Stage Order",                 placeholder: "Select stage order",             required: true  },
    fromStage:      { label: "From Stage",                  placeholder: "Select from stage",              required: true  },
    toStage:        { label: "To Stage",                    placeholder: "Select to stage",                required: true  },
    statusActions:  { label: "Status Actions",              placeholder: "Select status actions",          required: true  },
    allowedActions: { label: "Allowed Actions",             placeholder: "Select allowed actions",         required: true  },
  },
  cancel: "Cancel",
  add:    "Add",
  save:   "Save",
};
