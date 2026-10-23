"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { fetchMe } from "../api";
import { clearToken, getToken } from "../session";
import type { MeResponse } from "../types";

type Session = { me: MeResponse; token: string; signOut: () => void };

const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
    return ctx;
}

export function SessionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<{ me: MeResponse; token: string } | null>(null);

    const signOut = useCallback(() => {
        clearToken();
        router.replace("/login");
    }, [router]);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.replace("/login");
            return;
        }
        fetchMe(token)
            .then((me) => setState({ me, token }))
            .catch(() => {
                clearToken();
                router.replace("/login");
            });
    }, [router]);

    const value = useMemo(() => (state ? { ...state, signOut } : null), [state, signOut]);

    if (!value) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-cloud">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}