import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormBuilderTable } from "./FormBuilderTable";
import { CreateFormDrawer } from "./CreateFormDrawer";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Toast } from "@/components/ui/toast";
import {
  type FormBuilderItem,
  type FormBuilderTab,
  MOCK_FORM_BUILDER_ITEMS,
} from "./formBuilderData";

export const FormBuilderView = () => {
  const navigate = useNavigate();
  const [items,      setItems]      = useState<FormBuilderItem[]>([]);
  const [activeTab,  setActiveTab]  = useState<FormBuilderTab>("admin");
  const [search,     setSearch]     = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editItem,   setEditItem]   = useState<FormBuilderItem | null>(null);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  useEffect(() => {
    setItems(MOCK_FORM_BUILDER_ITEMS);
  }, []);

  const tabItems = items.filter(i => i.type === activeTab);

  const filtered = search.trim()
    ? tabItems.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase()) ||
        i.module.toLowerCase().includes(search.toLowerCase())
      )
    : tabItems;

  const handleEdit = (data: Omit<FormBuilderItem, "id">) => {
    if (!editItem) return;
    setItems(prev => prev.map(i => i.id === editItem.id ? { ...data, id: editItem.id } : i));
    setEditItem(null);
    showToast("Form updated successfully");
  };

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  };

  const handleDuplicate = (id: string) => {
    const source = items.find(i => i.id === id);
    if (!source) return;
    const copy: FormBuilderItem = { ...source, id: Date.now().toString(), name: `${source.name} (copy)` };
    setItems(prev => [...prev, copy]);
    showToast("Form duplicated successfully");
  };

  const openCreate = (type: FormBuilderTab) => {
    navigate(`/tenant-admin/form-builder/create/${type}`);
  };

  const openEdit = (id: string) => {
    setEditItem(items.find(i => i.id === id) ?? null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => { setDrawerOpen(false); setEditItem(null); };

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

      <CreateFormDrawer
        isOpen={drawerOpen}
        mode="edit"
        editData={editItem}
        onClose={closeDrawer}
        onSave={handleEdit}
      />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          setItems(prev => prev.filter(i => i.id !== deleteId));
          showToast("Form deleted successfully");
          setDeleteId(null);
        }}
      />

      <Toast
        message={toast.message}
        variant="success"
        visible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
};
