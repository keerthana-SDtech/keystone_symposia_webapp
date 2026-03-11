import type { UserRole } from '../features/auth/types';

/** Default redirect path for each role after login or when denied access. */
export const ROLE_HOME: Record<UserRole, string> = {
  external_scientist: '/home',
  keystone_member: '/dashboard',
  study_group_reviewer: '/dashboard',
  tenant_admin: '/tenant-admin/users',
};

export interface NavItem {
  label: string;
  path: string;
  roles: UserRole[];
}

/** Top-level navigation items available per role. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', roles: ['keystone_member'] },
];
