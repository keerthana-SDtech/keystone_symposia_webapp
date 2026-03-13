export const USERS_PAGE_CONTENT = {
  pageTitle:        "Users",
  subtitle:         "Manage platform users, roles, and access.",
  bulkUploadButton: "Bulk Upload",
  createButton:     "Create",
  searchPlaceholder: "Search",
  emptyState:       "No users found.",
};

export const USERS_TABLE_COLUMNS = [
  { key: "name",          label: "Name",           width: "w-[30%]" },
  { key: "role",          label: "Role",           width: "w-[20%]" },
  { key: "createdDate",   label: "Created Date",   width: "w-[20%]" },
  { key: "enableDisable", label: "Enable/Disable", width: "w-[15%]" },
  { key: "actions",       label: "Actions",        width: "w-[15%]" },
];

export interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdDate: string;
  enabled: boolean;
}

