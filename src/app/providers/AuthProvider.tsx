import React, { createContext, useState, useEffect } from 'react';
import type { User } from '../../features/auth/types';
import { authApi } from '../../features/auth/api';
import { tokenStore } from '../../lib/tokenStore';
import { setAuthFailureHandler } from '../../lib/apiFetch';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Register auth failure handler (called by apiFetch when refresh fails)
        setAuthFailureHandler(() => {
            setUser(null);
            tokenStore.clear();
            localStorage.removeItem('refreshToken');
        });

        const initAuth = async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const tokens = await authApi.refresh(refreshToken);
                    tokenStore.set(tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);
                    setUser(tokens.user);
                } catch {
                    localStorage.removeItem('refreshToken');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData: User, accessToken: string, refreshToken: string) => {
        setUser(userData);
        tokenStore.set(accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try { await authApi.logout(refreshToken); } catch { /* ignore */ }
        }
        setUser(null);
        tokenStore.clear();
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {!isLoading ? children : (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};
