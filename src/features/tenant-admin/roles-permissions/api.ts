import { httpClient } from '@/lib/httpClient';
import type { Role, PermissionGroup } from './rolesData';

interface ApiRole {
  id: string;
  roleName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  permissionKeys: string[];
  createdAt: string;
}

interface ApiPermission {
  id: string;
  permissionKey: string;
  resourceId: string;
  actionId: string;
  resourceName?: string | null;
  actionName?: string | null;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toPermissionGroups(permissions: ApiPermission[]): PermissionGroup[] {
  const groups = new Map<string, PermissionGroup>();
  for (const p of permissions) {
    const key   = p.resourceName ?? p.resourceId;
    const label = p.resourceName ? cap(p.resourceName) : p.resourceId;
    if (!groups.has(key)) groups.set(key, { key, label, permissions: [] });
    const permLabel = [p.actionName, p.resourceName].filter(Boolean).map(cap).join(' ') || p.permissionKey;
    groups.get(key)!.permissions.push({ id: p.permissionKey, label: permLabel });
  }
  return Array.from(groups.values());
}

function toRole(r: ApiRole): Role {
  return {
    id: r.id,
    name: r.roleName,
    description: r.description ?? '',
    permissionIds: r.permissionKeys ?? [],
    enabled: r.isActive,
  };
}

const BASE = '/iam/roles';

export const rolesApi = {
  list: () =>
    httpClient.get<ApiRole[]>(BASE).then(r => r.data.map(toRole)),

  create: (data: Omit<Role, 'id'>) =>
    httpClient.post<ApiRole>(BASE, {
      roleName: data.name,
      description: data.description,
      isActive: data.enabled,
      permissionKeys: data.permissionIds,
    }).then(r => toRole(r.data)),

  update: (id: string, data: Partial<Omit<Role, 'id'>>) => {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.roleName = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.enabled !== undefined) payload.isActive = data.enabled;
    if (data.permissionIds !== undefined) payload.permissionKeys = data.permissionIds;
    return httpClient.patch<ApiRole>(`${BASE}/${id}`, payload).then(r => toRole(r.data));
  },

  toggle: (id: string, enabled: boolean) =>
    httpClient.patch<ApiRole>(`${BASE}/${id}`, { isActive: enabled }).then(r => toRole(r.data)),

  remove: (id: string) =>
    httpClient.delete(`${BASE}/${id}`),

  listPermissionGroups: () =>
    httpClient.get<ApiPermission[]>('/iam/permissions').then(r => toPermissionGroups(r.data)),

  listRoleNames: () =>
    httpClient.get<ApiRole[]>(BASE).then(r => r.data.map(a => a.roleName)),
};
