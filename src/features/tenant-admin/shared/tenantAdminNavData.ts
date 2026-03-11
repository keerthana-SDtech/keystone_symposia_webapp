export const TENANT_ADMIN_NAV_ITEMS = [
  { key: "users",                label: "Users",                icon: "Users",         route: "/tenant-admin/users"                },
  { key: "roles-permissions",    label: "Roles & Permissions",  icon: "ShieldCheck",   route: "/tenant-admin/roles-permissions"    },
  { key: "workflow-stages",      label: "Workflow & Stages",    icon: "Network",       route: "/tenant-admin/workflow-stages"      },
  { key: "status-management",    label: "Status Management",    icon: "Shield",        route: "/tenant-admin/status-management"    },
  { key: "email-triggers",       label: "Email Triggers",       icon: "Zap",           route: "/tenant-admin/email-triggers"       },
  { key: "audit-logs",           label: "Audit Logs",           icon: "ClipboardList", route: "/tenant-admin/audit-logs"           },
] as const;

export type TenantAdminNavKey = typeof TENANT_ADMIN_NAV_ITEMS[number]["key"];
