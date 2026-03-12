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

export const MOCK_TENANT_USERS: TenantUser[] = [
  { id: "01", name: "John Doe",           email: "john.doe@example.com",          role: "Super Admin",    createdDate: "Jan 4, 2026", enabled: true  },
  { id: "02", name: "Sarah Chen",         email: "sarah.chen@example.com",        role: "Keystone Staff", createdDate: "Jan 4, 2026", enabled: false },
  { id: "03", name: "James Walsh",        email: "james.walsh@example.com",       role: "Study Group",    createdDate: "Jan 4, 2026", enabled: true  },
  { id: "04", name: "Rebecca Tores",      email: "rebecca.tores@example.com",     role: "Admin",          createdDate: "Jan 4, 2026", enabled: true  },
  { id: "05", name: "Marcus Webb",        email: "marcus.webb@example.com",       role: "SAB Member",     createdDate: "Jan 4, 2026", enabled: true  },
  { id: "06", name: "Priya Kapoor",       email: "priya.kapoor@example.com",      role: "Keystone Staff", createdDate: "Jan 4, 2026", enabled: false },
  { id: "07", name: "Lucas Muller",       email: "lucas.muller@example.com",      role: "Keystone Staff", createdDate: "Jan 4, 2026", enabled: false },
  { id: "08", name: "Amanda Richardson",  email: "amanda.richardson@example.com", role: "Organizer",      createdDate: "Jan 4, 2026", enabled: true  },
  { id: "09", name: "Dr. Kevin Park",     email: "kevin.park@example.com",        role: "Keystone Staff", createdDate: "Jan 4, 2026", enabled: true  },
  { id: "10", name: "Davidson",           email: "davidson@example.com",          role: "Study Group",    createdDate: "Jan 4, 2026", enabled: true  },
];
