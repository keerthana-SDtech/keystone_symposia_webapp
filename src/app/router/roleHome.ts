import type { UserRole } from '../../features/auth/types';

/** Default redirect path for each role after login or when denied access. */
export const ROLE_HOME: Record<UserRole, string> = {
    external_scientist: '/home',
    keystone_member: '/dashboard',
};
