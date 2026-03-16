import { useParams, useLocation, Navigate } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { CreateFormBuilderView } from "@/features/tenant-admin/form-builder/CreateFormBuilderView";
import type { FormBuilderItem, FormBuilderTab } from "@/features/tenant-admin/form-builder/formBuilderData";

export default function EditFormBuilderPage() {
  const { id }     = useParams<{ id: string }>();
  const location   = useLocation();
  const item       = (location.state as { item?: FormBuilderItem } | null)?.item;

  if (!id || !item) {
    return <Navigate to="/tenant-admin/form-builder" replace />;
  }

  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <CreateFormBuilderView formType={item.type as FormBuilderTab} editData={item} />
      </TenantAdminLayout>
    </PageShell>
  );
}
