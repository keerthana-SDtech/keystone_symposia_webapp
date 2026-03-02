import React, { createContext, useState, useEffect } from 'react';
import type { User } from '../../features/auth/types';
import { authApi } from '../../features/auth/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const userId = localStorage.getItem('auth_id');
            if (userId) {
                try {
                    // In a real app, this would be validated against a server
                    const userData = await authApi.getMe(userId);
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to restore session:", error);
                    localStorage.removeItem('auth_id');
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        // Store only ID, not the whole object with role
        localStorage.setItem('auth_id', userData.id);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_id');
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


