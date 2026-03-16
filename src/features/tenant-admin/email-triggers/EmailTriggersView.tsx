import { useState, useEffect } from "react";
import { EmailTriggersTable } from "./EmailTriggersTable";
import { CreateEmailTriggerDrawer } from "./CreateEmailTriggerDrawer";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Toast } from "@/components/ui/toast";
import { type EmailTrigger } from "./emailTriggersData";
import { emailTriggersApi } from "./api";
import { httpClient } from "@/lib/httpClient";

type DrawerMode = "create" | "edit" | "view";

export const EmailTriggersView = () => {
  const [triggers,    setTriggers]   = useState<EmailTrigger[]>([]);
  const [templateMap, setTemplateMap] = useState<Record<string, string>>({});
  const [search,      setSearch]     = useState("");
  const [drawerOpen,  setDrawerOpen] = useState(false);
  const [drawerMode,  setDrawerMode] = useState<DrawerMode>("create");
  const [editTrigger, setEditTrigger] = useState<EmailTrigger | null>(null);
  const [deleteId,    setDeleteId]   = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  useEffect(() => {
    // Load templates for display name resolution
    httpClient.get<Array<{ id: string; subject: string; eventKey: string }>>('/config/notification-templates')
      .then(r => {
        const map: Record<string, string> = {};
        r.data.forEach(t => { map[t.id] = t.subject || t.eventKey; });
        setTemplateMap(map);
      })
      .catch(() => {});

    emailTriggersApi.list()
      .then(data => setTriggers(data))
      .catch(() => showToast("Failed to load email triggers"));
  }, []);

  // Resolve emailTemplate display name from templateMap
  const resolved = triggers.map(t => ({
    ...t,
    emailTemplate: t.emailTemplateId ? (templateMap[t.emailTemplateId] ?? t.emailTemplate) : t.emailTemplate,
  }));

  const filtered = search.trim()
    ? resolved.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.emailTemplate.toLowerCase().includes(search.toLowerCase())
      )
    : resolved;

  const handleCreate = async (data: Omit<EmailTrigger, "id">) => {
    try {
      const created = await emailTriggersApi.create(data);
      setTriggers(prev => [...prev, created]);
      showToast("Email trigger created successfully");
    } catch { showToast("Failed to create email trigger"); }
  };

  const handleEdit = async (data: Omit<EmailTrigger, "id">) => {
    if (!editTrigger) return;
    try {
      const updated = await emailTriggersApi.update(editTrigger.id, data);
      setTriggers(prev => prev.map(t => t.id === editTrigger.id ? updated : t));
      setEditTrigger(null);
      showToast("Email trigger updated successfully");
    } catch { showToast("Failed to update email trigger"); }
  };

  const handleToggle = async (id: string) => {
    const trigger = triggers.find(t => t.id === id);
    if (!trigger) return;
    try {
      const updated = await emailTriggersApi.toggle(id, !trigger.enabled);
      setTriggers(prev => prev.map(t => t.id === id ? updated : t));
    } catch { showToast("Failed to toggle email trigger"); }
  };

  const openCreate = () => { setEditTrigger(null); setDrawerMode("create"); setDrawerOpen(true); };
  const openEdit   = (id: string) => { setEditTrigger(resolved.find(t => t.id === id) ?? null); setDrawerMode("edit"); setDrawerOpen(true); };
  const openView   = (id: string) => { setEditTrigger(resolved.find(t => t.id === id) ?? null); setDrawerMode("view"); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setEditTrigger(null); };

  return (
    <div className="w-full">
      <EmailTriggersTable
        triggers={filtered} totalCount={triggers.length} search={search} onSearchChange={setSearch}
        onToggle={handleToggle} onView={openView} onEdit={openEdit} onDelete={id => setDeleteId(id)} onCreate={openCreate}
      />

      <CreateEmailTriggerDrawer
        isOpen={drawerOpen} mode={drawerMode} editData={editTrigger} onClose={closeDrawer}
        onSave={drawerMode === "edit" ? handleEdit : handleCreate}
      />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          try {
            await emailTriggersApi.remove(deleteId!);
            setTriggers(prev => prev.filter(t => t.id !== deleteId));
            showToast("Email trigger deleted successfully");
          } catch { showToast("Failed to delete email trigger"); }
          setDeleteId(null);
        }}
      />

      <Toast message={toast.message} variant="success" visible={toast.visible} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
    </div>
  );
};
