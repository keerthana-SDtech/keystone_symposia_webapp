import React from "react";
import { Header } from "./Header";

interface PageShellProps {
    children: React.ReactNode;
    className?: string;
}

export const PageShell: React.FC<PageShellProps> = ({ children, className = "" }) => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <Header />
            <main className={`flex-1 ${className}`}>
                {children}
            </main>
        </div>
    );
};
