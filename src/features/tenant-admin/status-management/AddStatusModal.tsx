import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { MultiSelect } from "@/components/ui/multi-select";
import { ADD_STATUS_CONTENT, MOCK_STAGES, type Status } from "./statusData";
import { ColorPickerPanel } from "./ColorPickerPanel";

interface AddStatusModalProps {
  isOpen:     boolean;
  onClose:    () => void;
  onSave:     (data: Omit<Status, "id">) => void;
  editData?:  Status | null;
}

type Tab = "basicInfo" | "colorPicker";

interface FormState {
  name: string; description: string; assignedStages: string[];
  enabled: boolean; color: string; opacity: number;
}

const EMPTY_FORM: FormState = { name: "", description: "", assignedStages: [], enabled: true, color: "#7B2FBE", opacity: 100 };

export const AddStatusModal = ({ isOpen, onClose, onSave, editData }: AddStatusModalProps) => {
  const [tab,  setTab]  = useState<Tab>("basicInfo");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setTab("basicInfo");
      setForm(editData
        ? { name: editData.name, description: editData.description, assignedStages: editData.assignedStages, enabled: editData.enabled, color: editData.color, opacity: 100 }
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
    if (!form.name) return;
    onSave({ name: form.name, description: form.description, assignedStages: form.assignedStages, enabled: form.enabled, color: form.color });
    onClose();
  };

  const isEdit = Boolean(editData);
  const { modalTitle, editTitle, tabs, fields, cancel, add, save } = ADD_STATUS_CONTENT;

  if (!isOpen) return null;

  const inputCls    = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400";
  const textareaCls = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 resize-none";
  const labelCls    = "text-[13px] font-medium text-gray-700 mb-1.5 block";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-[480px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[16px] font-semibold text-gray-900">{isEdit ? editTitle : modalTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-5 pt-4 flex gap-1">
          {(["basicInfo", "colorPicker"] as Tab[]).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${tab === t ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              {t === "basicInfo" ? tabs.basicInfo : tabs.colorPicker}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "basicInfo" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>{fields.statusName.label}<span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={fields.statusName.placeholder} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{fields.description.label}</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder={fields.description.placeholder} className={textareaCls} />
              </div>
              <div>
                <label className={labelCls}>{fields.assignStages.label}</label>
                <MultiSelect
                  options={MOCK_STAGES}
                  selected={form.assignedStages}
                  placeholder="Select stages"
                  onChange={v => setForm(p => ({ ...p, assignedStages: v }))}
                />
              </div>
              <div className="flex items-center gap-2.5">
                <Toggle checked={form.enabled} onChange={() => setForm(p => ({ ...p, enabled: !p.enabled }))} />
                <span className="text-[13px] text-gray-700">{fields.enableStatus.label}</span>
              </div>
            </div>
          )}
          {tab === "colorPicker" && (
            <ColorPickerPanel color={form.color} opacity={form.opacity} onChange={(c, o) => setForm(p => ({ ...p, color: c, opacity: o }))} />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="px-4 py-2 text-[13px] border-gray-300 text-gray-700 hover:bg-gray-50">{cancel}</Button>
          <Button onClick={handleSave} disabled={!form.name} className="px-4 py-2 text-[13px] bg-primary hover:bg-primary/90 text-white disabled:opacity-50">{isEdit ? save : add}</Button>
        </div>
      </div>
    </>
  );
};
