import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { SingleSelect } from "@/components/ui/single-select";
import {
  CREATE_FORM_CONTENT,
  FORM_BUILDER_TABS,
  MODULE_OPTIONS,
  type FormBuilderItem,
  type FormBuilderTab,
} from "./formBuilderData";

type DrawerMode = "create" | "edit";

interface CreateFormDrawerProps {
  isOpen:      boolean;
  mode:        DrawerMode;
  editData?:   FormBuilderItem | null;
  initialType?: FormBuilderTab;
  onClose:     () => void;
  onSave:      (data: Omit<FormBuilderItem, "id">) => void;
}

interface FormState {
  name:        string;
  description: string;
  module:      string;
  type:        FormBuilderTab;
  enabled:     boolean;
}

const EMPTY_FORM: FormState = { name: "", description: "", module: "", type: "application", enabled: true };

export const CreateFormDrawer = ({ isOpen, mode, editData, initialType, onClose, onSave }: CreateFormDrawerProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(editData
        ? { name: editData.name, description: editData.description, module: editData.module, type: editData.type, enabled: editData.enabled }
        : { ...EMPTY_FORM, type: initialType ?? "application" }
      );
    }
  }, [isOpen, editData, initialType]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!form.name || !form.module) return;
    onSave({ name: form.name, description: form.description, module: form.module, type: form.type, enabled: form.enabled });
    onClose();
  };

  const isEdit = mode === "edit";
  const { createTitle, editTitle, fields, cancel, add, save } = CREATE_FORM_CONTENT;
  const drawerTitle = isEdit ? editTitle : createTitle;

  const inputCls    = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 bg-white";
  const textareaCls = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 resize-none bg-white";
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
              <label className={labelCls}>{fields.name.label}<span className="text-red-500 ml-0.5">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder={fields.name.placeholder}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>{fields.description.label}</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder={fields.description.placeholder}
                className={textareaCls}
              />
            </div>
            <div>
              <label className={labelCls}>{fields.module.label}<span className="text-red-500 ml-0.5">*</span></label>
              <SingleSelect
                options={MODULE_OPTIONS}
                value={form.module}
                placeholder={fields.module.placeholder}
                onChange={v => setForm(p => ({ ...p, module: v }))}
              />
            </div>
            <div>
              <label className={labelCls}>{fields.type.label}<span className="text-red-500 ml-0.5">*</span></label>
              <SingleSelect
                options={FORM_BUILDER_TABS.map(t => t.label)}
                value={FORM_BUILDER_TABS.find(t => t.key === form.type)?.label ?? ""}
                placeholder={fields.type.placeholder}
                onChange={v => {
                  const tab = FORM_BUILDER_TABS.find(t => t.label === v);
                  if (tab) setForm(p => ({ ...p, type: tab.key }));
                }}
              />
            </div>
            <div className="flex items-center gap-2.5">
              <Toggle checked={form.enabled} onChange={() => setForm(p => ({ ...p, enabled: !p.enabled }))} />
              <span className="text-[13px] text-gray-700">{fields.enabled.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="px-4 py-2 text-[13px] border-gray-300 text-gray-700 hover:bg-gray-50">{cancel}</Button>
          <Button
            onClick={handleSave}
            disabled={!form.name || !form.module}
            className="px-4 py-2 text-[13px] bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
          >
            {isEdit ? save : add}
          </Button>
        </div>
      </div>
    </>
  );
};
