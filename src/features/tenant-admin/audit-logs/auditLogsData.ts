export const AUDIT_LOGS_PAGE_CONTENT = {
  pageTitle:         "Audit Logs",
  subtitle:          "Track all actions done across.",
  searchPlaceholder: "Search",
  emptyState:        "No audit logs found.",
};

export const AUDIT_LOGS_TABLE_COLUMNS = [
  { key: "user",       label: "Users",       width: "w-[22%]" },
  { key: "timestamp",  label: "Timestamp",   width: "w-[22%]" },
  { key: "role",       label: "Role",        width: "w-[15%]" },
  { key: "actionType", label: "Action Type", width: "w-[25%]" },
  { key: "actions",    label: "Actions",     width: "w-[16%]" },
];

export interface AuditLog {
  id: string;
  user: string;
  timestamp: string;
  role: string;
  actionType: string;
  action: string;
  objectAffected: string;
  detail: string;
  stateBefore: string;
  stateAfter: string;
  ipAddress: string;
  browserOs: string;
  sessionId: string;
}

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "01",
    user: "Amanda Richardson",
    timestamp: "01/31/2025 07:17:14",
    role: "Keystone Staff",
    actionType: "Updated concept status",
    action: "Updated concept status",
    objectAffected: "Diagnostic and Therapeutic Applications",
    detail: "Status changed to Shortlisted",
    stateBefore: '{"status": "New Submission"}',
    stateAfter: '{"status": "Shortlisted"}',
    ipAddress: "192.168.1.102",
    browserOs: "Chrome 122 / macOS",
    sessionId: "sess_xk8m2p",
  },
  {
    id: "02",
    user: "Amanda Scherman",
    timestamp: "01/31/2025 07:31:33",
    role: "Keystone Staff",
    actionType: "Remove",
    action: "Removed member",
    objectAffected: "Study Group #204",
    detail: "Member removed from group",
    stateBefore: '{"status": "Active"}',
    stateAfter: '{"status": "Removed"}',
    ipAddress: "192.168.1.55",
    browserOs: "Firefox 121 / Windows 11",
    sessionId: "sess_3c7e82fa",
  },
  {
    id: "03",
    user: "Amanda Scherman",
    timestamp: "01/31/2025 07:31:33",
    role: "Keystone Staff",
    actionType: "Remove by Staff",
    action: "Account suspended",
    objectAffected: "User Account #1032",
    detail: "Account suspended by staff action",
    stateBefore: '{"status": "Active"}',
    stateAfter: '{"status": "Suspended"}',
    ipAddress: "192.168.1.55",
    browserOs: "Firefox 121 / Windows 11",
    sessionId: "sess_3c7e82fa",
  },
  {
    id: "04",
    user: "Amanda Mitchellson",
    timestamp: "01/31/2025 07:18:22",
    role: "Organizer",
    actionType: "Notify to/up",
    action: "Notification sent",
    objectAffected: "Event #8843",
    detail: "Attendees notified of schedule update",
    stateBefore: '{"notified": false}',
    stateAfter: '{"notified": true}',
    ipAddress: "10.0.0.18",
    browserOs: "Safari 17 / macOS",
    sessionId: "sess_a1d04f3c",
  },
  {
    id: "05",
    user: "Amanda Mitchellson",
    timestamp: "01/31/2025 07:09:35",
    role: "Keystone Staff",
    actionType: "Profile Update",
    action: "Profile updated",
    objectAffected: "User Profile #1032",
    detail: "Email address changed",
    stateBefore: '{"email": "old@mail.com"}',
    stateAfter: '{"email": "new@mail.com"}',
    ipAddress: "10.0.0.18",
    browserOs: "Safari 17 / macOS",
    sessionId: "sess_a1d04f3c",
  },
  {
    id: "06",
    user: "Amanda Scherman",
    timestamp: "01/31/2025 07:09:35",
    role: "Organizer",
    actionType: "Proposal submitted",
    action: "Proposal submitted",
    objectAffected: "Proposal #5521",
    detail: "Proposal moved to review queue",
    stateBefore: '{"status": "Draft"}',
    stateAfter: '{"status": "Submitted"}',
    ipAddress: "192.168.1.55",
    browserOs: "Chrome 122 / macOS",
    sessionId: "sess_9f3b17cc",
  },
];
