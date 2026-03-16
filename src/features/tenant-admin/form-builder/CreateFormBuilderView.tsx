import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronUp, ChevronDown,
  GripVertical, Copy, Trash2, MoreVertical, Pencil, Check, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { MODULE_OPTIONS, type FormBuilderTab } from "./formBuilderData";

// ── constants ──────────────────────────────────────────────────────────────

const ENTITY_TYPE_OPTIONS   = ["Lorem Ipsum", "Concept", "Proposal", "Review", "User", "Tenant"];
const STAGE_OPTIONS         = ["Concept Submission", "Concept Review", "Proposal Submission", "Proposal Review", "Finalization", "Archived"];
const ADD_OPTIONS           = ["Field", "Section"];
const FIELD_TYPES           = ["Text Field", "Text Area", "Radio Button", "Checkbox", "Dropdown - Single select", "Dropdown - Multi select", "Paragraph", "File Upload", "Look Up"];
const TEXTAREA_VAL_TYPES    = ["Maximum character", "Minimum character"];
const PARAGRAPH_VAL_TYPES   = ["Length", "Pattern"];
const CHECKBOX_VAL_TYPES    = ["Select at least", "Select at most"];
const STAGE_ORDER_OPTIONS   = ["Select stage order", "1", "2", "3", "4", "5"];
const ASSOCIATED_FIELD_OPTIONS = ["Field 1", "Field 2", "Field 3"];
const GOTO_FIELD_OPTIONS       = ["Field name 1", "Field name 2", "Field name 3"];

// ── styles ─────────────────────────────────────────────────────────────────

