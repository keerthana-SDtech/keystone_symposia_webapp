export type UserRole = 'external_scientist' | 'keystone_member' | 'study_group_reviewer';

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
    return role === 'submitter' ? 'external_scientist' : 'keystone_member';
}
