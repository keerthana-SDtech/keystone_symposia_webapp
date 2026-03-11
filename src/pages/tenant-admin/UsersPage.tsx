import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { UsersView } from "@/features/tenant-admin/users/UsersView";

export default function UsersPage() {
  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <UsersView />
      </TenantAdminLayout>
    </PageShell>
  );
}
