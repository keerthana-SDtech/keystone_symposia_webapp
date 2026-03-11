import React from "react";
import { TenantAdminSidebar } from "./TenantAdminSidebar";

interface TenantAdminLayoutProps {
  children: React.ReactNode;
}

export const TenantAdminLayout = ({ children }: TenantAdminLayoutProps) => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <TenantAdminSidebar />
      <main className="flex-1 bg-[#F8FAFC] px-10 py-8">
        {children}
      </main>
    </div>
  );
};
