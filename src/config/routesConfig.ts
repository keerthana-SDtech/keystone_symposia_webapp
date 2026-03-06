import type { UserRole } from '../features/auth/types';

export interface RoutePermission {
  path: string;
  allowedRoles?: UserRole[];
}

/** Route paths and their allowed roles. Undefined allowedRoles = any authenticated user. */
export const ROUTE_PERMISSIONS: RoutePermission[] = [
  { path: '/home',                                    allowedRoles: ['external_scientist'] },
  { path: '/submission',                              allowedRoles: ['external_scientist', 'keystone_member'] },
  { path: '/dashboard' },
  { path: '/dashboard/:id' },
  { path: '/dashboard/:id/edit' },
  { path: '/reviewer/dashboard',                      allowedRoles: ['keystone_member'] },
  { path: '/reviewer/review/:conceptId',              allowedRoles: ['keystone_member'] },
  { path: '/reviewer/review/:conceptId/submit',       allowedRoles: ['keystone_member'] },
  { path: '/reviewer/review/:conceptId/submitted',    allowedRoles: ['keystone_member'] },
];
