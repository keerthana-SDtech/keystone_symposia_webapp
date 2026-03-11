export const STATUS_PAGE_CONTENT = {
  pageTitle:        "Status Management",
  subtitle:         "Manage conference organizers and their linked concepts.",
  createButton:     "Create",
  searchPlaceholder: "Search",
  emptyState:       "No statuses found.",
};

export const STATUS_TABLE_COLUMNS = [
  { key: "color",          label: "Color",          width: "w-[8%]"  },
  { key: "status",         label: "Status",         width: "w-[18%]" },
  { key: "description",    label: "Description",    width: "w-[25%]" },
  { key: "assignedStages", label: "Assigned Stages",width: "w-[22%]" },
  { key: "enabled",        label: "Enable/Disable", width: "w-[15%]" },
  { key: "actions",        label: "Actions",        width: "w-[12%]" },
];

export const MOCK_STAGES = [
  "Concept submitted", "Screening", "SAB board meeting", "Study group Review",
  "Proposal inprogress", "Ready for SAB review", "SAB proposal in review",
  "Final revision", "Proposal finalized",
];

export const LAST_USED_COLORS = [
  "#000000", "#1a73e8", "#188038", "#f29900", "#d93025",
  "#00bcd4", "#7b1fa2", "#e91e63", "#ff5722",
];

export interface Status {
  id: string;
  color: string;
  name: string;
  description: string;
  assignedStages: string[];
  enabled: boolean;
}

export const MOCK_STATUSES: Status[] = [
  { id: "01", color: "#7B2FBE", name: "New Submission",        description: "Concepts submitted",                       assignedStages: ["Concept submitted"],                    enabled: true  },
  { id: "02", color: "#1B8A3B", name: "Shortlisted",           description: "Concept shortlisted for further evaluation", assignedStages: ["Screening","SAB board meeting"],       enabled: false },
  { id: "03", color: "#9E9E9E", name: "Banked",                description: "Held for future consideration",             assignedStages: ["Screening","SAB board meeting"],        enabled: true  },
  { id: "04", color: "#E53935", name: "Rejected",              description: "Not proceeding at this time",               assignedStages: ["Screening","SAB board meeting"],        enabled: true  },
  { id: "05", color: "#F59E0B", name: "Study Group Review",    description: "Currently being evaluated",                 assignedStages: ["Study group Review"],                   enabled: true  },
  { id: "06", color: "#F59E0B", name: "SAB Board Meeting",     description: "Internal board meeting",                   assignedStages: ["SAB board meeting"],                    enabled: false },
  { id: "07", color: "#1a73e8", name: "Proposal Inprogress",   description: "Proposal submission & Review in progress",  assignedStages: ["Proposal inprogress"],                  enabled: false },
  { id: "08", color: "#F59E0B", name: "Ready for SAB Review",  description: "Awaiting for SAB review window",           assignedStages: ["Ready for SAB review"],                 enabled: true  },
  { id: "09", color: "#F59E0B", name: "SAB Proposal In Review",description: "SAB review in progress",                   assignedStages: ["SAB proposal in review"],               enabled: true  },
  { id: "10", color: "#1a73e8", name: "Final Revision",        description: "Author requested to revise submission",    assignedStages: ["Final revision"],                       enabled: true  },
  { id: "11", color: "#1a73e8", name: "Proposal Finalized",    description: "Fully approved for symposium",             assignedStages: ["Proposal finalized"],                   enabled: true  },
];

export const ADD_STATUS_CONTENT = {
  modalTitle: "Add Status",
  editTitle:  "Edit Status",
  tabs: { basicInfo: "Basic Info", colorPicker: "Color Picker" },
  fields: {
    statusName:   { label: "Status Name",   placeholder: "Enter status name",  required: true  },
    description:  { label: "Description",   placeholder: "Enter description",  required: false },
    assignStages: { label: "Assign Stages", placeholder: "Select stages"                       },
    enableStatus: { label: "Enable Status"                                                     },
  },
  cancel: "Cancel",
  add:    "Add",
  save:   "Save",
};
