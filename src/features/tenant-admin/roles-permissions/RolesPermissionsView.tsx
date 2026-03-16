import { useState, useEffect } from "react";
import { RolesTable } from "./RolesTable";
import { CreateRoleDrawer } from "./CreateRoleDrawer";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Toast } from "@/components/ui/toast";
import { type Role, type PermissionGroup } from "./rolesData";
import { rolesApi } from "./api";

export const RolesPermissionsView = () => {
  const [roles,            setRoles]            = useState<Role[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [search,           setSearch]           = useState("");
  const [drawerOpen,       setDrawerOpen]       = useState(false);
  const [editRole,         setEditRole]         = useState<Role | null>(null);
  const [deleteId,         setDeleteId]         = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  useEffect(() => {
    Promise.all([rolesApi.list(), rolesApi.listPermissionGroups()])
      .then(([roleList, groups]) => {
        setRoles(roleList);
        setPermissionGroups(groups);
      })
      .catch(() => showToast("Failed to load roles"));
  }, []);

  const filtered = search.trim()
    ? roles.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      )
    : roles;

  const handleCreate = async (data: Omit<Role, "id">) => {
    try {
      const created = await rolesApi.create(data);
      setRoles(prev => [...prev, created]);
      showToast("Role created successfully");
    } catch { showToast("Failed to create role"); }
  };

  const handleEdit = async (data: Omit<Role, "id">) => {
    if (!editRole) return;
    try {
      const updated = await rolesApi.update(editRole.id, data);
      setRoles(prev => prev.map(r => r.id === editRole.id ? updated : r));
      setEditRole(null);
      showToast("Role updated successfully");
    } catch { showToast("Failed to update role"); }
  };

  const handleToggle = async (id: string) => {
    const role = roles.find(r => r.id === id);
    if (!role) return;
    try {
      const updated = await rolesApi.toggle(id, !role.enabled);
      setRoles(prev => prev.map(r => r.id === id ? updated : r));
    } catch { showToast("Failed to toggle role"); }
  };

  const handleOpenEdit = (id: string) => {
    setEditRole(roles.find(r => r.id === id) ?? null);
    setDrawerOpen(true);
  };

  return (
    <div className="w-full">
      <RolesTable
        roles={filtered} totalCount={roles.length} search={search} onSearchChange={setSearch}
        onToggle={handleToggle} onEdit={handleOpenEdit} onDelete={id => setDeleteId(id)}
        onCreate={() => { setEditRole(null); setDrawerOpen(true); }}
      />

      <CreateRoleDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditRole(null); }}
        onSave={editRole ? handleEdit : handleCreate}
        editData={editRole}
        permissionGroups={permissionGroups}
      />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          try {
            await rolesApi.remove(deleteId!);
            setRoles(prev => prev.filter(r => r.id !== deleteId));
            showToast("Role deleted successfully");
          } catch { showToast("Failed to delete role"); }
          setDeleteId(null);
        }}
      />

      <Toast message={toast.message} variant="success" visible={toast.visible} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
    </div>
  );
};
