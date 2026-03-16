import { useNavigate, useLocation } from "react-router-dom";
import {
  Users, ShieldCheck, Network, Shield,
  Zap, ClipboardList, LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TENANT_ADMIN_NAV_ITEMS } from "./tenantAdminNavData";

const ICON_MAP: Record<string, LucideIcon> = {
  Users, ShieldCheck, Network, Shield,
  Zap, ClipboardList, LayoutGrid,
};

export const TenantAdminSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-gray-200 py-6 flex flex-col min-h-full">
      <nav className="flex flex-col gap-2 px-4">
        {TENANT_ADMIN_NAV_ITEMS.map(({ key, label, icon, route }) => {
          const Icon = ICON_MAP[icon];
          const isActive = pathname === route;

          return (
            <div key={key} className="relative">
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[58%] bg-primary rounded-full z-10" />
              )}
              <button
                onClick={() => navigate(route)}
                className={cn(
                  "flex items-center gap-3 w-full text-left py-4 px-5 rounded-xl text-[15px] transition-colors",
                  isActive
                    ? "bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                    : "text-gray-500 hover:text-gray-800 font-normal"
                )}
              >
                {Icon && (
                  <Icon className="h-[18px] w-[18px] shrink-0 text-gray-400" strokeWidth={1.5} />
                )}
                <span>{label}</span>
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
