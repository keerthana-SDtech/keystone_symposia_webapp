import type { AuthResponse, User } from "../types";
import type { LoginFormValues, SignupFormValues } from "../schemas";

let MOCK_USERS = [
    {
        id: "1",
        email: "scientist@keystone.org",
        name: "Dr. Jane Smith",
        role: "external_scientist" as const,
        password: "password123"
    },
    {
        id: "2",
        email: "member@keystone.org",
        name: "Prof. John Doe",
        role: "keystone_member" as const,
        password: "password123"
    }
];

export const authApi = {
    login: async (values: LoginFormValues): Promise<AuthResponse> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const user = MOCK_USERS.find(u => u.email === values.email && u.password === values.password);

        if (user) {
            const { password, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                accessToken: `mock-access-${user.id}`,
                refreshToken: `mock-refresh-${user.id}`,
            };
        }
        throw new Error("Invalid email or password");
    },

    signup: async (values: SignupFormValues): Promise<AuthResponse> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            email: values.email,
            name: values.name,
            role: "external_scientist" as const,
        };
        MOCK_USERS.push({ ...newUser, password: values.password });
        return {
            user: newUser,
            accessToken: `mock-access-${newUser.id}`,
            refreshToken: `mock-refresh-${newUser.id}`,
        };
    },

    refresh: async (refreshToken: string): Promise<AuthResponse> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Parse userId from "mock-refresh-<id>"
        const userId = refreshToken.replace('mock-refresh-', '');
        const user = MOCK_USERS.find(u => u.id === userId);
        if (!user) throw new Error("Invalid refresh token");
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken: `mock-access-${user.id}`,
            refreshToken: `mock-refresh-${user.id}`,
        };
    },

    logout: async (_refreshToken: string): Promise<void> => {
        // In a real app: revoke refreshToken in the database
        await new Promise((resolve) => setTimeout(resolve, 200));
    },

    getMe: async (userId: string): Promise<User> => {
        const user = MOCK_USERS.find(u => u.id === userId);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        throw new Error("User not found");
    }
};
