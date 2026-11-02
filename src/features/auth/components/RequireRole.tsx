"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";

type Role = "ADMIN" | "DOCTOR" | "PATIENT";

export function RequireRole({
                                role,
                                roles,
                                children,
                            }: {
    role?: Role;
    roles?: Role[];
    children: ReactNode;
}) {
    const { me } = useSession();
    const router = useRouter();
    const allowedRoles = roles ?? (role ? [role] : []);
    const allowed = allowedRoles.includes(me.user.role);

    useEffect(() => {
        if (!allowed) router.replace("/dashboard");
    }, [allowed, router]);

    return allowed ? <>{children}</> : null;
}