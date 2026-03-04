import { authClient } from '../../../lib/httpClient';
import { tokenStore } from '../../../lib/tokenStore';
import { mapBackendRole } from '../types';
import type { AuthResponse, User } from '../types';
import type { LoginFormValues, SignupFormValues } from '../schemas';

// Shape returned by the auth service (gateway /auth/*)
interface TokenPair {
    accessToken: string;
    refreshToken: string;
    identityId: string;
}

// Shape returned by GET /keystone/users/me (keystone-backend)
interface UserProfile {
    identityId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    institution?: string;
}

/** Decode a JWT payload without verifying the signature (client-side only). */
function decodeJwt(token: string): { sub: string; email: string; role: string } {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}

/**
 * Fetch the current user's profile from keystone-backend.
 * Falls back gracefully if the profile isn't created yet (webhook delay).
 */
async function fetchProfile(accessToken: string): Promise<UserProfile | null> {
    try {
        const { data } = await authClient.get<UserProfile>('/keystone/users/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return data;
    } catch {
        return null;
    }
}

/** Build the frontend AuthResponse from a raw TokenPair. */
async function buildAuthResponse(tokens: TokenPair): Promise<AuthResponse> {
    const jwt = decodeJwt(tokens.accessToken);
    const profile = await fetchProfile(tokens.accessToken);

    const name =
        [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || jwt.email;

    const user: User = {
        id: tokens.identityId,
        email: jwt.email,
        name,
        role: mapBackendRole(jwt.role),
    };

    return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
}

export const authApi = {
    login: async (values: LoginFormValues): Promise<AuthResponse> => {
        const { data } = await authClient.post<TokenPair>('/auth/login', {
            email: values.email,
            password: values.password,
        });
        return buildAuthResponse(data);
    },

    signup: async (values: SignupFormValues): Promise<AuthResponse> => {
        // Split "Full Name" into firstName / lastName for the keystone-backend profile webhook
        const parts = values.name.trim().split(/\s+/);
        const firstName = parts[0];
        const lastName = parts.length > 1 ? parts.slice(1).join(' ') : undefined;

        const { data } = await authClient.post<TokenPair>('/auth/register', {
            email: values.email,
            password: values.password,
            firstName,
            lastName,
        });

        // Small delay to let the registration webhook create the user profile
        await new Promise((resolve) => setTimeout(resolve, 400));

        return buildAuthResponse(data);
    },

    refresh: async (refreshToken: string): Promise<AuthResponse> => {
        const { data } = await authClient.post<TokenPair>('/auth/refresh', { refreshToken });
        // Sync the in-memory token store so subsequent calls work
        tokenStore.set(data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return buildAuthResponse(data);
    },

    logout: async (refreshToken: string): Promise<void> => {
        await authClient.post('/auth/logout', { refreshToken }).catch(() => {/* ignore */});
    },

    /** Restore user state from an existing valid access token — no refresh call. */
    hydrateUser: async (accessToken: string): Promise<User> => {
        const jwt = decodeJwt(accessToken);
        const profile = await fetchProfile(accessToken);
        const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || jwt.email;
        return { id: jwt.sub, email: jwt.email, name, role: mapBackendRole(jwt.role) };
    },
};
