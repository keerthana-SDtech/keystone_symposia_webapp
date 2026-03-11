import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { EmailTriggersView } from "@/features/tenant-admin/email-triggers/EmailTriggersView";

export default function EmailTriggersPage() {
  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <EmailTriggersView />
      </TenantAdminLayout>
    </PageShell>
  );
}
