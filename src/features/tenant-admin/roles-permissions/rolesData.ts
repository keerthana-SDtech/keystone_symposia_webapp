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

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: "concept", label: "Concept",
    permissions: [
      { id: "concept.view",   label: "View Concepts"   },
      { id: "concept.create", label: "Create Concepts" },
      { id: "concept.edit",   label: "Edit Concepts"   },
      { id: "concept.delete", label: "Delete Concepts" },
      { id: "concept.submit", label: "Submit Concepts" },
    ],
  },
  {
    key: "proposals", label: "Proposals",
    permissions: [
      { id: "proposal.view",   label: "View Proposals"   },
      { id: "proposal.create", label: "Create Proposals" },
      { id: "proposal.edit",   label: "Edit Proposals"   },
      { id: "proposal.delete", label: "Delete Proposals" },
      { id: "proposal.review", label: "Review Proposals" },
    ],
  },
  {
    key: "reviews", label: "Reviews",
    permissions: [
      { id: "review.view",    label: "View Reviews"    },
      { id: "review.create",  label: "Create Reviews"  },
      { id: "review.edit",    label: "Edit Reviews"    },
      { id: "review.approve", label: "Approve Reviews" },
      { id: "review.reject",  label: "Reject Reviews"  },
    ],
  },
];

export const TOTAL_PERMISSIONS = PERMISSION_GROUPS.reduce((sum, g) => sum + g.permissions.length, 0);

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
