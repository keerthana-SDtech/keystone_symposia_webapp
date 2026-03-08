import { create } from 'zustand';
import type { User } from '../features/auth/types';
import { tokenStore } from '../lib/tokenStore';
import { REFRESH_TOKEN_KEY } from '../lib/httpClient';
import { authApi } from '../features/auth/api';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    login: (user, accessToken, refreshToken) => {
        tokenStore.set(accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
    },

    logout: async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
            await authApi.logout(refreshToken); // best-effort backend revocation
        }
        tokenStore.clear();
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    setLoading: (loading) => set({ isLoading: loading }),
}));
