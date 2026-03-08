import React, { useEffect } from 'react';
import { authApi } from '../../features/auth/api';
import { tokenStore } from '../../lib/tokenStore';
import { setAuthFailureHandler, REFRESH_TOKEN_KEY } from '../../lib/httpClient';
import { AuthContext } from './AuthContext';
import { useAuthStore } from '../../stores/auth.store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading, isAuthenticated, login, logout, setUser, setLoading } = useAuthStore();

    useEffect(() => {
        let cancelled = false;

        setAuthFailureHandler(() => { logout(); });

        const initAuth = async () => {
            const accessToken = tokenStore.get();
            if (accessToken && !tokenStore.isExpired(accessToken)) {
                try {
                    const restoredUser = await authApi.hydrateUser(accessToken);
                    if (!cancelled) { tokenStore.set(accessToken); setUser(restoredUser); }
                } catch {
                    if (!cancelled) tokenStore.clear();
                }
            } else {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
                if (refreshToken) {
                    try {
                        const { user: refreshedUser } = await authApi.refresh(refreshToken);
                        if (!cancelled) setUser(refreshedUser);
                    } catch {
                        if (!cancelled) {
                            tokenStore.clear();
                            localStorage.removeItem(REFRESH_TOKEN_KEY);
                        }
                    }
                }
            }
            if (!cancelled) setLoading(false);
        };

        initAuth();

        return () => { cancelled = true; };
    }, [logout, setUser, setLoading]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
