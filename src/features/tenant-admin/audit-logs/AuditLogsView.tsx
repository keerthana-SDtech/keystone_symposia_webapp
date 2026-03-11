import { useState } from "react";
import { AuditLogsTable } from "./AuditLogsTable";
import { AuditLogDetailPanel } from "./AuditLogDetailPanel";
import { MOCK_AUDIT_LOGS, type AuditLog } from "./auditLogsData";

export const AuditLogsView = () => {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filtered = search.trim()
    ? logs.filter(l =>
        l.user.toLowerCase().includes(search.toLowerCase()) ||
        l.role.toLowerCase().includes(search.toLowerCase()) ||
        l.actionType.toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  const handleView = (id: string) => {
    const log = logs.find(l => l.id === id) ?? null;
    setSelectedLog(log);
  };

  return (
    <div className="w-full">
      <AuditLogsTable
        logs={filtered}
        totalCount={logs.length}
        search={search}
        onSearchChange={setSearch}
        onView={handleView}
      />
      <AuditLogDetailPanel
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};
