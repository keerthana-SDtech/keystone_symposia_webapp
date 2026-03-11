import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { SingleSelect } from "@/components/ui/single-select";
import { ADD_STAGE_CONTENT, ROLE_OPTIONS, STATUS_ACTION_OPTIONS, ALLOWED_ACTION_OPTIONS, type Stage } from "./workflowData";

interface AddStageDrawerProps {
  isOpen:     boolean;
  onClose:    () => void;
  onSave:     (data: Omit<Stage, "id" | "locked">) => void;
  editData?:  Stage | null;
  stageNames: string[];
}

interface FormState {
  name: string; description: string; whoCanAdvance: string[]; stageOrder: string;
  fromStage: string; toStage: string; statusActions: string[]; allowedActions: string[];
}

const EMPTY_FORM: FormState = { name: "", description: "", whoCanAdvance: [], stageOrder: "", fromStage: "", toStage: "", statusActions: [], allowedActions: [] };

export const AddStageDrawer = ({ isOpen, onClose, onSave, editData, stageNames }: AddStageDrawerProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(editData
        ? { name: editData.name, description: editData.description, whoCanAdvance: editData.whoCanAdvance, stageOrder: editData.stageOrder, fromStage: editData.fromStage, toStage: editData.toStage, statusActions: editData.statusActions, allowedActions: editData.allowedActions }
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
    onSave({ name: form.name, description: form.description, whoCanAdvance: form.whoCanAdvance, stageOrder: form.stageOrder, fromStage: form.fromStage, toStage: form.toStage, statusActions: form.statusActions, allowedActions: form.allowedActions, roles: form.whoCanAdvance });
    onClose();
  };

  const isEdit = Boolean(editData);
  const { createTitle, editTitle, sections, fields, cancel, add, save } = ADD_STAGE_CONTENT;
  const orderOptions = Array.from({ length: 20 }, (_, i) => String(i + 1));

  if (!isOpen) return null;

  const inputCls    = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-400";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls    = "text-[13px] font-medium text-gray-700 mb-1.5 block";
  const sectionCls  = "text-[15px] font-semibold text-gray-900 mb-4";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-[420px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-[17px] font-semibold text-gray-900">{isEdit ? editTitle : createTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <p className={sectionCls}>{sections.basicInfo}</p>
          <div>
            <label className={labelCls}>{fields.name.label}<span className="text-red-500 ml-0.5">*</span></label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={fields.name.placeholder} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{fields.description.label}</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder={fields.description.placeholder} className={textareaCls} />
          </div>
          <div>
            <label className={labelCls}>{fields.whoCanAdvance.label}<span className="text-red-500 ml-0.5">*</span></label>
            <MultiSelect searchable selected={form.whoCanAdvance} onChange={v => setForm(p => ({ ...p, whoCanAdvance: v }))} options={ROLE_OPTIONS} placeholder={fields.whoCanAdvance.placeholder} />
          </div>
          <div>
            <label className={labelCls}>{fields.stageOrder.label}<span className="text-red-500 ml-0.5">*</span></label>
            <SingleSelect searchable value={form.stageOrder} onChange={v => setForm(p => ({ ...p, stageOrder: v }))} options={orderOptions} placeholder={fields.stageOrder.placeholder} />
          </div>

          <p className={sectionCls}>{sections.configuration}</p>
          <div>
            <label className={labelCls}>{fields.fromStage.label}<span className="text-red-500 ml-0.5">*</span></label>
            <SingleSelect searchable value={form.fromStage} onChange={v => setForm(p => ({ ...p, fromStage: v }))} options={stageNames} placeholder={fields.fromStage.placeholder} />
          </div>
          <div>
            <label className={labelCls}>{fields.toStage.label}<span className="text-red-500 ml-0.5">*</span></label>
            <SingleSelect searchable value={form.toStage} onChange={v => setForm(p => ({ ...p, toStage: v }))} options={stageNames} placeholder={fields.toStage.placeholder} />
          </div>
          <div>
            <label className={labelCls}>{fields.statusActions.label}<span className="text-red-500 ml-0.5">*</span></label>
            <MultiSelect searchable selected={form.statusActions} onChange={v => setForm(p => ({ ...p, statusActions: v }))} options={STATUS_ACTION_OPTIONS} placeholder={fields.statusActions.placeholder} />
          </div>
          <div>
            <label className={labelCls}>{fields.allowedActions.label}<span className="text-red-500 ml-0.5">*</span></label>
            <MultiSelect searchable selected={form.allowedActions} onChange={v => setForm(p => ({ ...p, allowedActions: v }))} options={ALLOWED_ACTION_OPTIONS} placeholder={fields.allowedActions.placeholder} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="px-5 py-2 text-[13px] border-gray-300 text-gray-700 hover:bg-gray-50">{cancel}</Button>
          <Button onClick={handleSave} disabled={!form.name} className="px-5 py-2 text-[13px] bg-primary hover:bg-primary/90 text-white disabled:opacity-50">{isEdit ? save : add}</Button>
        </div>
      </div>
    </>
  );
};
