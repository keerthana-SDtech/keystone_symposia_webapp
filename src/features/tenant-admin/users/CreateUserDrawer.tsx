import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ApiRole } from "./api";

export interface CreateUserFormData {
  name: string;
  email: string;
  roleId: string;
  enabled: boolean;
}

interface CreateUserDrawerProps {
  isOpen:   boolean;
  onClose:  () => void;
  roles:    ApiRole[];
  onCreate: (data: CreateUserFormData) => void;
}

interface FormState {
  name: string;
  email: string;
  roleId: string;
  enabled: boolean;
}

const EMPTY: FormState = { name: "", email: "", roleId: "", enabled: false };

const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50";

export const CreateUserDrawer = ({ isOpen, onClose, roles, onCreate }: CreateUserDrawerProps) => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => setForm(prev => ({ ...prev, [key]: val }));

  useEffect(() => { if (isOpen) setForm(EMPTY); }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const canCreate = form.email && form.roleId;

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate({ name: form.name, email: form.email, roleId: form.roleId, enabled: form.enabled });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-[480px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-7 pt-7 pb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-bold text-gray-900">Create User</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"><X className="w-5 h-5" /></button>
          </div>
          <div className="h-px bg-gray-200" />
        </div>

        <div className="flex-1 overflow-y-auto px-7 pb-6 flex flex-col gap-6">
          <FormField label="User Name">
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Enter user name" className={inputCls} />
          </FormField>
          <FormField label="Email Address" required>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="Enter email address" className={inputCls} />
          </FormField>
          <FormField label="Assign Role" required>
            <Select value={form.roleId} onValueChange={v => set("roleId", v)}>
              <SelectTrigger className="w-full h-[48px] border-gray-200 bg-gray-50 text-[14px] rounded-lg">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.roleName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <div className="flex items-center gap-3">
            <Toggle checked={form.enabled} onChange={() => set("enabled", !form.enabled)} />
            <span className="text-[14px] text-gray-700">Enable user</span>
          </div>
          <p className="text-[12px] text-gray-400">An invitation email will be sent to the user to set their password.</p>
        </div>

        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="px-6 text-[14px] border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
          <Button onClick={handleCreate} disabled={!canCreate} className="bg-primary hover:bg-primary/90 text-white px-6 text-[14px] disabled:opacity-50">Create</Button>
        </div>
      </div>
    </>
  );
};
