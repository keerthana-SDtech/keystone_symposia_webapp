import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { FormField } from "@/components/ui/form-field";
import { type TenantUser } from "./usersData";

export interface EditUserFormData {
  firstName: string;
  isActive: boolean;
}

interface EditUserDrawerProps {
  user:    TenantUser | null;
  onClose: () => void;
  onSave:  (id: string, data: EditUserFormData) => void;
}

interface FormState {
  name: string;
  enabled: boolean;
}

const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50";
const readOnlyCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] text-gray-500 bg-gray-100 cursor-not-allowed";

export const EditUserDrawer = ({ user, onClose, onSave }: EditUserDrawerProps) => {
  const isOpen = user !== null;
  const [form, setForm] = useState<FormState>({ name: "", enabled: false });
  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => setForm(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    if (user) setForm({ name: user.name, enabled: user.enabled });
  }, [user]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const canSave = form.name.trim().length > 0;

  const handleSave = () => {
    if (!user || !canSave) return;
    onSave(user.id, { firstName: form.name.trim(), isActive: form.enabled });
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-[480px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-7 pt-7 pb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-bold text-gray-900">Edit User</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"><X className="w-5 h-5" /></button>
          </div>
          <div className="h-px bg-gray-200" />
        </div>

        <div className="flex-1 overflow-y-auto px-7 pb-6 flex flex-col gap-6">
          <FormField label="User Name" required>
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Enter user name" className={inputCls} />
          </FormField>
          <FormField label="Email Address">
            <input type="email" value={user.email} readOnly className={readOnlyCls} />
          </FormField>
          {user.role && (
            <FormField label="Role">
              <input type="text" value={user.role} readOnly className={readOnlyCls} />
            </FormField>
          )}
          <div className="flex items-center gap-3">
            <Toggle checked={form.enabled} onChange={() => set("enabled", !form.enabled)} />
            <span className="text-[14px] text-gray-700">Enable user</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="px-6 text-[14px] border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
          <Button onClick={handleSave} disabled={!canSave} className="bg-primary hover:bg-primary/90 text-white px-6 text-[14px] disabled:opacity-50">Save</Button>
        </div>
      </div>
    </>
  );
};
