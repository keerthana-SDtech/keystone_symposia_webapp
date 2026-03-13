import { useState, useEffect } from "react";
import { StatusTable } from "./StatusTable";
import { AddStatusModal } from "./AddStatusModal";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Toast } from "@/components/ui/toast";
import { type Status } from "./statusData";
import { statusApi } from "./api";

export const StatusManagementView = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [search,       setSearch]       = useState("");
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editStatus,   setEditStatus]   = useState<Status | null>(null);
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  useEffect(() => {
    statusApi.list()
      .then(setStatuses)
      .catch(() => showToast("Failed to load statuses"));
  }, []);

  const filtered = search.trim()
    ? statuses.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
      )
    : statuses;

  const handleCreate = async (data: Omit<Status, "id">) => {
    try { const created = await statusApi.create(data); setStatuses(prev => [...prev, created]); showToast("Status created successfully"); }
    catch { showToast("Failed to create status"); }
  };

  const handleEdit = async (data: Omit<Status, "id">) => {
    if (!editStatus) return;
    try { const updated = await statusApi.update(editStatus.id, data); setStatuses(prev => prev.map(s => s.id === editStatus.id ? updated : s)); setEditStatus(null); showToast("Status updated successfully"); }
    catch { showToast("Failed to update status"); }
  };

  const handleToggle = async (id: string) => {
    const status = statuses.find(s => s.id === id); if (!status) return;
    try { const updated = await statusApi.toggle(id, !status.enabled); setStatuses(prev => prev.map(s => s.id === id ? updated : s)); }
    catch { showToast("Failed to toggle status"); }
  };

  const handleOpenEdit = (id: string) => {
    setEditStatus(statuses.find(s => s.id === id) ?? null);
    setModalOpen(true);
  };

  return (
    <div className="w-full">
      <StatusTable
        statuses={filtered} totalCount={statuses.length} search={search} onSearchChange={setSearch}
        onToggle={handleToggle} onEdit={handleOpenEdit} onDelete={id => setDeleteId(id)}
        onCreate={() => { setEditStatus(null); setModalOpen(true); }}
      />

      <AddStatusModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditStatus(null); }} onSave={editStatus ? handleEdit : handleCreate} editData={editStatus} />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          try { await statusApi.remove(deleteId!); setStatuses(prev => prev.filter(s => s.id !== deleteId)); showToast("Status deleted successfully"); }
          catch { showToast("Failed to delete status"); }
          setDeleteId(null);
        }}
      />

      <Toast message={toast.message} variant="success" visible={toast.visible} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
    </div>
  );
};
