import { httpClient } from '@/lib/httpClient';
import type { Role } from './rolesData';

interface ApiRole {
  id: string;
  roleName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  permissionKeys: string[];
  createdAt: string;
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
};
