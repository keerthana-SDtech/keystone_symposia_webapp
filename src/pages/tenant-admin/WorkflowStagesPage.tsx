import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { WorkflowView } from "@/features/tenant-admin/workflow-stages/WorkflowView";

export default function WorkflowStagesPage() {
  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <WorkflowView />
      </TenantAdminLayout>
    </PageShell>
  );
}
