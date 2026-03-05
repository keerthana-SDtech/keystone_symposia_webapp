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

const TenantContext = createContext<TenantConfig>(defaultConfig);

// eslint-disable-next-line react-refresh/only-export-components
export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
    const [config] = useState<TenantConfig>(defaultConfig);

    useEffect(() => {
        // Inject custom colors as CSS variables to root
        const root = document.documentElement;
        if (config.colors.primary) {
            root.style.setProperty("--primary", config.colors.primary);
        }
        if (config.colors.primaryForeground) {
            root.style.setProperty("--primary-foreground", config.colors.primaryForeground);
        }
        // Set document title
        document.title = config.name;
    }, [config]);

    return (
        <TenantContext.Provider value={config}>
            {children}
        </TenantContext.Provider>
    );
};