const inputCls    = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[14px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 bg-white";
const textareaCls = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[14px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 resize-none bg-gray-50";
const labelCls    = "text-[14px] font-medium text-gray-800 mb-1.5 block";
const smLabelCls  = "text-[13px] font-medium text-gray-700 mb-1.5 block";

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ── types ──────────────────────────────────────────────────────────────────

interface ParaValidationRow   { id: string; type: string; minValue: string; maxValue: string; }
interface CheckboxValRow      { id: string; type: string; number: string; customError: string; }

interface FieldOption { text: string; goTo: string; }

interface FieldItem {
  kind:              "field";
  id:                string;
  title:             string;
  type:              string;
  options:           FieldOption[];
  showGoToField:     boolean;
  required:          boolean;
  fieldAssociation:  boolean;
  associatedField:   string;
  // validation (Text Field / Text Area / File Upload)
  showValidation:    boolean;
  validationMessage: string;
  // Paragraph validation rows
  paraValidations:   ParaValidationRow[];
  // Checkbox / Multi-select validation rows
  cbValidations:     CheckboxValRow[];
  // Look Up
  lookupName:        string;
  lookupUrlTemplate: string;
  lookupResultPath:  string;
  lookupLabelPath:   string;
  lookupValuePath:   string;
}

interface SectionItem {
  kind:      "section";
  id:        string;
  title:     string;
  collapsed: boolean;
  fields:    FieldItem[];
}

type FormItem = FieldItem | SectionItem;

const makeField = (): FieldItem => ({
  kind: "field", id: uid(),
  title: "", type: "Dropdown - Single select",
  options: [{ text: "Option 1", goTo: "" }],
  showGoToField: false,
  required: false, fieldAssociation: false, associatedField: "",
  showValidation: false, validationMessage: "",
  paraValidations: [], cbValidations: [],
  lookupName: "", lookupUrlTemplate: "",
  lookupResultPath: "", lookupLabelPath: "", lookupValuePath: "",
});

const makeSection = (): SectionItem => ({
  kind: "section", id: uid(), title: "Section 1", collapsed: false, fields: [],
});

// ── helpers ────────────────────────────────────────────────────────────────

const hasOptions      = (t: string) => ["Radio Button","Checkbox","Dropdown - Single select","Dropdown - Multi select"].includes(t);
const isRadio         = (t: string) => t === "Radio Button";
const isCheckboxes    = (t: string) => t === "Checkbox";
const isSingleDropdown = (t: string) => t === "Dropdown - Single select";
const isMultiDropdown = (t: string) => t === "Dropdown - Multi select";
const isParagraph     = (t: string) => t === "Paragraph";
const isTextField     = (t: string) => t === "Text Field";
const isTextArea      = (t: string) => t === "Text Area";
const isFileUpload    = (t: string) => t === "File Upload";
const isLookUp        = (t: string) => t === "Look Up";
const hasCbVal        = (t: string) => isCheckboxes(t) || isMultiDropdown(t) || isTextArea(t);
const hasGoToSection  = (t: string) => isRadio(t) || isSingleDropdown(t);

// ── inline dropdown ────────────────────────────────────────────────────────

const Dropdown = ({ options, value, placeholder, onChange, className = "" }:
  { options: string[]; value: string; placeholder: string; onChange: (v: string) => void; className?: string }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-md text-[14px] bg-white focus:outline-none focus:ring-1 focus:ring-primary">
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-52 overflow-y-auto">
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full px-4 py-2.5 text-[14px] text-left hover:bg-gray-50 ${value === opt ? "text-primary font-medium" : "text-gray-700"}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── field card ─────────────────────────────────────────────────────────────

interface FieldCardProps {
  field:          FieldItem;
  showAssociation?: boolean;
  onChange:       (id: string, patch: Partial<FieldItem>) => void;
  onDupe:         (id: string) => void;
  onRemove:       (id: string) => void;
  onAddSection?:  (id: string) => void;
}

const FieldCard = ({ field, showAssociation = true, onChange, onDupe, onRemove, onAddSection }: FieldCardProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!moreOpen) return;
    const h = (e: MouseEvent) => { if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [moreOpen]);

  const ch = (patch: Partial<FieldItem>) => onChange(field.id, patch);

  const addOption = () => ch({ options: [...field.options, { text: `Option ${field.options.length + 1}`, goTo: "" }] });
  const removeOption = (idx: number) => ch({ options: field.options.filter((_, i) => i !== idx) });
  const updateOption = (idx: number, text: string) => {
    const next = field.options.map((o, i) => i === idx ? { ...o, text } : o);
    ch({ options: next });
  };
  const updateOptionGoTo = (idx: number, goTo: string) => {
    const next = field.options.map((o, i) => i === idx ? { ...o, goTo } : o);
    ch({ options: next });
  };

  const addParaValidation = () =>
    ch({ paraValidations: [...field.paraValidations, { id: uid(), type: "Length", minValue: "", maxValue: "" }] });
  const updateParaVal = (id: string, patch: Partial<ParaValidationRow>) =>
    ch({ paraValidations: field.paraValidations.map(r => r.id === id ? { ...r, ...patch } : r) });
  const removeParaVal = (id: string) =>
    ch({ paraValidations: field.paraValidations.filter(r => r.id !== id) });

  const addCbValidation = () =>
    ch({ cbValidations: [...field.cbValidations, { id: uid(), type: isTextArea(field.type) ? "Maximum character" : "Select at least", number: "", customError: "" }] });
  const updateCbVal = (id: string, patch: Partial<CheckboxValRow>) =>
    ch({ cbValidations: field.cbValidations.map(r => r.id === id ? { ...r, ...patch } : r) });

  const hasValidationActive = () => {
    if (isParagraph(field.type)) return field.paraValidations.length > 0 || field.showValidation;
    if (hasCbVal(field.type)) return field.cbValidations.length > 0;
    return field.showValidation;
  };

  return (
    <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl">

      {/* Title + Type */}
      <div className="flex items-start gap-3 px-4 pt-5 pb-4">
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0 mt-7 cursor-grab" />
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label className={smLabelCls}>Title</label>
            <input type="text" value={field.title} onChange={e => ch({ title: e.target.value })} placeholder="Field title" className={inputCls} />
          </div>
          <div>
            <label className={smLabelCls}>Type</label>
            <Dropdown options={FIELD_TYPES} value={field.type} placeholder="Select type" onChange={v => ch({ type: v })} />
          </div>
        </div>
      </div>

      {/* ── Text Field ── */}
      {isTextField(field.type) && (
        <div className="px-4 pb-4 pl-11 flex flex-col gap-3">
          <input
            disabled
            placeholder="Short Answer text"
            className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none cursor-default"
          />
          {field.showValidation && (
            <div>
              <label className={smLabelCls}>Validation Message</label>
              <input type="text" value={field.validationMessage} onChange={e => ch({ validationMessage: e.target.value })}
                placeholder="e.g. Must be 12-19 characters long" className={inputCls} />
            </div>
          )}
        </div>
      )}

      {/* ── Text Area ── */}
      {isTextArea(field.type) && (
        <div className="px-4 pb-4 pl-11 flex flex-col gap-3">
          <textarea
            disabled
            rows={3}
            placeholder="Long Answer text"
            className="w-full border border-gray-200 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none cursor-default"
          />
          {field.cbValidations.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                <span className={smLabelCls}>Validation Type</span>
                <span className={smLabelCls}>Number</span>
                <span className={smLabelCls}>Custom Error Text</span>
              </div>
              {field.cbValidations.map(row => (
                <div key={row.id} className="grid grid-cols-3 gap-2 items-start">
                  <Dropdown options={TEXTAREA_VAL_TYPES} value={row.type} placeholder="Select type" onChange={v => updateCbVal(row.id, { type: v })} />
                  <input type="number" value={row.number} onChange={e => updateCbVal(row.id, { number: e.target.value })} placeholder="2" className={inputCls} />
                  <input type="text" value={row.customError} onChange={e => updateCbVal(row.id, { customError: e.target.value })} placeholder="Enter custom error text" className={inputCls} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Radio / Checkboxes / Dropdowns (options) ── */}
      {hasOptions(field.type) && (
        <div className="px-4 pb-4 pl-11">
          <p className="text-[13px] font-semibold text-gray-700 mb-2">Options</p>
          <div className="flex flex-col gap-1.5">
            {field.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Per-option drag handle (Radio only) */}
                {isRadio(field.type) && <GripVertical className="w-3.5 h-3.5 text-gray-300 shrink-0 cursor-grab" />}
                {/* Icon */}
                {isRadio(field.type) && <span className="w-4 h-4 rounded-full border-2 border-gray-400 shrink-0" />}
                {(isCheckboxes(field.type) || isMultiDropdown(field.type)) && <span className="w-4 h-4 border-2 border-gray-400 rounded-sm shrink-0" />}
                {isSingleDropdown(field.type) && <span className="text-[13px] text-gray-500 shrink-0">{idx + 1}.</span>}
                {/* Option text — underline input */}
                <input
                  type="text" value={opt.text} onChange={e => updateOption(idx, e.target.value)}
                  className="flex-1 bg-transparent border-0 border-b border-gray-200 focus:border-primary focus:outline-none text-[13px] text-gray-700 px-0 py-0.5"
                />
                {/* Go to next field dropdown (Radio, when enabled) */}
                {isRadio(field.type) && field.showGoToField && (
                  <Dropdown
                    options={GOTO_FIELD_OPTIONS}
                    value={opt.goTo}
                    placeholder="Go to next field"
                    onChange={v => updateOptionGoTo(idx, v)}
                    className="w-52"
                  />
                )}
                {/* Delete button */}
                {field.options.length > 1 && (
                  <button onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {/* Add option */}
            <div className="flex items-center gap-2">
              {isRadio(field.type) && <span className="w-3.5 shrink-0" />}
              {isRadio(field.type) && <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />}
              {(isCheckboxes(field.type) || isMultiDropdown(field.type)) && <span className="w-4 h-4 border-2 border-gray-300 rounded-sm shrink-0" />}
              {isSingleDropdown(field.type) && <span className="text-[13px] text-gray-400 shrink-0">{field.options.length + 1}.</span>}
              <button onClick={addOption} className="text-primary hover:underline text-[13px]">Add option</button>
            </div>
          </div>

          {/* Checkbox / Multi-select validation rows */}
          {(isCheckboxes(field.type) || isMultiDropdown(field.type)) && field.cbValidations.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                <span className={smLabelCls}>Validation Type</span>
                <span className={smLabelCls}>Number</span>
                <span className={smLabelCls}>Custom Error Text</span>
              </div>
              {field.cbValidations.map(row => (
                <div key={row.id} className="grid grid-cols-3 gap-2">
                  <Dropdown options={CHECKBOX_VAL_TYPES} value={row.type} placeholder="Select type" onChange={v => updateCbVal(row.id, { type: v })} />
                  <input type="number" value={row.number} onChange={e => updateCbVal(row.id, { number: e.target.value })} placeholder="2" className={inputCls} />
                  <input type="text" value={row.customError} onChange={e => updateCbVal(row.id, { customError: e.target.value })} placeholder="Enter custom error text" className={inputCls} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Paragraph ── */}
      {isParagraph(field.type) && (
        <div className="px-4 pb-4 pl-11 flex flex-col gap-3">
          <textarea disabled rows={3} placeholder="Long Answer text" className="w-full border border-gray-200 rounded-md bg-gray-50 px-3 py-2 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none cursor-default" />
          {field.paraValidations.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                <span className={smLabelCls}>Validation Type</span>
                <span className={smLabelCls}>Min Value</span>
                <span className={smLabelCls}>Max Value</span>
              </div>
              {field.paraValidations.map(row => (
                <div key={row.id} className="grid grid-cols-3 gap-2 items-center">
                  <Dropdown options={PARAGRAPH_VAL_TYPES} value={row.type} placeholder="Select type" onChange={v => updateParaVal(row.id, { type: v })} />
                  <input type="number" value={row.minValue} onChange={e => updateParaVal(row.id, { minValue: e.target.value })} placeholder="Min" className={inputCls} />
                  <input type="number" value={row.maxValue} onChange={e => updateParaVal(row.id, { maxValue: e.target.value })} placeholder="Max" className={inputCls} />
                </div>
              ))}
            </div>
          )}
          {field.showValidation && (
            <div>
              <label className={smLabelCls}>Validation Message</label>
              <input type="text" value={field.validationMessage} onChange={e => ch({ validationMessage: e.target.value })}
                placeholder="Paragraph" className={inputCls} />
            </div>
          )}
        </div>
      )}

      {/* ── File Upload ── */}
      {isFileUpload(field.type) && (
        <div className="px-4 pb-4 pl-11 flex flex-col gap-3">
          <p className="text-[13px] text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200 cursor-default">File will be uploaded to Organiser's Drive.</p>
          {field.showValidation && (
            <div>
              <label className={smLabelCls}>Validation Message</label>
              <input type="text" value={field.validationMessage} onChange={e => ch({ validationMessage: e.target.value })}
                placeholder="Paragraph" className={inputCls} />
            </div>
          )}
        </div>
      )}

      {/* ── Look Up ── */}
      {isLookUp(field.type) && (
        <div className="px-4 pb-4 pl-11 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={smLabelCls}>Name</label>
              <input type="text" value={field.lookupName} onChange={e => ch({ lookupName: e.target.value })} placeholder="Enter name" className={inputCls} />
            </div>
            <div>
              <label className={smLabelCls}>URL Template</label>
              <input type="text" value={field.lookupUrlTemplate} onChange={e => ch({ lookupUrlTemplate: e.target.value })} placeholder="Enter URL template" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={smLabelCls}>Result Path</label>
              <input type="text" value={field.lookupResultPath} onChange={e => ch({ lookupResultPath: e.target.value })} placeholder="Enter result path" className={inputCls} />
            </div>
            <div>
              <label className={smLabelCls}>Label Path</label>
              <input type="text" value={field.lookupLabelPath} onChange={e => ch({ lookupLabelPath: e.target.value })} placeholder="Enter label path" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={smLabelCls}>Value Path</label>
            <input type="text" value={field.lookupValuePath} onChange={e => ch({ lookupValuePath: e.target.value })} placeholder="Enter value path" className={inputCls} />
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="border-t border-gray-200 px-4 py-2.5 pl-11 flex items-center justify-between">
        {showAssociation ? (
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-[13px] text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={field.fieldAssociation}
                onChange={e => ch({ fieldAssociation: e.target.checked })}
                className="w-3.5 h-3.5 accent-primary" />
              Field association
            </label>
            {field.fieldAssociation && (
              <Dropdown
                options={ASSOCIATED_FIELD_OPTIONS}
                value={field.associatedField}
                placeholder="Select associated field"
                onChange={v => ch({ associatedField: v })}
                className="w-48"
              />
            )}
          </div>
        ) : <span />}

        <div className="flex items-center gap-1">
          <button onClick={() => onDupe(field.id)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"><Copy className="w-4 h-4" /></button>
          <button onClick={() => onRemove(field.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
          <div className="flex items-center gap-1.5 px-2">
            <Toggle checked={field.required} onChange={() => ch({ required: !field.required })} />
            <span className="text-[13px] text-gray-600">Required</span>
          </div>
          {(isRadio(field.type) || (isSingleDropdown(field.type) && onAddSection)) && (
            <div ref={moreRef} className="relative">
              <button onClick={() => setMoreOpen(p => !p)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden whitespace-nowrap">
                  {isRadio(field.type) && (
                    <button
                      onClick={() => { ch({ showGoToField: !field.showGoToField }); setMoreOpen(false); }}
                      className="w-full px-4 py-2.5 text-[13px] text-left text-gray-700 hover:bg-gray-50">
                      {field.showGoToField ? "Hide field navigation" : "Go to field based on answer"}
                    </button>
                  )}
                  {isSingleDropdown(field.type) && onAddSection && (
                    <button onClick={() => { onAddSection(field.id); setMoreOpen(false); }}
                      className="w-full px-4 py-2.5 text-[13px] text-left text-gray-700 hover:bg-gray-50">
                      Go to section based on answer
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Validation actions */}
      <div className="px-4 pb-3 pl-11 flex justify-end">
        {hasValidationActive() ? (
          <button
            onClick={() => ch({ showValidation: false, paraValidations: [], cbValidations: [], validationMessage: "" })}
            className="text-[12px] text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
          >
            <X className="w-3.5 h-3.5" /> Remove validation
          </button>
        ) : (
          <button
            onClick={() => {
              if (isParagraph(field.type)) { addParaValidation(); ch({ showValidation: true }); }
              else if (hasCbVal(field.type)) addCbValidation();
              else ch({ showValidation: true });
            }}
            className="text-[12px] text-primary hover:underline font-medium"
          >
            + Add validation
          </button>
        )}
      </div>
    </div>
  );
};

// ── section card ───────────────────────────────────────────────────────────

interface SectionCardProps {
  section:       SectionItem;
  onTitleChange: (id: string, title: string) => void;
  onToggle:      (id: string) => void;
  onRemove:      (id: string) => void;
  onFieldChange: (sectionId: string, fieldId: string, patch: Partial<FieldItem>) => void;
  onFieldDupe:   (sectionId: string, fieldId: string) => void;
  onFieldRemove: (sectionId: string, fieldId: string) => void;
  onFieldAdd:    (sectionId: string) => void;
}

const SectionCard = ({ section, onTitleChange, onToggle, onRemove, onFieldChange, onFieldDupe, onFieldRemove, onFieldAdd }: SectionCardProps) => {
  const [editing, setEditing]     = useState(false);
  const [draft,   setDraft]       = useState(section.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const confirmTitle = () => { onTitleChange(section.id, draft); setEditing(false); };
  const cancelEdit   = () => { setDraft(section.title); setEditing(false); };

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") confirmTitle(); if (e.key === "Escape") cancelEdit(); }}
                className="text-[15px] font-semibold text-gray-900 border-b border-primary focus:outline-none bg-transparent" />
              <button onClick={confirmTitle} className="p-1 text-green-600 hover:text-green-700 rounded transition-colors"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={cancelEdit}   className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"><X className="w-3.5 h-3.5" /></button>
            </>
          ) : (
            <>
              <span className="text-[15px] font-semibold text-gray-900">{section.title}</span>
              <button onClick={() => { setDraft(section.title); setEditing(true); }} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onRemove(section.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
          <button onClick={() => onToggle(section.id)}  className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors">
            {section.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!section.collapsed && (
        <div className="px-5 pb-5 flex flex-col gap-3">
          {section.fields.map(f => (
            <FieldCard key={f.id} field={f} showAssociation
              onChange={(fid, patch) => onFieldChange(section.id, fid, patch)}
              onDupe={fid => onFieldDupe(section.id, fid)}
              onRemove={fid => onFieldRemove(section.id, fid)}
            />
          ))}
          <button onClick={() => onFieldAdd(section.id)}
            className="w-fit px-4 py-2 border border-gray-300 rounded-md text-[13px] font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Add
          </button>
        </div>
      )}
    </div>
  );
};

// ── main view ──────────────────────────────────────────────────────────────

export const CreateFormBuilderView = ({ formType }: { formType: FormBuilderTab }) => {
  const navigate = useNavigate();
  const isApp = formType === "application";

  const [basicOpen,   setBasicOpen]   = useState(true);
  const [formName,    setFormName]    = useState("");
  const [items,       setItems]       = useState<FormItem[]>([]);
  const [addOpen,     setAddOpen]     = useState(false);
  const addRef = useRef<HTMLDivElement>(null);

  const [description, setDescription] = useState("");
  const [module,      setModule]      = useState("");
  const [entityType,  setEntityType]  = useState("");
  const [version,     setVersion]     = useState("1");
  const [stage,       setStage]       = useState("");
  const [enabled,     setEnabled]     = useState(true);

  useEffect(() => {
    if (!addOpen) return;
    const h = (e: MouseEvent) => { if (!addRef.current?.contains(e.target as Node)) setAddOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [addOpen]);

  const isValid = isApp ? !!formName && !!entityType && !!stage : !!formName && !!module;
  const handleSave = () => { if (!isValid) return; navigate("/tenant-admin/form-builder"); };

  const handleAdd = (type: string) => { setAddOpen(false); setItems(prev => [...prev, type === "Section" ? makeSection() : makeField()]); };

  const handleFieldChange = useCallback((id: string, patch: Partial<FieldItem>) =>
    setItems(prev => prev.map(it => it.kind === "field" && it.id === id ? { ...it, ...patch } : it)), []);

  const handleFieldDupe = useCallback((id: string) =>
    setItems(prev => { const i = prev.findIndex(it => it.id === id); if (i === -1) return prev; const copy = { ...prev[i] as FieldItem, id: uid() }; return [...prev.slice(0, i + 1), copy, ...prev.slice(i + 1)]; }), []);

  const handleFieldRemove = useCallback((id: string) => setItems(prev => prev.filter(it => it.id !== id)), []);

  const handleAddSection = useCallback((afterId: string) =>
    setItems(prev => { const i = prev.findIndex(it => it.id === afterId); const s = makeSection(); return i === -1 ? [...prev, s] : [...prev.slice(0, i + 1), s, ...prev.slice(i + 1)]; }), []);

  const handleSectionTitleChange = useCallback((id: string, title: string) =>
    setItems(prev => prev.map(it => it.kind === "section" && it.id === id ? { ...it, title } : it)), []);

  const handleSectionToggle = useCallback((id: string) =>
    setItems(prev => prev.map(it => it.kind === "section" && it.id === id ? { ...it, collapsed: !it.collapsed } : it)), []);

  const handleSectionRemove = useCallback((id: string) => setItems(prev => prev.filter(it => it.id !== id)), []);

  const handleSectionFieldChange = useCallback((sid: string, fid: string, patch: Partial<FieldItem>) =>
    setItems(prev => prev.map(it => it.kind === "section" && it.id === sid ? { ...it, fields: it.fields.map(f => f.id === fid ? { ...f, ...patch } : f) } : it)), []);

  const handleSectionFieldDupe = useCallback((sid: string, fid: string) =>
    setItems(prev => prev.map(it => { if (it.kind !== "section" || it.id !== sid) return it; const i = it.fields.findIndex(f => f.id === fid); if (i === -1) return it; const copy = { ...it.fields[i], id: uid() }; return { ...it, fields: [...it.fields.slice(0, i + 1), copy, ...it.fields.slice(i + 1)] }; })), []);

  const handleSectionFieldRemove = useCallback((sid: string, fid: string) =>
    setItems(prev => prev.map(it => it.kind === "section" && it.id === sid ? { ...it, fields: it.fields.filter(f => f.id !== fid) } : it)), []);

  const handleSectionFieldAdd = useCallback((sid: string) =>
    setItems(prev => prev.map(it => it.kind === "section" && it.id === sid ? { ...it, fields: [...it.fields, makeField()] } : it)), []);

  const title = isApp ? "Create Application Form" : "Create Admin Form";

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-64px)]">
      {/* Top bar */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => navigate("/tenant-admin/form-builder")} className="text-gray-500 hover:text-gray-800 p-0.5 -ml-0.5 transition-colors">
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>
            <h1 className="text-[26px] font-semibold text-[#111827] tracking-tight">{title}</h1>
          </div>
          <p className="text-[13px] text-gray-500 ml-7">Provide review about the proposed concept. All fields marked with * are required.</p>
        </div>
        <Button onClick={handleSave} disabled={!isValid} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 text-[14px] font-medium disabled:opacity-50">Save</Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-5 pb-24">
        {/* Basic Details */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <button onClick={() => setBasicOpen(p => !p)} className="w-full flex items-center justify-between px-6 py-4 text-left">
            <span className="text-[15px] font-semibold text-gray-900">Basic Details</span>
            {basicOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {basicOpen && (
            <>
              <div className="border-t border-gray-100" />
              <div className="px-6 py-6 flex flex-col gap-5">
                {isApp ? (
                  <>
                    <div><label className={labelCls}>Entity Type<span className="text-red-500 ml-0.5">*</span></label><Dropdown options={ENTITY_TYPE_OPTIONS} value={entityType} placeholder="Select entity type" onChange={setEntityType} /></div>
                    <div><label className={labelCls}>Form Name<span className="text-red-500 ml-0.5">*</span></label><input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Concept Submission" className={inputCls} /></div>
                    <div><label className={labelCls}>Version<span className="text-red-500 ml-0.5">*</span></label><input type="number" min={1} value={version} onChange={e => setVersion(e.target.value)} placeholder="1" className={inputCls} /></div>
                    <div><label className={labelCls}>Stage<span className="text-red-500 ml-0.5">*</span></label><Dropdown options={STAGE_OPTIONS} value={stage} placeholder="Select stage" onChange={setStage} /></div>
                    <div className="flex items-center gap-2.5"><Toggle checked={enabled} onChange={() => setEnabled(p => !p)} /><span className="text-[14px] text-gray-700">Enable form</span></div>
                  </>
                ) : (
                  <>
                    <div><label className={labelCls}>Form Name<span className="text-red-500 ml-0.5">*</span></label><input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Concept Submission" className={inputCls} /></div>
                    <div><label className={labelCls}>Description</label><textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter description" className={textareaCls} /></div>
                    <div><label className={labelCls}>Module<span className="text-red-500 ml-0.5">*</span></label><Dropdown options={MODULE_OPTIONS} value={module} placeholder="Select module" onChange={setModule} /></div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-[15px] font-semibold text-gray-900">Form Fields</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {items.map(item =>
            item.kind === "field" ? (
              <FieldCard key={item.id} field={item}
                onChange={handleFieldChange} onDupe={handleFieldDupe} onRemove={handleFieldRemove} onAddSection={handleAddSection} />
            ) : (
              <SectionCard key={item.id} section={item}
                onTitleChange={handleSectionTitleChange} onToggle={handleSectionToggle} onRemove={handleSectionRemove}
                onFieldChange={handleSectionFieldChange} onFieldDupe={handleSectionFieldDupe}
                onFieldRemove={handleSectionFieldRemove} onFieldAdd={handleSectionFieldAdd} />
            )
          )}

          {/* Add dropdown */}
          <div ref={addRef} className="relative w-fit">
            <button onClick={() => setAddOpen(p => !p)}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-md text-[13px] font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Add <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {addOpen && (
              <div className="absolute left-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {ADD_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => handleAdd(opt)} className="w-full px-4 py-2.5 text-[13px] text-left text-gray-700 hover:bg-gray-50">{opt}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 right-0 left-[260px] bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-end gap-3 z-30">
        <Button variant="outline" onClick={() => navigate("/tenant-admin/form-builder")} className="px-6 py-2.5 text-[14px] border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
        <Button onClick={handleSave} disabled={!isValid} className="px-6 py-2.5 text-[14px] bg-primary hover:bg-primary/90 text-white disabled:opacity-50">Save</Button>
      </div>
    </div>
  );
};
