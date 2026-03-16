import { useState, useEffect } from "react";
import { Toggle } from "@/components/shared/Toggle";
import { SingleSelect } from "@/components/ui/single-select";
import { Button } from "@/components/ui/button";
import {
  EVENT_KEY_OPTIONS,
  EMPTY_TEMPLATE_FORM,
  type EmailTemplate,
  type EmailTemplateFormState,
} from "./emailTemplatesData";
import { type EntityType } from "./api";

interface EmailTemplatesFormProps {
  template:     EmailTemplate | null;
  isNew:        boolean;
  entityTypes:  EntityType[];
  onSave:       (data: Omit<EmailTemplate, "id">) => Promise<void>;
  onDelete?:    () => void;
  isSaving:     boolean;
}

export const EmailTemplatesForm = ({
  template, isNew, entityTypes, onSave, onDelete, isSaving,
}: EmailTemplatesFormProps) => {
  const [form, setForm] = useState<EmailTemplateFormState>(EMPTY_TEMPLATE_FORM);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isNew) {
      setForm(EMPTY_TEMPLATE_FORM);
    } else if (template) {
      setForm({
        entityTypeId: template.entityTypeId ?? "",
        eventKey:     template.eventKey,
        subject:      template.subject,
        bodyTemplate: template.bodyTemplate,
        isActive:     template.isActive,
      });
    }
  }, [template, isNew]);

  const entityTypeOptions = entityTypes.map(et => et.entityName);

  const handleSave = async () => {
    if (!form.eventKey || !form.subject || !form.bodyTemplate) return;
    const payload: Omit<EmailTemplate, "id"> = {
      entityTypeId: entityTypes.find(et => et.entityName === form.entityTypeId)?.id ?? null,
      eventKey:     form.eventKey,
      subject:      form.subject,
      bodyTemplate: form.bodyTemplate,
      isActive:     form.isActive,
    };
    await onSave(payload);
  };

  const canSave = !!form.eventKey && !!form.subject && !!form.bodyTemplate;

  const inputCls   = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 bg-white";
  const labelCls   = "text-[13px] font-medium text-gray-700 mb-1.5 block";
  const sectionCls = "bg-white rounded-[10px] border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-4";

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Form panel */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Basic Details */}
        <div className={sectionCls}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <span className="text-[14px] font-semibold text-gray-800">Basic Details</span>
          </div>
          <div className="px-5 py-4 flex flex-col gap-4">
            <div>
              <label className={labelCls}>Entity Type ID<span className="text-red-500 ml-0.5">*</span></label>
              <SingleSelect
                options={entityTypeOptions}
                value={form.entityTypeId}
                placeholder="Select entity type"
                onChange={v => setForm(p => ({ ...p, entityTypeId: v }))}
              />
            </div>
            <div>
              <label className={labelCls}>Event Key<span className="text-red-500 ml-0.5">*</span></label>
              <SingleSelect
                options={EVENT_KEY_OPTIONS}
                value={form.eventKey}
                placeholder="Select event key"
                onChange={v => setForm(p => ({ ...p, eventKey: v }))}
              />
            </div>
            <div className="flex items-center gap-2.5">
              <Toggle
                checked={form.isActive}
                onChange={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
              />
              <span className="text-[13px] text-gray-700">Enable email template</span>
            </div>
          </div>
        </div>

        {/* Template */}
        <div className={sectionCls}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <span className="text-[14px] font-semibold text-gray-800">Template</span>
            <button
              onClick={() => setShowPreview(p => !p)}
              className="text-[12px] text-primary hover:underline flex items-center gap-1"
            >
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
          </div>
          <div className="px-5 py-4 flex flex-col gap-4">
            <div>
              <label className={labelCls}>Subject Line<span className="text-red-500 ml-0.5">*</span></label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                placeholder='Your concept "{{concept_title}}" has been received'
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Body<span className="text-red-500 ml-0.5">*</span></label>
              <textarea
                rows={12}
                value={form.bodyTemplate}
                onChange={e => setForm(p => ({ ...p, bodyTemplate: e.target.value }))}
                placeholder={"Dear {{user_name}},\n\nThank you for submitting your concept..."}
                className={`${inputCls} resize-y`}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Use {"{{variable_name}}"} for dynamic content (e.g. {"{{user_name}}"}, {"{{concept_title}}"}).
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {onDelete && !isNew ? (
            <Button
              variant="outline"
              onClick={onDelete}
              className="text-[13px] border-red-200 text-red-600 hover:bg-red-50"
            >
              Delete
            </Button>
          ) : <div />}
          <Button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="px-6 py-2 text-[13px] bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {/* Preview panel */}
      {showPreview && (
        <div className="w-[340px] shrink-0 border-l border-gray-200 bg-gray-50 overflow-y-auto px-5 py-5">
          <p className="text-[13px] font-semibold text-gray-700 mb-3">Template</p>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-[12px] text-gray-700 leading-relaxed">
            <div className="mb-2">
              <span className="text-gray-400">From</span>{" "}
              <span className="text-gray-800">noreply@keystone.com</span>
            </div>
            <div className="mb-3">
              <span className="text-gray-400">Subject Line</span>{" "}
              <span className="text-gray-800">{form.subject || "—"}</span>
            </div>
            <hr className="border-gray-100 mb-3" />
            <pre className="whitespace-pre-wrap font-sans text-[12px] text-gray-700">
              {form.bodyTemplate || "—"}
            </pre>
          </div>
          <p className="text-[11px] text-gray-400 mt-3 text-center">Preview uses sample data.</p>
        </div>
      )}
    </div>
  );
};
