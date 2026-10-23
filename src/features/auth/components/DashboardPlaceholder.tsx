"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchMe } from "../api";
import { clearToken, getToken } from "../session";
import type { MeResponse } from "../types";

export function DashboardPlaceholder() {
    const router = useRouter();
    const [me, setMe] = useState<MeResponse | null>(null);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.replace("/login");
            return;
        }
        fetchMe(token)
            .then(setMe)
            .catch(() => {
                clearToken();
                router.replace("/login");
            });
    }, [router]);

    if (!me) {
        return <Loader2 className="mx-auto mt-24 h-8 w-8 animate-spin text-brand" />;
    }

    return (
        <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl">
            <h1 className="text-2xl font-bold text-ink">Hello, {me.user.fullName}</h1>
            <p className="mt-1 text-slate">
                {me.user.role} · {me.clinic.name}
            </p>
            {me.user.role === "ADMIN" && (
                <p className="mt-4 font-mono text-lg tracking-widest text-ink">
                    Clinic code: {me.clinic.joinCode}
                </p>
            )}
            <p className="mt-4 text-sm text-slate">The real dashboard is coming next.</p>
            <Button
                variant="outline"
                className="mt-6 rounded-full"
                onClick={() => {
                    clearToken();
                    router.replace("/login");
                }}
            >
                Sign out
            </Button>
        </div>
    );
}