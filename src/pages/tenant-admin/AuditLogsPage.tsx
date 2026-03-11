import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { AuditLogsView } from "@/features/tenant-admin/audit-logs/AuditLogsView";

export default function AuditLogsPage() {
  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <AuditLogsView />
      </TenantAdminLayout>
    </PageShell>
  );
}
