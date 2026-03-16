export const WORKFLOW_PAGE_CONTENT = {
  pageTitle:  "Workflow & Stages",
  subtitle:   "Manage workflow and their stages.",
  infoBanner: "Drag and arrange to configure lifecycle stages and transitions.",
  saveOrder:  "Save Order",
  addStage:   "Add Stage",
  emptyState: "No stages found.",
};

export const ROLE_OPTIONS           = ["Ideator", "Keystone Staff", "Study Group", "Organizer", "SAB Member"];
export const ALLOWED_ACTION_OPTIONS = ["View", "Edit", "Submit", "Review", "Delete", "Export"];

export interface StatusActionItem {
  actionCode:        string;
  label:             string;
  resultingStatusId: string | null;
  toStageId:         string | null;
  isTerminal?:       boolean;
}

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
  statusActions: StatusActionItem[];
  allowedActions: string[];
  startDate?: string | null;
  endDate?:   string | null;
  isFinalStage?: boolean;
}


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
