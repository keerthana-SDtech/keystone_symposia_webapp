export type UserRole = 'external_scientist' | 'keystone_member' | 'study_group_reviewer';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface AuthResponse {
    user: User;
    token: string;
}
