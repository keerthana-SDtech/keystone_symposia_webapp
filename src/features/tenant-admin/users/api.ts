import { httpClient } from '@/lib/httpClient';
import type { TenantUser } from './usersData';

interface ApiUser {
  identityId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  isActive: boolean;
  createdAt: string;
  roles?: { id: string; roleName: string }[];
}

export interface ApiRole {
  id: string;
  roleName: string;
  isActive: boolean;
}

function toUser(u: ApiUser): TenantUser {
  return {
    id: u.identityId,
    email: u.email,
    name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
    role: u.roles?.map(r => r.roleName).join(', ') ?? '',
    createdDate: new Date(u.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    enabled: u.isActive,
  };
}

export const usersApi = {
  list: () =>
    httpClient.get<ApiUser[]>('/iam/users').then(r => r.data.map(toUser)),

  update: (id: string, data: { firstName?: string; lastName?: string; isActive?: boolean }) =>
    httpClient.patch<ApiUser>(`/iam/users/${id}`, data).then(r => toUser(r.data)),

  toggle: (id: string, isActive: boolean) =>
    httpClient.patch<ApiUser>(`/iam/users/${id}`, { isActive }).then(r => toUser(r.data)),

  invite: (email: string, roleId: string) =>
    httpClient.post('/iam/invitations', { email, roleId }),

  listRoles: () =>
    httpClient.get<ApiRole[]>('/iam/roles').then(r => r.data),
};
