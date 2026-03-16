import { useState, useEffect } from "react";
import { EmailTemplatesList } from "./EmailTemplatesList";
import { EmailTemplatesForm } from "./EmailTemplatesForm";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Toast } from "@/components/ui/toast";
import { EMAIL_TEMPLATES_PAGE_CONTENT, type EmailTemplate } from "./emailTemplatesData";
import { emailTemplatesApi, entityTypesApi, type EntityType } from "./api";

export const EmailTemplatesView = () => {
  const [templates,   setTemplates]   = useState<EmailTemplate[]>([]);
  const [entityTypes, setEntityTypes] = useState<EntityType[]>([]);
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [isNew,       setIsNew]       = useState(false);
  const [deleteId,    setDeleteId]    = useState<string | null>(null);
  const [search,      setSearch]      = useState("");
  const [isSaving,    setIsSaving]    = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  useEffect(() => {
    emailTemplatesApi.list()
      .then(data => setTemplates(data))
      .catch(() => showToast("Failed to load email templates"));
    entityTypesApi.list()
      .then(data => setEntityTypes(data))
      .catch(() => {});
  }, []);

  const selectedTemplate = templates.find(t => t.id === selectedId) ?? null;

  const handleCreate = () => {
    setSelectedId(null);
    setIsNew(true);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setIsNew(false);
  };

  const handleSave = async (data: Omit<EmailTemplate, "id">) => {
    setIsSaving(true);
    try {
      if (isNew) {
        const created = await emailTemplatesApi.create(data);
        setTemplates(prev => [...prev, created]);
        setSelectedId(created.id);
        setIsNew(false);
        showToast("Email template created successfully");
      } else if (selectedId) {
        const updated = await emailTemplatesApi.update(selectedId, data);
        setTemplates(prev => prev.map(t => t.id === selectedId ? updated : t));
        showToast("Email template updated successfully");
      }
    } catch {
      showToast(isNew ? "Failed to create email template" : "Failed to update email template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await emailTemplatesApi.remove(deleteId);
      setTemplates(prev => prev.filter(t => t.id !== deleteId));
      if (selectedId === deleteId) { setSelectedId(null); setIsNew(false); }
      showToast("Email template deleted successfully");
    } catch {
      showToast("Failed to delete email template");
    }
    setDeleteId(null);
  };

  const showForm = isNew || !!selectedId;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight leading-tight">
          {EMAIL_TEMPLATES_PAGE_CONTENT.pageTitle}
        </h1>
        <p className="text-[14px] text-gray-500 mt-1">{EMAIL_TEMPLATES_PAGE_CONTENT.subtitle}</p>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden flex" style={{ minHeight: 560 }}>
        <EmailTemplatesList
          templates={templates}
          selectedId={isNew ? null : selectedId}
          search={search}
          onSearchChange={setSearch}
          onSelect={handleSelect}
          onCreate={handleCreate}
        />

        {showForm ? (
          <EmailTemplatesForm
            template={selectedTemplate}
            isNew={isNew}
            entityTypes={entityTypes}
            onSave={handleSave}
            onDelete={selectedId ? () => setDeleteId(selectedId) : undefined}
            isSaving={isSaving}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-[14px] text-gray-400">
            {EMAIL_TEMPLATES_PAGE_CONTENT.emptyForm}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
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
