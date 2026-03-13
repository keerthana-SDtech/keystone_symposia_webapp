export const STATUS_PAGE_CONTENT = {
  pageTitle:        "Status Management",
  subtitle:         "Manage conference organizers and their linked concepts.",
  createButton:     "Create",
  searchPlaceholder: "Search",
  emptyState:       "No statuses found.",
};

export const STATUS_TABLE_COLUMNS = [
  { key: "color",       label: "Color",          width: "w-[8%]"  },
  { key: "status",      label: "Status",         width: "w-[22%]" },
  { key: "description", label: "Description",    width: "w-[38%]" },
  { key: "enabled",     label: "Enable/Disable", width: "w-[20%]" },
  { key: "actions",     label: "Actions",        width: "w-[12%]" },
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
  enabled: boolean;
}


export const ADD_STATUS_CONTENT = {
  modalTitle: "Add Status",
  editTitle:  "Edit Status",
  tabs: { basicInfo: "Basic Info", colorPicker: "Color Picker" },
  fields: {
    statusName:   { label: "Status Name",  placeholder: "Enter status name", required: true  },
    description:  { label: "Description",  placeholder: "Enter description", required: false },
    enableStatus: { label: "Enable Status"                                                    },
  },
  cancel: "Cancel",
  add:    "Add",
  save:   "Save",
};
