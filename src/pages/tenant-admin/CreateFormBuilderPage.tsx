import { useParams, Navigate } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { CreateFormBuilderView } from "@/features/tenant-admin/form-builder/CreateFormBuilderView";
import type { FormBuilderTab } from "@/features/tenant-admin/form-builder/formBuilderData";

export default function CreateFormBuilderPage() {
  const { type } = useParams<{ type: string }>();

  if (type !== "admin" && type !== "application") {
    return <Navigate to="/tenant-admin/form-builder" replace />;
  }

  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <CreateFormBuilderView formType={type as FormBuilderTab} />
      </TenantAdminLayout>
    </PageShell>
  );
}
