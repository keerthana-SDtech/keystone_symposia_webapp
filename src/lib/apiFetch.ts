import { tokenStore } from './tokenStore';
import { authApi } from '../features/auth/api';

let _onAuthFailure: (() => void) | null = null;

export const setAuthFailureHandler = (fn: () => void) => {
    _onAuthFailure = fn;
};

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const makeRequest = (token: string | null) =>
        fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

    let res = await makeRequest(tokenStore.get());

    if (res.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            _onAuthFailure?.();
            return res;
        }

        try {
            const tokens = await authApi.refresh(refreshToken);
            tokenStore.set(tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            res = await makeRequest(tokens.accessToken);
        } catch {
            _onAuthFailure?.();
        }
    }

    return res;
}
