"use client";

import { useState } from "react";
import { Hourglass, Loader2, PartyPopper, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { StatusPill } from "@/components/shared/StatusPill";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { gradientButton } from "@/components/shared/styles";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/components/SessionProvider";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/time";
import { ApiError } from "@/types/api";
import { cancelMyPlace, requestToJoin } from "../api";
import { useMyQueue } from "../hooks/useMyQueue";
import type { MyQueue, VisitType } from "../types";
import { VisitTypePicker } from "./VisitTypePicker";

function greeting() {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function BigCard({ label, children, foot }: { label: string; children: React.ReactNode; foot?: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-mist bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate">{label}</p>
            <div className="mt-3">{children}</div>
            {foot && <div className="mt-3 text-sm text-slate">{foot}</div>}
        </div>
    );
}

export function MyQueueView() {
    const { token, me } = useSession();
    const { data, setData, error, offline } = useMyQueue(token);
    const [visitType, setVisitType] = useState<VisitType>("CHECKUP");
    const [busy, setBusy] = useState(false);

    async function run(action: () => Promise<MyQueue>, success?: string) {
        setBusy(true);
        try {
            setData(await action());
            if (success) toast.success(success);
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    if (error && !data) return <p className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">{error}</p>;
    if (!data) return <Loader2 className="mx-auto mt-24 h-8 w-8 animate-spin text-brand" />;

    const entry = data.entry;
    const active = !!entry && ["PENDING", "WAITING", "SERVING"].includes(entry.status);
    const canCancel = !!entry && (entry.status === "PENDING" || entry.status === "WAITING");
    const firstName = me.user.fullName.split(" ")[0];

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {offline && (
                <AlertBanner variant="info">
          <span className="flex items-center gap-2">
            <WifiOff size={14} /> You&apos;re offline. Reconnecting…
          </span>
                </AlertBanner>
            )}

            <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mist bg-white p-5 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink">
                        {greeting()}, {firstName}!
                    </h1>
                    <p className="text-sm text-slate">Your live queue status at {data.clinicName}. Updates every few seconds.</p>
                </div>
                {canCancel && (
                    <Button variant="outline" disabled={busy || offline} className="rounded-full text-slate"
                            onClick={() => {
                                if (window.confirm("Cancel your place in the queue?")) void run(() => cancelMyPlace(token), "Your place was cancelled");
                            }}>
                        {entry?.status === "PENDING" ? "Cancel request" : "Leave the queue"}
                    </Button>
                )}
            </section>

            {/* Notes about the latest closed request */}
            {entry?.status === "REJECTED" && (
                <AlertBanner variant="error">
                    <p className="font-semibold">Your request wasn&apos;t accepted</p>
                    <p>{entry.rejectionReason}</p>
                </AlertBanner>
            )}
            {entry?.status === "DONE" && (
                <AlertBanner variant="success">Your visit is complete. Thank you for coming!</AlertBanner>
            )}
            {entry?.status === "SKIPPED" && (
                <AlertBanner variant="info">You were marked as a no-show. You can request to join again below.</AlertBanner>
            )}
            {entry?.status === "CANCELLED" && (
                <AlertBanner variant="info">Your place was cancelled. You can request to join again below.</AlertBanner>
            )}

            {/* Not in the queue: ask to join */}
            {!active && (
                <section className="rounded-2xl border border-mist bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-ink">Join the queue</h2>
                    <p className="mt-1 text-sm text-slate">
                        Send a request and {data.clinicName} will confirm your place.
                    </p>
                    <div className="mt-4 space-y-4">
                        <div>
                            <p className="mb-2 text-sm font-semibold text-ink">Reason for your visit</p>
                            <VisitTypePicker value={visitType} onChange={setVisitType} />
                        </div>
                        <div className="max-w-sm">
                            <SubmitButton
                                type="button"
                                loading={busy}
                                disabled={offline}
                                onClick={() => void run(() => requestToJoin(token, visitType), "Request sent")}
                            >
                                Request to join the queue
                            </SubmitButton>
                        </div>
                    </div>
                </section>
            )}

            {/* Request sent, waiting for the clinic */}
            {entry?.status === "PENDING" && (
                <section className="flex items-start gap-4 rounded-2xl border border-brand bg-brand-tint/50 p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand">
            <Hourglass size={22} />
          </span>
                    <div>
                        <h2 className="text-xl font-bold text-ink">Request sent</h2>
                        <p className="mt-1 text-slate">
                            We&apos;re waiting for {data.clinicName} to confirm your place. You&apos;ll see an update here as soon
                            as they respond.
                        </p>
                    </div>
                </section>
            )}

            {/* In the queue */}
            {entry?.status === "WAITING" && (
                <section className="grid gap-4 md:grid-cols-3">
                    <BigCard
                        label="Your queue position"
                        foot={
                            <>
                                <StatusPill tone={entry.displayStatus === "NEXT" ? "brand" : "soft"}>
                                    {entry.displayStatus === "NEXT" ? "Next in line" : `Number ${entry.position} in line`}
                                </StatusPill>
                            </>
                        }
                    >
                        <p className="text-5xl font-extrabold text-brand">#{entry.ticketNumber}</p>
                    </BigCard>

                    <BigCard label="Now serving">
                        <p className="text-5xl font-extrabold text-ink">
                            {data.nowServingTicket ? `#${data.nowServingTicket}` : "–"}
                        </p>
                    </BigCard>

                    <BigCard label="Estimated wait" foot={<>Average consult: {data.avgConsultMinutes} min</>}>
                        <p className="text-5xl font-extrabold text-ink">
                            ~{entry.estimatedWaitMinutes ?? 0}
                            <span className="ml-1 text-lg font-medium text-slate">mins</span>
                        </p>
                    </BigCard>
                </section>
            )}

            {/* It's your turn */}
            {entry?.status === "SERVING" && (
                <section className={cn(gradientButton, "flex items-center gap-5 rounded-2xl p-6")}>
                    <PartyPopper size={36} />
                    <div>
                        <h2 className="text-2xl font-bold">It&apos;s your turn!</h2>
                        <p className="opacity-90">Please go in to see the doctor. Your ticket is #{entry.ticketNumber}.</p>
                    </div>
                </section>
            )}

            {/* Updates */}
            <section className="rounded-2xl border border-mist bg-white p-5 shadow-sm">
                <h2 className="font-bold text-ink">Updates</h2>
                {data.updates.length === 0 ? (
                    <p className="mt-3 text-sm text-slate">No updates yet. They&apos;ll appear here as things happen.</p>
                ) : (
                    <ul className="mt-3 divide-y divide-mist">
                        {data.updates.map((u) => (
                            <li key={u.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                                <span className="text-ink">{u.message}</span>
                                <span className="shrink-0 text-xs text-slate">{timeAgo(u.createdAt)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}