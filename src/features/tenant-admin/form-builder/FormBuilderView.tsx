/**
 * FormBuilderView.tsx
 *
 * API integration points (no UI changes):
 *   • Mount       → formBuilderApi.listForms()        replaces MOCK_FORM_BUILDER_ITEMS
 *   • Toggle      → formBuilderApi.toggleFormActive() then updates local state
 *   • Delete      → formBuilderApi.deleteForm()       then removes from local state
 *
 * All async operations show a success/error toast via the existing Toast
 * component already present in the component tree.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormBuilderTable } from "./FormBuilderTable";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Toast } from "@/components/ui/toast";
import {
  type FormBuilderItem,
  type FormBuilderTab,
} from "./formBuilderData";
import { formBuilderApi } from "./formBuilderApi";

export const FormBuilderView = () => {
  const navigate = useNavigate();
  const [items,     setItems]     = useState<FormBuilderItem[]>([]);
  const [activeTab, setActiveTab] = useState<FormBuilderTab>("application");
  const [search,    setSearch]    = useState("");
  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; error?: boolean }>({
    visible: false,
    message: "",
  });

  // ── helpers ──────────────────────────────────────────────────────────────

  const showToast = (message: string, error = false) => {
    setToast({ visible: true, message, error });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  // ── load forms from API on mount ─────────────────────────────────────────
  // Replaces: useEffect(() => { setItems(MOCK_FORM_BUILDER_ITEMS); }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const summaries = await formBuilderApi.listForms();
        if (!cancelled) {
          // Map API response shape → FormBuilderItem shape used by the table
          setItems(summaries.map(formBuilderApi.mapSummaryToListItem));
        }
      } catch {
        if (!cancelled) showToast("Failed to load forms.", true);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // ── derived list (tab + search filter) ───────────────────────────────────

  const tabItems = items.filter(i => i.type === activeTab);
  const filtered = search.trim()
    ? tabItems.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase()) ||
        i.module.toLowerCase().includes(search.toLowerCase())
      )
    : tabItems;

  // ── toggle enable/disable ─────────────────────────────────────────────────
  // Optimistically update local state, then sync to backend.

  const handleToggle = async (id: string) => {
    const target = items.find(i => i.id === id);
    if (!target) return;

    // Optimistic update
    setItems(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));

    try {
      await formBuilderApi.toggleFormActive(id, !target.enabled);
    } catch {
      // Roll back on failure
      setItems(prev => prev.map(i => i.id === id ? { ...i, enabled: target.enabled } : i));
      showToast("Failed to update form status.", true);
    }
  };

  // ── duplicate ─────────────────────────────────────────────────────────────

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await formBuilderApi.duplicateForm(id);
      setItems(prev => [...prev, copy]);
      showToast("Form duplicated successfully");
    } catch {
      showToast("Failed to duplicate form.", true);
    }
  };

  // ── navigation ────────────────────────────────────────────────────────────

  const openCreate = (type: FormBuilderTab) => {
    navigate(`/tenant-admin/form-builder/create/${type}`);
  };

  const openEdit = (id: string) => {
    // Pass the summary item via location state for the edit page to read.
    // The edit page will also fetch the full form (sections + fields) from API.
    const item = items.find(i => i.id === id);
    if (!item) return;
    navigate(`/tenant-admin/form-builder/edit/${id}`, { state: { item } });
  };

  // ── delete ────────────────────────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);

    try {
      await formBuilderApi.deleteForm(id);
      setItems(prev => prev.filter(i => i.id !== id));
      showToast("Form deleted successfully");
    } catch {
      showToast("Failed to delete form.", true);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      <FormBuilderTable
        items={filtered}
        totalCount={items.length}
        activeTab={activeTab}
        search={search}
        onTabChange={setActiveTab}
        onSearchChange={setSearch}
        onToggle={handleToggle}
        onEdit={openEdit}
        onDuplicate={handleDuplicate}
        onDelete={id => setDeleteId(id)}
        onCreate={openCreate}
      />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      <Toast
        message={toast.message}
        variant={toast.error ? "error" : "success"}
        visible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
};
