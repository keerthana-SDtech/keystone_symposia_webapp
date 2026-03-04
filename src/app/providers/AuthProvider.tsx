import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../../features/auth/types';
import { authApi } from '../../features/auth/api';
import { tokenStore } from '../../lib/tokenStore';
import { setAuthFailureHandler } from '../../lib/httpClient';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // When httpClient's 401 refresh fails, clear the session
        setAuthFailureHandler(() => {
            setUser(null);
            tokenStore.clear();
            localStorage.removeItem('refreshToken');
        });

        const initAuth = async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    // authApi.refresh already syncs tokenStore and localStorage internally
                    const { user: refreshedUser } = await authApi.refresh(refreshToken);
                    setUser(refreshedUser);
                } catch {
                    localStorage.removeItem('refreshToken');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback((userData: User, accessToken: string, refreshToken: string) => {
        setUser(userData);
        tokenStore.set(accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }, []);

    const logout = useCallback(async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try { await authApi.logout(refreshToken); } catch { /* best-effort */ }
        }
        setUser(null);
        tokenStore.clear();
        localStorage.removeItem('refreshToken');
    }, []);

    // Do NOT block the tree here — ProtectedRoute and GuestRoute handle
    // per-route loading states so public pages (login, signup) render immediately.
    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
