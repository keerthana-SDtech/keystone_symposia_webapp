/**
 * EditFormBuilderPage.tsx
 *
 * API integration:
 *   On mount, fetches the full form (definition + sections → fields) by ID
 *   from GET /config/form-definitions/:id.
 *
 *   The response is mapped to:
 *     • editData    (FormBuilderItem)  — pre-fills Basic Details in the editor
 *     • initialItems (FormItem[])     — pre-loads the existing field/section tree
 *
 *   Both are passed as props to CreateFormBuilderView, which handles the
 *   actual save via formBuilderApi.saveEditForm().
 *
 *   The location.state item (passed from the list view) is kept as a fast
 *   initial value for editData so Basic Details render immediately while the
 *   full form loads. initialItems remains empty until the API response arrives.
 */

import { useState, useEffect } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { TenantAdminLayout } from "@/features/tenant-admin/shared/TenantAdminLayout";
import { CreateFormBuilderView } from "@/features/tenant-admin/form-builder/CreateFormBuilderView";
import { formBuilderApi } from "@/features/tenant-admin/form-builder/formBuilderApi";
import type { FormBuilderItem, FormBuilderTab, FormItem } from "@/features/tenant-admin/form-builder/formBuilderData";

export default function EditFormBuilderPage() {
  const { id }    = useParams<{ id: string }>();
  const location  = useLocation();

  // The list view passes a summary item via location.state for an instant
  // first render of Basic Details before the full API response arrives.
  const stateItem = (location.state as { item?: FormBuilderItem } | null)?.item;

  const [editData,      setEditData]      = useState<FormBuilderItem | null>(stateItem ?? null);
  const [initialItems,  setInitialItems]  = useState<FormItem[] | null>(null);
  const [loadError,     setLoadError]     = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        // Fetch the full nested form (sections + fields + options + lookup)
        const full = await formBuilderApi.getForm(id);

        if (cancelled) return;

        // Map the summary fields → FormBuilderItem shape for Basic Details
        setEditData(formBuilderApi.mapSummaryToListItem(full));

        // Map the nested structure → FormItem[] for the field/section editor
        setInitialItems(formBuilderApi.mapApiFormToItems(full));
      } catch (err) {
        console.error("[EditFormBuilderPage] Failed to load form:", err);
        if (!cancelled) setLoadError(true);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  // Guard: no ID → redirect to list
  if (!id) {
    return <Navigate to="/tenant-admin/form-builder" replace />;
  }

  // Error fetching form → redirect to list
  if (loadError) {
    return <Navigate to="/tenant-admin/form-builder" replace />;
  }

  // Still loading the full form — show nothing until data is ready so the
  // editor mounts once with the correct initialItems (avoids a stale initial
  // state if we rendered before the API responded).
  if (!editData || initialItems === null) {
    return (
      <PageShell className="bg-[#F8FAFC]">
        <TenantAdminLayout>
          <div className="flex items-center justify-center min-h-[300px]">
            <span className="text-[14px] text-gray-400">Loading form…</span>
          </div>
        </TenantAdminLayout>
      </PageShell>
    );
  }

  return (
    <PageShell className="bg-[#F8FAFC]">
      <TenantAdminLayout>
        <CreateFormBuilderView
          formType={editData.type as FormBuilderTab}
          editData={editData}
          initialItems={initialItems}
        />
      </TenantAdminLayout>
    </PageShell>
  );
}
