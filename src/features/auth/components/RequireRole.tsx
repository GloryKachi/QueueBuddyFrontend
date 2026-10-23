"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";

export function RequireRole({ role, children }: { role: "ADMIN" | "DOCTOR" | "PATIENT"; children: ReactNode }) {
    const { me } = useSession();
    const router = useRouter();
    const allowed = me.user.role === role;

    useEffect(() => {
        if (!allowed) router.replace("/dashboard");
    }, [allowed, router]);

    return allowed ? <>{children}</> : null;
}