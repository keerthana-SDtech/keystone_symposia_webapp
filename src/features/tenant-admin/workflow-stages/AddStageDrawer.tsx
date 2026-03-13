import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { SingleSelect } from "@/components/ui/single-select";
import { ADD_STAGE_CONTENT, ALLOWED_ACTION_OPTIONS, type Stage, type StatusActionItem } from "./workflowData";

interface StageOption  { id: string; name: string; }
interface StatusOption { id: string; name: string; }

interface AddStageDrawerProps {
  isOpen:        boolean;
  onClose:       () => void;
  onSave:        (data: Omit<Stage, "id" | "locked">) => void;
  editData?:     Stage | null;
  stageOptions:  StageOption[];
  statusOptions: StatusOption[];
  roleOptions:   string[];
}

interface FormState {
  name: string;
  description: string;
  whoCanAdvance: string[];
  stageOrder: string;
  fromStage: string;
  toStage: string;
  statusActions: StatusActionItem[];
  allowedActions: string[];
  startDate: string;
  endDate: string;
  isFinalStage: boolean;
}

const EMPTY_FORM: FormState = {
  name: "", description: "", whoCanAdvance: [], stageOrder: "",
  fromStage: "", toStage: "", statusActions: [], allowedActions: [],
  startDate: "", endDate: "", isFinalStage: false,
};

