import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { EmailTemplatesView } from "@/features/tenant-admin/email-templates/EmailTemplatesView";

export default function EmailTemplatesPage() {
  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <EmailTemplatesView />
      </TenantAdminLayout>
    </PageShell>
  );
}
