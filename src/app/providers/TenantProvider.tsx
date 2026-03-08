import { createContext, useContext, useEffect, useState } from "react";
import defaultConfig from "../../config/tenant.json";

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
}

const TenantContext = createContext<TenantState>({
    config: defaultConfig,
    loading: true,
    error: null,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<TenantState>({
        config: defaultConfig,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const apiPort = import.meta.env.VITE_API_PORT ?? '3000';
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}`;

        fetch(`${baseUrl}/tenant/public/config`)
            .then(async (res) => {
                if (res.status === 404 || res.status === 400) {
                    throw new Error('This domain is not associated with any tenant.');
                }
                if (!res.ok) {
                    throw new Error('Failed to load tenant configuration.');
                }
                return res.json();
            })
            .then((data) => {
                setState((prev) => ({
                    loading: false,
                    error: null,
                    config: {
                        ...prev.config,
                        name: data.name ?? prev.config.name,
                        colors: {
                            primary: data.themeColor ?? prev.config.colors.primary,
                            primaryForeground: prev.config.colors.primaryForeground,
                        },
                        logo: data.logoUrl ?? prev.config.logo,
                    },
                }));
            })
            .catch((err: Error) => {
                setState((prev) => ({ ...prev, loading: false, error: err.message }));
            });
    }, []);

    useEffect(() => {
        if (state.loading || state.error) return;
        const root = document.documentElement;
        if (state.config.colors.primary) {
            root.style.setProperty("--primary", state.config.colors.primary);
        }
        if (state.config.colors.primaryForeground) {
            root.style.setProperty("--primary-foreground", state.config.colors.primaryForeground);
        }
        document.title = state.config.name;
    }, [state]);

    if (state.loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <p style={{ color: '#888', fontSize: '14px' }}>Loading...</p>
            </div>
        );
    }

    if (state.error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '8px' }}>
                <p style={{ fontWeight: 600, fontSize: '16px' }}>Tenant not found</p>
                <p style={{ color: '#888', fontSize: '14px' }}>{state.error}</p>
            </div>
        );
    }

    return (
        <TenantContext.Provider value={state}>
            {children}
        </TenantContext.Provider>
    );
};
