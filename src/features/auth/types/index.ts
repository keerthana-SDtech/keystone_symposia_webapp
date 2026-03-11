export type UserRole = 'external_scientist' | 'keystone_member' | 'study_group_reviewer' | 'tenant_admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

/** Map backend role string to a frontend UserRole. */
export function mapBackendRole(role: string): UserRole {
    if (role === 'submitter') return 'external_scientist';
    if (role === 'tenant_admin') return 'tenant_admin';
    if (role === 'study_group_reviewer') return 'study_group_reviewer';
    return 'keystone_member';
}
