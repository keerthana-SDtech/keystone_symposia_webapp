import { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CREATE_ROLE_CONTENT,
  PERMISSION_GROUPS,
  TOTAL_PERMISSIONS,
  type Role,
} from "./rolesData";

interface CreateRoleDrawerProps {
  isOpen:    boolean;
  onClose:   () => void;
  onSave:    (role: Omit<Role, "id">) => void;
  editData?: Role | null;
}

interface FormState {
  name:          string;
  description:   string;
  permissionIds: string[];
}

const EMPTY_FORM: FormState = { name: "", description: "", permissionIds: [] };

interface GroupSelectorProps {
  group:    typeof PERMISSION_GROUPS[number];
  selected: string[];
  onChange: (ids: string[]) => void;
}

const GroupSelector = ({ group, selected, onChange }: GroupSelectorProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const granted = group.permissions.filter(p => selected.includes(p.id));

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-gray-800">{group.label}</span>
        <span className="text-[12px] text-gray-400">Permissions ({granted.length})</span>
      </div>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md text-[13px] text-gray-500 bg-white hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <span>{granted.length === 0 ? "Select permissions" : granted.map(p => p.label).join(", ")}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
            {group.permissions.map(perm => (
              <label key={perm.id} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" checked={selected.includes(perm.id)} onChange={() => toggle(perm.id)} className="w-3.5 h-3.5 accent-primary rounded" />
                <span className="text-[13px] text-gray-700">{perm.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CreateRoleDrawer = ({ isOpen, onClose, onSave, editData }: CreateRoleDrawerProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(editData
        ? { name: editData.name, description: editData.description, permissionIds: editData.permissionIds }
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
    onSave({ name: form.name, description: form.description, permissionIds: form.permissionIds, enabled: editData?.enabled ?? true });
    onClose();
  };

  const { createTitle, editTitle, fields, cancel, create, save } = CREATE_ROLE_CONTENT;
  const isEdit = Boolean(editData);
  const grantedCount = form.permissionIds.length;

  if (!isOpen) return null;

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400";
  const labelCls = "text-[13px] font-medium text-gray-700 mb-1 block";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-[400px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-[17px] font-semibold text-gray-900">{isEdit ? editTitle : createTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <div>
            <label className={labelCls}>{fields.name.label}<span className="text-red-500 ml-0.5">*</span></label>
            <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder={fields.name.placeholder} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{fields.description.label}</label>
            <input type="text" value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder={fields.description.placeholder} className={inputCls} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-semibold text-gray-800">{CREATE_ROLE_CONTENT.permissionsLabel}</span>
              <span className="text-[12px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{grantedCount}/{TOTAL_PERMISSIONS} granted</span>
            </div>
            <div className="flex flex-col gap-5">
              {PERMISSION_GROUPS.map(group => (
                <GroupSelector key={group.key} group={group} selected={form.permissionIds} onChange={ids => setForm(prev => ({ ...prev, permissionIds: ids }))} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="px-5 py-2 text-[13px] border-gray-300 text-gray-700 hover:bg-gray-50">{cancel}</Button>
          <Button onClick={handleSave} disabled={!form.name} className="px-5 py-2 text-[13px] bg-primary hover:bg-primary/90 text-white disabled:opacity-50">{isEdit ? save : create}</Button>
        </div>
      </div>
    </>
  );
};
