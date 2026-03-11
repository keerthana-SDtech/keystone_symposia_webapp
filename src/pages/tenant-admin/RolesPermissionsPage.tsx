import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { RolesPermissionsView } from "@/features/tenant-admin/roles-permissions/RolesPermissionsView";

export default function RolesPermissionsPage() {
  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <RolesPermissionsView />
      </TenantAdminLayout>
    </PageShell>
  );
}
