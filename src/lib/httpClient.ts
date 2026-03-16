import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { tokenStore } from './tokenStore';

// Derive API base URL from the current hostname so the subdomain (e.g. acme)
// is preserved in requests to the gateway — required for tenant resolution.
const apiPort = import.meta.env.VITE_API_PORT ?? '3000';
export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${apiPort}`;
export const REFRESH_TOKEN_KEY = 'refreshToken';

// ---------------------------------------------------------------------------
// Plain Axios instance — no auth interceptors.
// Used for auth endpoints (login, register, refresh, logout) and any call
// where the caller supplies its own Authorization header explicitly.
// ---------------------------------------------------------------------------
export const authClient = axios.create({ baseURL: API_BASE_URL });

// ---------------------------------------------------------------------------
// Authenticated HTTP client — Axios singleton with:
//   • Request interceptor  → attaches Bearer token from tokenStore
//   • Response interceptor → transparent token refresh on 401, then retry
// ---------------------------------------------------------------------------
class HttpClient {
    private instance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (token: string) => void;
        reject: (err: unknown) => void;
    }> = [];
    private _onAuthFailure: (() => void) | null = null;

    constructor() {
        this.instance = axios.create({ baseURL: API_BASE_URL });
        this.setupInterceptors();
    }

    setAuthFailureHandler(fn: () => void) {
        this._onAuthFailure = fn;
    }

    private processQueue(error: unknown, token: string | null = null) {
        for (const { resolve, reject } of this.failedQueue) {
            if (error) reject(error);
            else resolve(token!);
        }
        this.failedQueue = [];
    }

    private setupInterceptors() {
        // --- Request: attach access token ---
        this.instance.interceptors.request.use((config) => {
            const token = tokenStore.get();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // --- Response: transparent 401 → refresh → retry ---
        this.instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status !== 401 || originalRequest._retry) {
                    return Promise.reject(error);
                }

                if (this.isRefreshing) {
                    // Queue this request until the in-flight refresh finishes
                    return new Promise<string>((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    }).then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return this.instance(originalRequest);
                    });
                }

                originalRequest._retry = true;
                this.isRefreshing = true;

                const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
                if (!storedRefreshToken) {
                    this._onAuthFailure?.();
                    return Promise.reject(error);
                }

                try {
                    const { data } = await authClient.post<{
                        accessToken: string;
                        refreshToken: string;
                        identityId: string;
                    }>('/auth/refresh', { refreshToken: storedRefreshToken });

                    tokenStore.set(data.accessToken);
                    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

                    this.processQueue(null, data.accessToken);
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return this.instance(originalRequest);
                } catch (refreshError) {
                    this.processQueue(refreshError, null);
                    this._onAuthFailure?.();
                    return Promise.reject(refreshError);
                } finally {
                    this.isRefreshing = false;
                }
            },
        );
    }

    get<T = unknown>(url: string, config?: AxiosRequestConfig) {
        return this.instance.get<T>(url, config);
    }

    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        return this.instance.post<T>(url, data, config);
    }

    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        return this.instance.put<T>(url, data, config);
    }

    patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        return this.instance.patch<T>(url, data, config);
    }

    delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
        return this.instance.delete<T>(url, config);
    }
}

export const httpClient = new HttpClient();

/** Register a callback that fires when the refresh token is invalid/expired. */
export const setAuthFailureHandler = (fn: () => void) =>
    httpClient.setAuthFailureHandler(fn);
