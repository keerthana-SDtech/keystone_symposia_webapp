import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type TenantUser } from "./usersData";

const ROLE_OPTIONS = [
  { value: "super-admin",    label: "Super Admin"    },
  { value: "admin",          label: "Admin"          },
  { value: "keystone-staff", label: "Keystone Staff" },
  { value: "study-group",    label: "Study Group"    },
  { value: "sab-member",     label: "SAB Member"     },
  { value: "organizer",      label: "Organizer"      },
];

const roleToValue = (label: string) => ROLE_OPTIONS.find(r => r.label === label)?.value ?? label.toLowerCase().replace(/\s+/g, "-");

interface EditUserDrawerProps {
  user:    TenantUser | null;
  onClose: () => void;
  onSave:  (updated: TenantUser) => void;
}

interface FormState {
  userName: string; email: string; password: string; confirmPassword: string;
  role: string; sendInvite: boolean; enabled: boolean;
}

const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50";

export const EditUserDrawer = ({ user, onClose, onSave }: EditUserDrawerProps) => {
  const isOpen = user !== null;
  const [form, setForm] = useState<FormState>({ userName: "", email: "", password: "", confirmPassword: "", role: "", sendInvite: false, enabled: false });
  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => setForm(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    if (user) setForm({ userName: user.name, email: "", password: "", confirmPassword: "", role: roleToValue(user.role), sendInvite: false, enabled: user.enabled });
  }, [user]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const canSave = form.userName && form.role;

  const handleSave = () => {
    if (!user || !canSave) return;
    onSave({ ...user, name: form.userName, role: ROLE_OPTIONS.find(r => r.value === form.role)?.label ?? form.role, enabled: form.enabled });
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
          <FormField label="User Name" required><input type="text" value={form.userName} onChange={e => set("userName", e.target.value)} placeholder="Enter user name" className={inputCls} /></FormField>
          <FormField label="Email Address" required><input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="Enter email address" className={inputCls} /></FormField>
          <FormField label="Password" required><input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Enter password" className={inputCls} /></FormField>
          <FormField label="Confirm Password" required><input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="Enter confirm password" className={inputCls} /></FormField>
          <FormField label="Assign Role" required>
            <Select value={form.role} onValueChange={v => set("role", v)}>
              <SelectTrigger className="w-full h-[48px] border-gray-200 bg-gray-50 text-[14px] rounded-lg"><SelectValue placeholder="Select Role" /></SelectTrigger>
              <SelectContent>{ROLE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.sendInvite} onChange={e => { const checked = e.target.checked; setForm(prev => ({ ...prev, sendInvite: checked, enabled: checked ? true : prev.enabled })); }} className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer" />
            <span className="text-[14px] text-gray-700">Send invite to user</span>
          </label>
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
