"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Building2, Check, Copy, Loader2, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { CenteredCard } from "@/components/shared/CenteredCard";
import { Logo } from "@/components/shared/Logo";
import { gradientButton } from "@/components/shared/styles";
import { cn } from "@/lib/utils";
import { ApiError } from "@/types/api";
import { verifyEmail } from "../api";
import type { SignupResponse } from "../types";

type State =
    | { status: "loading" }
    | { status: "success"; data: SignupResponse }
    | { status: "error"; message: string };

export function VerifyEmailView() {
    const token = useSearchParams().get("token");
    const [state, setState] = useState<State>(
        token
            ? { status: "loading" }
            : { status: "error", message: "This verification link is incomplete." }
    );
    const ran = useRef(false); // the token is single-use, so only call once (React strict mode runs effects twice)

    useEffect(() => {
        if (!token || ran.current) return;
        ran.current = true;
        verifyEmail(token)
            .then((data) => setState({ status: "success", data }))
            .catch((err) =>
                setState({
                    status: "error",
                    message: err instanceof ApiError ? err.message : "Couldn't verify your email. Please try again.",
                })
            );
    }, [token]);

    if (state.status === "loading") {
        return (
            <CenteredCard>
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand" />
                <p className="mt-4 text-slate">Verifying your email…</p>
            </CenteredCard>
        );
    }

    if (state.status === "error") {
        return (
            <CenteredCard>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger">
                    <AlertCircle size={28} />
                </div>
                <h1 className="mt-5 text-2xl font-bold text-ink">Link not valid</h1>
                <p className="mt-2 text-slate">{state.message}</p>
                <Link
                    href="/register/clinic"
                    className={cn(gradientButton, "mt-6 inline-flex h-12 w-full items-center justify-center rounded-full")}
                >
                    Back to sign up
                </Link>
            </CenteredCard>
        );
    }

    const { clinic, user, message } = state.data;

    // Clinic admin: "Your clinic is ready!"
    if (clinic && user.role === "ADMIN") {
        return (
            <CenteredCard>
                <Logo label="CLINIC SUITE" className="bg-brand-tint shadow-none" />
                <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#4FB6FF] to-[#0B5CAB] text-white shadow-lg shadow-[#0B5CAB]/30">
                    <Check size={36} strokeWidth={3} />
                </div>
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink">Your clinic is ready!</h1>
                <p className="mt-1 text-slate">Let&apos;s get your first patient in the queue.</p>

                <div className="mt-6 space-y-2 rounded-2xl bg-brand-tint p-4 text-left text-sm">
                    <p className="flex items-center gap-2 font-semibold text-ink">
                        <Building2 size={16} className="text-brand" /> {clinic.name}
                    </p>
                    <p className="flex items-center gap-2 text-slate">
                        <MessageCircle size={14} /> {clinic.whatsappNumber}
                    </p>
                    <p className="flex items-center gap-2 text-slate">
                        <MapPin size={14} /> {clinic.city}
                    </p>
                </div>

                <JoinCode code={clinic.joinCode} />

                <Link
                    href="/login"
                    className={cn(gradientButton, "mt-6 inline-flex h-12 w-full items-center justify-center rounded-full")}
                >
                    Go to my dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </CenteredCard>
        );
    }

    // Patient / doctor: simple confirmation
    return (
        <CenteredCard>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#4FB6FF] to-[#0B5CAB] text-white">
                <Check size={36} strokeWidth={3} />
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink">Email verified</h1>
            <p className="mt-2 text-slate">{message}</p>
            <Link
                href="/login"
                className={cn(gradientButton, "mt-6 inline-flex h-12 w-full items-center justify-center rounded-full")}
            >
                Continue to sign in
            </Link>
        </CenteredCard>
    );
}

function JoinCode({ code }: { code: string }) {
    async function copy() {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("Clinic code copied");
        } catch {
            toast.error("Couldn't copy. Select the code and copy it manually.");
        }
    }
    return (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-mist px-4 py-3 text-left">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate">Clinic code</p>
                <p className="font-mono text-2xl font-bold tracking-[0.2em] text-ink">{code}</p>
                <p className="text-xs text-slate">Patients and doctors use this to join your clinic.</p>
            </div>
            <button
                type="button"
                onClick={copy}
                aria-label="Copy clinic code"
                className="rounded-full p-2 text-brand hover:bg-brand-tint"
            >
                <Copy size={18} />
            </button>
        </div>
    );
}