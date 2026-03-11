import { useState } from "react";
import { UsersTable } from "./UsersTable";
import { CreateUserDrawer } from "./CreateUserDrawer";
import { EditUserDrawer } from "./EditUserDrawer";
import { BulkUploadDrawer } from "./BulkUploadDrawer";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Toast } from "@/components/ui/toast";
import { MOCK_TENANT_USERS, type TenantUser } from "./usersData";

export const UsersView = () => {
  const [users,          setUsers]          = useState<TenantUser[]>(MOCK_TENANT_USERS);
  const [search,         setSearch]         = useState("");
  const [drawerOpen,     setDrawerOpen]     = useState(false);
  const [editUser,       setEditUser]       = useState<TenantUser | null>(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [deleteId,       setDeleteId]       = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  const filtered = search.trim()
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()))
    : users;

  const handleToggle = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, enabled: !u.enabled } : u));

  return (
    <>
      <UsersTable
        users={filtered} totalCount={users.length} search={search} onSearchChange={setSearch}
        onToggle={handleToggle}
        onEdit={id => setEditUser(users.find(u => u.id === id) ?? null)}
        onSendInvite={_id => showToast("Invite sent successfully")}
        onDelete={id => setDeleteId(id)}
        onBulkUpload={() => setBulkUploadOpen(true)}
        onCreate={() => setDrawerOpen(true)}
      />

      <EditUserDrawer user={editUser} onClose={() => setEditUser(null)} onSave={updated => { setUsers(prev => prev.map(u => u.id === updated.id ? updated : u)); showToast("User updated successfully"); }} />

      <BulkUploadDrawer isOpen={bulkUploadOpen} onClose={() => setBulkUploadOpen(false)} onUpload={_file => showToast("File uploaded successfully")} />

      <CreateUserDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onCreate={user => { const nextId = String(users.length + 1).padStart(2, "0"); setUsers(prev => [...prev, { id: nextId, ...user }]); showToast("User created successfully"); }} />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => { setUsers(prev => prev.filter(u => u.id !== deleteId)); setDeleteId(null); showToast("User deleted successfully"); }}
      />

      <Toast message={toast.message} variant="success" visible={toast.visible} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
    </>
  );
};
