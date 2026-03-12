import { useState, useEffect } from "react";
import { UsersTable } from "./UsersTable";
import { CreateUserDrawer, type CreateUserFormData } from "./CreateUserDrawer";
import { EditUserDrawer, type EditUserFormData } from "./EditUserDrawer";
import { BulkUploadDrawer } from "./BulkUploadDrawer";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Toast } from "@/components/ui/toast";
import { type TenantUser } from "./usersData";
import { usersApi, type ApiRole } from "./api";

export const UsersView = () => {
  const [users,          setUsers]          = useState<TenantUser[]>([]);
  const [roles,          setRoles]          = useState<ApiRole[]>([]);
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

  useEffect(() => {
    Promise.all([usersApi.list(), usersApi.listRoles()])
      .then(([userList, roleList]) => {
        setUsers(userList);
        setRoles(roleList);
      })
      .catch(() => showToast("Failed to load users"));
  }, []);

  const filtered = search.trim()
    ? users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const handleToggle = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    try {
      const updated = await usersApi.toggle(id, !user.enabled);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
    } catch { showToast("Failed to update user"); }
  };

  const handleCreate = async (data: CreateUserFormData) => {
    try {
      await usersApi.invite(data.email, data.roleId);
      showToast("Invitation sent successfully");
      // Re-fetch list so any newly registered users appear
      const updated = await usersApi.list();
      setUsers(updated);
    } catch { showToast("Failed to send invitation"); }
  };

  const handleEdit = async (id: string, data: EditUserFormData) => {
    try {
      const updated = await usersApi.update(id, { firstName: data.firstName, isActive: data.isActive });
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
      showToast("User updated successfully");
    } catch { showToast("Failed to update user"); }
  };

  const handleSendInvite = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    try {
      const roleId = roles.find(r => r.roleName === user.role)?.id;
      if (!roleId) { showToast("Cannot send invite: no role assigned"); return; }
      await usersApi.invite(user.email, roleId);
      showToast("Invite sent successfully");
    } catch { showToast("Failed to send invite"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await usersApi.toggle(deleteId, false);
      setUsers(prev => prev.map(u => u.id === deleteId ? { ...u, enabled: false } : u));
      showToast("User deactivated successfully");
    } catch { showToast("Failed to deactivate user"); }
    setDeleteId(null);
  };

  return (
    <>
      <UsersTable
        users={filtered}
        totalCount={users.length}
        search={search}
        onSearchChange={setSearch}
        onToggle={handleToggle}
        onEdit={id => setEditUser(users.find(u => u.id === id) ?? null)}
        onSendInvite={handleSendInvite}
        onDelete={id => setDeleteId(id)}
        onBulkUpload={() => setBulkUploadOpen(true)}
        onCreate={() => setDrawerOpen(true)}
      />

      <EditUserDrawer
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={handleEdit}
      />

      <BulkUploadDrawer
        isOpen={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        onUpload={_file => showToast("File uploaded successfully")}
      />

      <CreateUserDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        roles={roles}
        onCreate={handleCreate}
      />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      <Toast
        message={toast.message}
        variant="success"
        visible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </>
  );
};
