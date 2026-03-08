import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import defaultConfig from '../config/tenant.json';
import { API_BASE_URL } from '../lib/httpClient';

const TTL_MS = 30 * 60 * 1000; // 30 minutes

interface TenantConfig {
    name: string;
    logo: string;
    logoDark?: string;
    logoWidth?: string;
    logoHeight?: string;
    colors: {
        primary: string;
        primaryForeground: string;
    };
}

interface TenantState {
    config: TenantConfig;
    loading: boolean;
    error: string | null;
    lastFetchedAt: number | null;
    fetchConfig: () => Promise<void>;
}

export const useTenantStore = create<TenantState>()(
    persist(
        (set, get) => ({
            config: defaultConfig,
            loading: false,
            error: null,
            lastFetchedAt: null,

            fetchConfig: async () => {
                const { lastFetchedAt, loading } = get();

                // Prevent concurrent fetches and skip if cache is fresh
                if (loading) return;
                const isStale = !lastFetchedAt || Date.now() - lastFetchedAt > TTL_MS;
                if (!isStale) return;

                set({ loading: true, error: null });

                try {
                    const res = await fetch(`${API_BASE_URL}/tenant/public/config`);

                    if (res.status === 404 || res.status === 400) {
                        throw new Error('This domain is not associated with any tenant.');
                    }
                    if (!res.ok) {
                        throw new Error('Failed to load tenant configuration.');
                    }

                    const data = await res.json();
                    const prev = get().config;

                    set({
                        config: {
                            ...prev,
                            name: data.name ?? prev.name,
                            logo: data.logoUrl ?? prev.logo,
                            colors: {
                                primary: data.themeColor ?? prev.colors.primary,
                                primaryForeground: prev.colors.primaryForeground,
                            },
                        },
                        loading: false,
                        error: null,
                        lastFetchedAt: Date.now(),
                    });
                } catch (err: any) {
                    set({ loading: false, error: err.message, lastFetchedAt: null });
                }
            },
        }),
        {
            name: 'tenant-config',
            partialize: (state) => ({
                config: state.config,
                lastFetchedAt: state.lastFetchedAt,
            }),
        },
    ),
);
