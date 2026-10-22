"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { CenteredCard } from "@/components/shared/CenteredCard";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/types/api";
import { resendVerification } from "../api";
import { useCountdown } from "../hooks/useCountdown";

export function CheckEmailView() {
    const email = useSearchParams().get("email") ?? "";
    const { secondsLeft, start } = useCountdown(30);
    const [sending, setSending] = useState(false);

    async function resend() {
        setSending(true);
        try {
            await resendVerification(email);
            toast.success("We sent the link again.");
            start(30);
        } catch (err) {
            if (err instanceof ApiError && err.code === "RESEND_TOO_SOON") start(30);
            toast.error(err instanceof ApiError ? err.message : "Couldn't resend. Please try again.");
        } finally {
            setSending(false);
        }
    }

    return (
        <CenteredCard>
            <Logo label="CLINIC SUITE" className="bg-brand-tint shadow-none" />
            <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand-tint text-brand">
                <Mail size={32} />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink">Check your email</h1>
            <p className="mt-2 text-slate">
                We sent a verification link to{" "}
                <span className="font-semibold text-ink">{email || "your email"}</span>. It expires in 15
                minutes.
            </p>

            <Button
                variant="outline"
                className="mt-8 h-12 w-full rounded-full border-mist text-brand"
                disabled={!email || sending || secondsLeft > 0}
                onClick={resend}
            >
                {secondsLeft > 0 ? `Resend email in ${secondsLeft}s` : "Resend email"}
            </Button>

            <p className="mt-6 text-sm text-slate">
                Wrong email?{" "}
                <Link href="/register/clinic" className="font-semibold text-brand hover:underline">
                    Start over
                </Link>
            </p>
        </CenteredCard>
    );
}