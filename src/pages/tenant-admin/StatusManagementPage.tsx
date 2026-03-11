import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { StatusManagementView } from "@/features/tenant-admin/status-management/StatusManagementView";

export default function StatusManagementPage() {
  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <StatusManagementView />
      </TenantAdminLayout>
    </PageShell>
  );
}
