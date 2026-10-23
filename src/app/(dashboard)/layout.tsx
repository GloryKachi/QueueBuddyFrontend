import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SessionProvider } from "@/features/auth/components/SessionProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <DashboardShell>{children}</DashboardShell>
        </SessionProvider>
    );
}