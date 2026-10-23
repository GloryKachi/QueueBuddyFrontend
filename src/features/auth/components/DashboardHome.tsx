"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";

export function DashboardHome() {
    const { me } = useSession();
    const router = useRouter();
    const isAdmin = me.user.role === "ADMIN";

    useEffect(() => {
        if (isAdmin) router.replace("/admin/doctors");
    }, [isAdmin, router]);

    if (isAdmin) return null;

    return (
        <div className="mx-auto mt-10 max-w-md rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-ink">Hello, {me.user.fullName}</h1>
            <p className="mt-2 text-slate">Your queue view is coming soon.</p>
        </div>
    );
}