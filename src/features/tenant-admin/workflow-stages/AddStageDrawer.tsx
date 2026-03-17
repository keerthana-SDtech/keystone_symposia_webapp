import { useState, useEffect } from "react";
import { X, Check, Pencil, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SingleSelect } from "@/components/ui/single-select";
import { ADD_STAGE_CONTENT, type Stage, type StatusActionItem } from "./workflowData";

interface StageOption { id: string; name: string; }

interface AddStageDrawerProps {
  isOpen:               boolean;
  onClose:              () => void;
  onSave:               (data: Omit<Stage, "id" | "locked">) => void;
  editData?:            Stage | null;
  stageOptions:         StageOption[];
  roleOptions:          string[];
  statusActionOptions:  string[];
  allowedActionOptions: string[];
}

interface ActionRow {
  id:       string;
  name:     string;
  stopHere: boolean;
  toStage:  string;
  editing:  boolean;
}

interface FormState {
  name:          string;
  description:   string;
  stageOrder:    string;
  startDate:     string;
  endDate:       string;
  actionRows:    ActionRow[];
}

const EMPTY_FORM: FormState = {
  name: "", description: "", stageOrder: "",
  startDate: "", endDate: "", actionRows: [],
};

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

const actionRowsFromStatus = (statusActions: StatusActionItem[], stageOptions: StageOption[]): ActionRow[] =>
  (statusActions ?? []).map(a => ({
    id:       uid(),
    name:     a.label ?? a.actionCode,
    stopHere: a.isTerminal ?? a.toStageId === null,
    toStage:  stageOptions.find(s => s.id === a.toStageId)?.name ?? "",
    editing:  false,
  }));

const actionRowsToStatus = (rows: ActionRow[], stageOptions: StageOption[]): StatusActionItem[] =>
  rows.map(r => ({
    actionCode:        r.name.toLowerCase().replace(/\s+/g, "_"),
    label:             r.name,
    resultingStatusId: null,
    toStageId:         r.stopHere ? null : (stageOptions.find(s => s.name === r.toStage)?.id ?? null),
    isTerminal:        r.stopHere,
  }));

