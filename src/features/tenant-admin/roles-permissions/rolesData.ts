export const ROLES_PAGE_CONTENT = {
  pageTitle:        "Roles & Permissions",
  subtitle:         "Configure role-based access control (RBAC) on any platform modules.",
  createButton:     "Create",
  searchPlaceholder: "Search",
  emptyState:       "No roles found.",
};

export const ROLES_TABLE_COLUMNS = [
  { key: "name",        label: "Name",           width: "w-[20%]" },
  { key: "description", label: "Description",    width: "w-[30%]" },
  { key: "permissions", label: "Permissions",    width: "w-[15%]" },
  { key: "status",      label: "Enable/Disable", width: "w-[15%]" },
  { key: "actions",     label: "Actions",        width: "w-[20%]" },
];

export interface Permission { id: string; label: string; }
export interface PermissionGroup { key: string; label: string; permissions: Permission[]; }


export interface Role {
  id: string;
  name: string;
  description: string;
  permissionIds: string[];
  enabled: boolean;
}


export const CREATE_ROLE_CONTENT = {
  createTitle: "Create Role",
  editTitle:   "Edit Role",
  fields: {
    name:        { label: "Role Name",    placeholder: "Enter role name",   required: true  },
    description: { label: "Description", placeholder: "Enter description", required: false },
  },
  permissionsLabel:  "Permissions",
  permissionsSelect: "Select permissions",
  cancel: "Cancel",
  create: "Create",
  save:   "Save",
};
