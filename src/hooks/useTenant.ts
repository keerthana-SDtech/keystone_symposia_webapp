import { useTenantStore } from '../stores/tenant.store';

export const useTenant = () => {
    const config = useTenantStore((s) => s.config);
    const loading = useTenantStore((s) => s.loading);
    const error = useTenantStore((s) => s.error);
    return {
        name: config.name,
        logo: config.logo,
        logoDark: config.logoDark,
        logoWidth: config.logoWidth,
        logoHeight: config.logoHeight,
        colors: config.colors,
        loading,
        error,
    };
};
