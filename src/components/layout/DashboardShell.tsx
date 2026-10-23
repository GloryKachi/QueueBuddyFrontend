"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LogOut, MessageSquare, Stethoscope, type LucideIcon } from "lucide-react";
import { useSession } from "@/features/auth/components/SessionProvider";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href?: string; icon: LucideIcon; soon?: boolean };
type Role = "ADMIN" | "DOCTOR" | "PATIENT";

const roleLabel: Record<Role, string> = { ADMIN: "Clinic admin", DOCTOR: "Doctor", PATIENT: "Patient" };

function navFor(role: Role): NavItem[] {
    if (role === "ADMIN") {
        return [
            { label: "Doctors", href: "/admin/doctors", icon: Stethoscope },
            { label: "Queue", icon: ClipboardList, soon: true },
        ];
    }
    return [{ label: "My queue", icon: ClipboardList, soon: true }];
}

function NavLink({ item, pathname, compact }: { item: NavItem; pathname: string; compact?: boolean }) {
    const active = !!item.href && pathname.startsWith(item.href);
    const Icon = item.icon;
    const base = cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
        compact && "shrink-0",
        active ? "bg-brand-tint text-brand" : "text-slate",
        item.href && !active && "hover:bg-cloud hover:text-ink"
    );
    const content = (
        <>
            <Icon size={18} />
            {item.label}
            {item.soon && (
                <span className="ml-auto rounded-full bg-cloud px-2 py-0.5 text-[10px] font-semibold uppercase text-slate">
          Soon
        </span>
            )}
        </>
    );
    return item.href ? (
        <Link href={item.href} className={base}>{content}</Link>
    ) : (
        <span className={cn(base, "cursor-not-allowed opacity-60")} aria-disabled>{content}</span>
    );
}

function BrandMark() {
    return (
        <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#4FB6FF] to-[#0B5CAB] text-white">
        <MessageSquare size={20} />
      </span>
            <div className="leading-tight">
                <p className="font-bold text-ink">QueueBuddy</p>
                <p className="text-xs text-slate">Clinic Flow</p>
            </div>
        </div>
    );
}

export function DashboardShell({ children }: { children: ReactNode }) {
    const { me, signOut } = useSession();
    const pathname = usePathname();
    const items = navFor(me.user.role);

    return (
        <div className="flex min-h-screen bg-cloud">
            <aside className="hidden w-64 shrink-0 flex-col border-r border-mist bg-white p-4 md:flex">
                <BrandMark />
                <nav className="mt-8 space-y-1">
                    {items.map((item) => <NavLink key={item.label} item={item} pathname={pathname} />)}
                </nav>
                <div className="mt-auto flex items-center gap-3 rounded-2xl bg-brand-tint p-3">
                    <InitialsAvatar name={me.user.fullName} className="h-9 w-9 bg-white text-xs" />
                    <div className="min-w-0 leading-tight">
                        <p className="truncate text-sm font-semibold text-ink">{me.user.fullName}</p>
                        <p className="text-xs text-slate">{roleLabel[me.user.role]}</p>
                    </div>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-16 items-center justify-between px-4 md:px-8">
                    <div className="md:hidden"><BrandMark /></div>
                    <p className="hidden text-sm font-medium text-slate md:block">{me.clinic.name}</p>
                    <button
                        type="button"
                        onClick={signOut}
                        className="flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-medium text-slate hover:text-ink"
                    >
                        <LogOut size={16} /> Sign out
                    </button>
                </header>

                <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
                    {items.map((item) => <NavLink key={item.label} item={item} pathname={pathname} compact />)}
                </nav>

                <main className="flex-1 px-4 pb-10 pt-2 md:px-8">{children}</main>
            </div>
        </div>
    );
}