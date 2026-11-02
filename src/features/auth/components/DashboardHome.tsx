"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "./SessionProvider";

export function DashboardHome() {
    const { me } = useSession();
    const router = useRouter();
    const target = me.user.role === "PATIENT" ? "/my-queue" : "/queue";

    useEffect(() => {
        router.replace(target);
    }, [router, target]);

    return <Loader2 className="mx-auto mt-24 h-8 w-8 animate-spin text-brand" />;
}