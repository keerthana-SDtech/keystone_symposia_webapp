import { useEffect } from 'react';
import { useTenantStore } from '../../stores/tenant.store';

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
    const { config, loading, error, fetchConfig } = useTenantStore();

    // Fetch on mount — store handles TTL cache internally
    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    // Apply branding side effects whenever config changes
    useEffect(() => {
        if (loading) return;

        if (error) {
            document.title = 'Tenant Not Found';
            return;
        }

        const root = document.documentElement;
        root.style.setProperty('--primary', config.colors.primary);
        root.style.setProperty('--primary-foreground', config.colors.primaryForeground);
        document.title = config.name;

        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
        if (favicon && config.logo) favicon.href = config.logo;
    }, [config, loading, error]);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <p style={{ color: '#888', fontSize: '14px' }}>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '8px' }}>
                <p style={{ fontWeight: 600, fontSize: '16px' }}>Tenant not found</p>
                <p style={{ color: '#888', fontSize: '14px' }}>{error}</p>
            </div>
        );
    }

    return <>{children}</>;
};
