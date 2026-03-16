import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { MultiSelect } from "@/components/ui/multi-select";
import { SingleSelect } from "@/components/ui/single-select";
import { CREATE_TRIGGER_CONTENT, type EmailTrigger } from "./emailTriggersData";

type DrawerMode = "create" | "edit" | "view";

interface CreateEmailTriggerDrawerProps {
  isOpen:               boolean;
  mode:                 DrawerMode;
  editData?:            EmailTrigger | null;
  onClose:              () => void;
  onSave:               (data: Omit<EmailTrigger, "id">) => void;
  sendToOptions:        string[];
  emailTemplateOptions: string[];
}

interface FormState {
  name:          string;
  description:   string;
  emailTemplate: string;
  sendTo:        string[];
  enabled:       boolean;
}

const EMPTY_FORM: FormState = { name: "", description: "", emailTemplate: "", sendTo: [], enabled: true };

export const CreateEmailTriggerDrawer = ({ isOpen, mode, editData, onClose, onSave, sendToOptions, emailTemplateOptions }: CreateEmailTriggerDrawerProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(editData
        ? { name: editData.name, description: editData.description, emailTemplate: editData.emailTemplate, sendTo: editData.sendTo, enabled: editData.enabled }
        : EMPTY_FORM
      );
    }
  }, [isOpen, editData]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!form.name || !form.emailTemplate) return;
    onSave({ name: form.name, description: form.description, emailTemplate: form.emailTemplate, sendTo: form.sendTo, enabled: form.enabled });
    onClose();
  };

  const isView  = mode === "view";
  const isEdit  = mode === "edit";
  const { createTitle, editTitle, viewTitle, fields, cancel, add, save } = CREATE_TRIGGER_CONTENT;
  const drawerTitle = isView ? viewTitle : isEdit ? editTitle : createTitle;

  const inputCls    = `w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 ${isView ? "bg-gray-50 cursor-default" : "bg-white"}`;
  const textareaCls = `w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 resize-none ${isView ? "bg-gray-50 cursor-default" : "bg-white"}`;
  const labelCls    = "text-[13px] font-medium text-gray-700 mb-1.5 block";

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-[480px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[16px] font-semibold text-gray-900">{drawerTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelCls}>{fields.name.label}{!isView && <span className="text-red-500 ml-0.5">*</span>}</label>
              <input type="text" value={form.name} onChange={e => !isView && setForm(p => ({ ...p, name: e.target.value }))} placeholder={fields.name.placeholder} readOnly={isView} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{fields.description.label}</label>
              <textarea rows={3} value={form.description} onChange={e => !isView && setForm(p => ({ ...p, description: e.target.value }))} placeholder={fields.description.placeholder} readOnly={isView} className={textareaCls} />
            </div>
            <div>
              <label className={labelCls}>{fields.emailTemplate.label}{!isView && <span className="text-red-500 ml-0.5">*</span>}</label>
              <SingleSelect options={emailTemplateOptions} value={form.emailTemplate} placeholder={fields.emailTemplate.placeholder} onChange={v => setForm(p => ({ ...p, emailTemplate: v }))} disabled={isView} />
            </div>
            <div>
              <label className={labelCls}>{fields.sendTo.label}</label>
              <MultiSelect options={sendToOptions} selected={form.sendTo} placeholder={fields.sendTo.placeholder} onChange={v => setForm(p => ({ ...p, sendTo: v }))} disabled={isView} />
            </div>
            <div className="flex items-center gap-2.5">
              <Toggle checked={form.enabled} onChange={() => !isView && setForm(p => ({ ...p, enabled: !p.enabled }))} />
              <span className="text-[13px] text-gray-700">{fields.enabled.label}</span>
            </div>
          </div>
        </div>

        {!isView && (
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
            <Button variant="outline" onClick={onClose} className="px-4 py-2 text-[13px] border-gray-300 text-gray-700 hover:bg-gray-50">{cancel}</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.emailTemplate} className="px-4 py-2 text-[13px] bg-primary hover:bg-primary/90 text-white disabled:opacity-50">{isEdit ? save : add}</Button>
          </div>
        )}
      </div>
    </>
  );
};