export const AddStageDrawer = ({
  isOpen, onClose, onSave, editData, stageOptions,
  roleOptions, allowedActionOptions: _allowedActionOptions,
}: AddStageDrawerProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(editData ? {
        name:        editData.name,
        description: editData.description,
        stageOrder:  editData.stageOrder,
        startDate:   editData.startDate ? editData.startDate.slice(0, 10) : "",
        endDate:     editData.endDate   ? editData.endDate.slice(0, 10)   : "",
        actionRows:  actionRowsFromStatus(editData.statusActions ?? [], stageOptions),
      } : EMPTY_FORM);
    }
  }, [isOpen, editData, stageOptions]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ── action row helpers ──────────────────────────────────────────────────
  const addActionRow = () =>
    setForm(p => ({ ...p, actionRows: [...p.actionRows, { id: uid(), name: "", stopHere: false, toStage: "", editing: true }] }));

  const patchRow = (id: string, patch: Partial<ActionRow>) =>
    setForm(p => ({ ...p, actionRows: p.actionRows.map(r => r.id === id ? { ...r, ...patch } : r) }));

  const saveRow = (id: string) =>
    setForm(p => ({ ...p, actionRows: p.actionRows.map(r => r.id === id ? { ...r, editing: false } : r) }));

  const cancelRow = (id: string) =>
    setForm(p => {
      const row = p.actionRows.find(r => r.id === id);
      if (!row || !row.name) return { ...p, actionRows: p.actionRows.filter(r => r.id !== id) };
      return { ...p, actionRows: p.actionRows.map(r => r.id === id ? { ...r, editing: false } : r) };
    });

  const handleSave = () => {
    if (!form.name) return;
    onSave({
      name:          form.name,
      description:   form.description,
      whoCanAdvance: [],
      stageOrder:    form.stageOrder,
      fromStage:     "",
      toStage:       "",
      statusActions: actionRowsToStatus(form.actionRows, stageOptions),
      allowedActions: [],
      roles:         [],
      startDate:     form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate:       form.endDate   ? new Date(form.endDate).toISOString()   : null,
      isFinalStage:  false,
    });
    onClose();
  };

  const isEdit = Boolean(editData);
  const { createTitle, editTitle, fields, cancel, add, save } = ADD_STAGE_CONTENT;
  const orderOptions = Array.from({ length: 20 }, (_, i) => String(i + 1));
  const hasEditingRows = form.actionRows.some(r => r.editing);

  if (!isOpen) return null;

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[14px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-400 bg-white";
  const labelCls = "text-[14px] font-medium text-gray-800 mb-1.5 block";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-[520px] bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-[20px] font-semibold text-gray-900">{isEdit ? editTitle : createTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

          {/* ── Basic Info ── */}
          <div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Basic Info</h3>
            <div className="h-px bg-gray-200" />
          </div>

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
              rows={4}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder={fields.description.placeholder}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>{fields.stageOrder.label}<span className="text-red-500 ml-0.5">*</span></label>
            <SingleSelect
              value={form.stageOrder}
              onChange={v => setForm(p => ({ ...p, stageOrder: v }))}
              options={orderOptions}
              placeholder={fields.stageOrder.placeholder}
            />
          </div>

          {/* ── Configuration ── */}
          <div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Configuration</h3>
            <div className="h-px bg-gray-200" />
          </div>

          <div>
            <label className={labelCls}>Stage Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                className={`${inputCls} pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Stage End Date</label>
            <div className="relative">
              <input
                type="date"
                value={form.endDate}
                onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                className={`${inputCls} pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* ── Action Configuration ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[17px] font-semibold text-gray-900">Action Configuration</h3>
              {form.actionRows.length > 0 && (
                <button
                  onClick={addActionRow}
                  className="px-4 py-1.5 text-[13px] font-medium border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Add Action
                </button>
              )}
            </div>
            <div className="h-px bg-gray-200" />
          </div>

          {form.actionRows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <p className="text-[16px] font-semibold text-gray-800">No Action Configurations Yet !</p>
              <p className="text-[13px] text-gray-400">Action has not been added yet.</p>
              <button
                onClick={addActionRow}
                className="mt-2 px-5 py-2 text-[13px] font-medium border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Add Action
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_1fr_56px] bg-gray-50 border-b border-gray-200 px-3 py-2.5">
                  <span className="text-[12px] font-medium text-gray-500">Name</span>
                  <span className="text-[12px] font-medium text-gray-500">Stop Here</span>
                  <span className="text-[12px] font-medium text-gray-500">To which stage</span>
                  <span className="text-[12px] font-medium text-gray-500">Actions</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {form.actionRows.map(row => (
                    <div key={row.id} className="grid grid-cols-[1fr_80px_1fr_56px] items-center px-3 py-2.5 gap-2">
                      {row.editing ? (
                        <>
                          <input
                            type="text"
                            value={row.name}
                            onChange={e => patchRow(row.id, { name: e.target.value })}
                            placeholder="Enter name"
                            className="px-2 py-1.5 border border-gray-200 rounded text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-400 w-full"
                          />
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={row.stopHere}
                              onChange={e => patchRow(row.id, { stopHere: e.target.checked, toStage: e.target.checked ? "" : row.toStage })}
                              className="w-4 h-4 accent-primary rounded"
                            />
                          </div>
                          {row.stopHere ? (
                            <span className="text-[13px] text-gray-400">-</span>
                          ) : (
                            <SingleSelect
                              value={row.toStage}
                              onChange={v => patchRow(row.id, { toStage: v })}
                              options={stageOptions.map(s => s.name)}
                              placeholder="Select..."
                            />
                          )}
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => saveRow(row.id)} className="p-1 text-primary hover:text-primary/80 transition-colors">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => cancelRow(row.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-[13px] text-gray-800 truncate">{row.name}</span>
                          <div className="flex items-center justify-center">
                            {row.stopHere
                              ? <Check className="w-3.5 h-3.5 text-gray-700" />
                              : <span className="text-[13px] text-gray-400">-</span>
                            }
                          </div>
                          <span className="text-[13px] text-gray-500 truncate">{row.stopHere ? "-" : (row.toStage || "-")}</span>
                          <div className="flex items-center justify-end">
                            <button onClick={() => patchRow(row.id, { editing: true })} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="px-6 py-2.5 text-[14px] border-gray-300 text-gray-700 hover:bg-gray-50">{cancel}</Button>
          <Button
            onClick={handleSave}
            disabled={!form.name || hasEditingRows}
            className="px-6 py-2.5 text-[14px] bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
          >
            {isEdit ? save : add}
          </Button>
        </div>
      </div>
    </>
  );
};