export const AddStageDrawer = ({ isOpen, onClose, onSave, editData, stageOptions, statusOptions, roleOptions }: AddStageDrawerProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(editData ? {
        name:          editData.name,
        description:   editData.description,
        whoCanAdvance: editData.whoCanAdvance,
        stageOrder:    editData.stageOrder,
        fromStage:     editData.fromStage,
        toStage:       editData.toStage,
        statusActions: (editData.statusActions ?? []).map(a => ({
          ...a,
          isTerminal: a.isTerminal !== undefined ? a.isTerminal : a.toStageId === null,
        })),
        allowedActions: editData.allowedActions,
        startDate:     editData.startDate ? editData.startDate.slice(0, 10) : "",
        endDate:       editData.endDate   ? editData.endDate.slice(0, 10)   : "",
        isFinalStage:  editData.isFinalStage ?? false,
      } : EMPTY_FORM);
    }
  }, [isOpen, editData]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Selected status names driving the action list
  const selectedStatusNames = form.statusActions.map(a => {
    const status = statusOptions.find(s => s.id === a.statusId);
    return status?.name ?? a.actionCode;
  });

  // When the MultiSelect changes, sync statusActions:
  // - selecting a status → adds action with actionCode = lowercased name, statusId = status.id
  // - deselecting → removes that action
  const handleStatusActionChange = (selectedNames: string[]) => {
    setForm(p => {
      const next: StatusActionItem[] = selectedNames.map(name => {
        const status = statusOptions.find(s => s.name === name);
        const actionCode = name.toLowerCase().replace(/\s+/g, "_");
        const existing = p.statusActions.find(a => a.statusId === status?.id || a.actionCode === actionCode);
        return {
          actionCode,
          statusId:   status?.id ?? null,
          toStageId:  existing?.toStageId ?? null,
          isTerminal: existing?.isTerminal ?? false,   // new actions default to non-terminal
        };
      });
      return { ...p, statusActions: next };
    });
  };

  const toggleTerminal = (actionCode: string, terminal: boolean) => {
    setForm(p => ({
      ...p,
      statusActions: p.statusActions.map(a =>
        a.actionCode === actionCode
          ? { ...a, isTerminal: terminal, toStageId: terminal ? null : a.toStageId }
          : a
      ),
    }));
  };

  const updateToStage = (actionCode: string, stageName: string) => {
    const found = stageOptions.find(s => s.name === stageName);
    setForm(p => ({
      ...p,
      statusActions: p.statusActions.map(a =>
        a.actionCode === actionCode ? { ...a, toStageId: found?.id ?? null, isTerminal: false } : a
      ),
    }));
  };

  const handleSave = () => {
    if (!form.name) return;
    onSave({
      name:          form.name,
      description:   form.description,
      whoCanAdvance: form.whoCanAdvance,
      stageOrder:    form.stageOrder,
      fromStage:     form.fromStage,
      toStage:       form.toStage,
      statusActions: form.statusActions,
      allowedActions: form.allowedActions,
      roles:         form.whoCanAdvance,
      startDate:     form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate:       form.endDate   ? new Date(form.endDate).toISOString()   : null,
      isFinalStage:  form.isFinalStage,
    });
    onClose();
  };

  const stageNameOptions = stageOptions.map(s => s.name);
  const statusNameOptions = statusOptions.map(s => s.name);
  const isEdit = Boolean(editData);
  const { createTitle, editTitle, sections, fields, cancel, add, save } = ADD_STAGE_CONTENT;
  const orderOptions = Array.from({ length: 20 }, (_, i) => String(i + 1));

  if (!isOpen) return null;

  const inputCls   = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-400";
  const labelCls   = "text-[13px] font-medium text-gray-700 mb-1.5 block";
  const sectionCls = "text-[15px] font-semibold text-gray-900 mb-4";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-[480px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-[17px] font-semibold text-gray-900">{isEdit ? editTitle : createTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* ── Basic Info ── */}
          <p className={sectionCls}>{sections.basicInfo}</p>

          <div>
            <label className={labelCls}>{fields.name.label}<span className="text-red-500 ml-0.5">*</span></label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={fields.name.placeholder} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>{fields.description.label}</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder={fields.description.placeholder} className={`${inputCls} resize-none`} />
          </div>

          <div>
            <label className={labelCls}>{fields.whoCanAdvance.label}<span className="text-red-500 ml-0.5">*</span></label>
            <MultiSelect searchable selected={form.whoCanAdvance} onChange={v => setForm(p => ({ ...p, whoCanAdvance: v }))} options={roleOptions} placeholder={fields.whoCanAdvance.placeholder} />
          </div>

          <div>
            <label className={labelCls}>{fields.stageOrder.label}<span className="text-red-500 ml-0.5">*</span></label>
            <SingleSelect searchable value={form.stageOrder} onChange={v => setForm(p => ({ ...p, stageOrder: v }))} options={orderOptions} placeholder={fields.stageOrder.placeholder} />
          </div>

          {/* ── Configuration ── */}
          <p className={sectionCls}>{sections.configuration}</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Stage Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Stage End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className={inputCls} />
            </div>
          </div>

          {/* Primary Actions — sourced from statuses */}
          <div>
            <label className={labelCls}>Primary Actions<span className="text-red-500 ml-0.5">*</span></label>
            <MultiSelect
              searchable
              options={statusNameOptions}
              selected={selectedStatusNames}
              onChange={handleStatusActionChange}
              placeholder="Select actions from statuses"
            />
          </div>

          {/* Per-action sub-sections */}
          {form.statusActions.map(action => {
            const label = action.actionCode.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            const isTerminal = action.isTerminal === true;
            const currentStageName = stageOptions.find(s => s.id === action.toStageId)?.name ?? "";

            return (
              <div key={action.actionCode} className="border-t border-gray-100 pt-4">
                <p className="text-[14px] font-semibold text-gray-800 mb-3">{label}</p>

                <div className="flex flex-col gap-3">
                  {!isTerminal && (
                    <div>
                      <label className={labelCls}>
                        Next Stage for {label}<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <SingleSelect
                        searchable
                        value={currentStageName}
                        onChange={v => updateToStage(action.actionCode, v)}
                        options={stageNameOptions}
                        placeholder={`Select next stage for ${label}`}
                      />
                    </div>
                  )}

                  {isTerminal && (
                    <p className="text-[13px] text-gray-400 italic">No stages ahead — this action ends the workflow at this point.</p>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isTerminal}
                      onChange={e => toggleTerminal(action.actionCode, e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <span className="text-[13px] text-gray-500">Mark as terminal (no next stage)</span>
                  </label>
                </div>
              </div>
            );
          })}

          <div>
            <label className={labelCls}>{fields.allowedActions.label}</label>
            <MultiSelect searchable selected={form.allowedActions} onChange={v => setForm(p => ({ ...p, allowedActions: v }))} options={ALLOWED_ACTION_OPTIONS} placeholder={fields.allowedActions.placeholder} />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFinalStage"
              checked={form.isFinalStage}
              onChange={e => setForm(p => ({ ...p, isFinalStage: e.target.checked }))}
              className="w-4 h-4 accent-primary rounded"
            />
            <label htmlFor="isFinalStage" className="text-[13px] font-medium text-gray-700 cursor-pointer">
              Mark as Final Stage
            </label>
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
