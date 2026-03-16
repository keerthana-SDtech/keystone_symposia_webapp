import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { FormBuilderView } from "@/features/tenant-admin/form-builder/FormBuilderView";

export default function FormBuilderPage() {
  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <FormBuilderView />
      </TenantAdminLayout>
    </PageShell>
  );
}
