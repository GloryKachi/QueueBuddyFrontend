"use client";

import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/features/auth/components/SessionProvider";
import { doctorLabel } from "../doctor";
import { usePoll } from "../hooks/usePoll";
import { cancelMyPlace, getMyQueue, requestToJoin } from "../queueApi";
import type { MyQueue } from "../types";
import { DoctorPicker } from "./DoctorPicker";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const WA_CODE = process.env.NEXT_PUBLIC_WHATSAPP_JOIN_CODE;
const CLOSED = ["REJECTED", "CANCELLED", "SKIPPED", "DONE"];
const CARD = "rounded-2xl border border-mist bg-white p-5";
const GRADIENT = "bg-linear-to-r from-[#4FB6FF] to-[#0B5CAB] text-white";

function greeting() {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function relTime(iso: string) {
    const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} h ago`;
    return new Date(iso).toLocaleDateString("en-NG");
}

export function MyQueueView() {
    const { token } = useSession();
    const { data, setData, error, offline } = usePoll<MyQueue>(() => getMyQueue(token));
    const [doctorId, setDoctorId] = useState<number | null>(null);
    const [busy, setBusy] = useState(false);

    async function act(action: () => Promise<MyQueue>, success: string) {
        setBusy(true);
        try {
            setData(await action());
            toast.success(success);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    if (error && !data) {
        return <p className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">{error}</p>;
    }
    if (!data) {
        return <Loader2 className="mx-auto mt-24 h-8 w-8 animate-spin text-brand" />;
    }

    const entry = data.entry;
    const canJoin = !entry || CLOSED.includes(entry.status);
    const firstName = data.patientName.split(" ")[0] || "there";
    const lock = busy || offline;
    const waLink =
        WA_NUMBER && WA_CODE
            ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`join ${WA_CODE}`)}`
            : null;

    return (
        <div className="mx-auto max-w-2xl space-y-5">
            <div className={CARD}>
                <h1 className="text-2xl font-bold text-ink">
                    {greeting()}, {firstName}!
                </h1>
                <p className="text-sm text-slate">
                    Your live queue status at {data.clinicName}. Updates every few seconds.
                </p>
                {offline && <p className="mt-2 text-sm text-warning">You&apos;re offline. Reconnecting…</p>}
            </div>

            {entry?.status === "REJECTED" && (
                <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-ink">
                    <p className="font-semibold">Your last request wasn&apos;t accepted</p>
                    {entry.rejectionReason && <p className="mt-1 text-slate">{entry.rejectionReason}</p>}
                </div>
            )}

            {entry?.status === "DONE" && (
                <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-sm text-ink">
                    Your visit is complete. Thank you for your patience!
                </div>
            )}

            {canJoin && (
                <section className={CARD}>
                    <h2 className="text-lg font-bold text-ink">Join the queue</h2>
                    <p className="text-sm text-slate">
                        Send a request and {data.clinicName} will confirm your place.
                    </p>
                    <p className="mt-4 text-sm font-semibold text-ink">Choose a doctor</p>
                    <div className="mt-2">
                        <DoctorPicker doctors={data.doctors} value={doctorId} onChange={setDoctorId} disabled={lock} />
                    </div>
                    <button
                        type="button"
                        disabled={lock}
                        onClick={() => act(() => requestToJoin(token, doctorId), "Request sent")}
                        className={`mt-5 w-full rounded-full py-3 font-semibold shadow-md disabled:opacity-60 ${GRADIENT}`}
                    >
                        {busy ? "Sending…" : "Request to join the queue"}
                    </button>
                </section>
            )}

            {entry?.status === "PENDING" && (
                <section className={CARD}>
                    <h2 className="text-lg font-bold text-ink">Request sent</h2>
                    <p className="text-sm text-slate">
                        {data.clinicName} will confirm your place shortly. You&apos;ll get a message here
                        {WA_NUMBER ? " and on WhatsApp" : ""} as soon as they do.
                    </p>
                    {entry.preferredDoctorName && (
                        <p className="mt-2 text-sm text-ink">Requested: {doctorLabel(entry.preferredDoctorName)}</p>
                    )}
                    <button
                        type="button"
                        disabled={lock}
                        onClick={() => act(() => cancelMyPlace(token), "Request cancelled")}
                        className="mt-4 rounded-full border border-mist px-4 py-2 text-sm font-medium text-ink hover:bg-cloud disabled:opacity-60"
                    >
                        Cancel request
                    </button>
                </section>
            )}

            {entry?.status === "WAITING" && (
                <section className={CARD}>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <Stat label="Your position" value={String(entry.position)} sub={`Ticket #${entry.ticketNumber ?? "–"}`} />
                        <Stat
                            label="Now serving"
                            value={data.nowServingTicket ? `#${data.nowServingTicket}` : "–"}
                            sub={`${data.waitingCount} waiting`}
                        />
                        <Stat
                            label="Estimated wait"
                            value={entry.estimatedWaitMinutes <= 0 ? "Any moment" : `~${entry.estimatedWaitMinutes} min`}
                            sub="Based on today"
                        />
                    </div>
                    <p className="mt-4 text-sm text-ink">
                        Your doctor: <span className="font-semibold">{doctorLabel(entry.doctorName)}</span>
                    </p>
                    {entry.displayStatus === "NEXT" && (
                        <p className="mt-2 rounded-xl bg-brand-tint p-3 text-sm font-medium text-brand">
                            You&apos;re next. Please be ready.
                        </p>
                    )}
                    {(entry.displayStatus === "NOTIFIED" || entry.displayStatus === "LATE") && (
                        <p className="mt-2 rounded-xl bg-warning/10 p-3 text-sm font-medium text-ink">
                            The front desk is asking for you. Please come to the desk.
                        </p>
                    )}
                    <button
                        type="button"
                        disabled={lock}
                        onClick={() => {
                            if (window.confirm("Leave the queue?")) void act(() => cancelMyPlace(token), "You left the queue");
                        }}
                        className="mt-4 rounded-full border border-mist px-4 py-2 text-sm font-medium text-ink hover:bg-cloud disabled:opacity-60"
                    >
                        Leave the queue
                    </button>
                </section>
            )}

            {entry?.status === "SERVING" && (
                <section className="rounded-2xl border border-success/30 bg-success/10 p-5">
                    <h2 className="text-lg font-bold text-ink">It&apos;s your turn!</h2>
                    <p className="text-sm text-slate">Please go to {doctorLabel(entry.doctorName)} now.</p>
                </section>
            )}

            {!canJoin && data.doctors.length > 0 && (
                <section className={CARD}>
                    <h2 className="mb-3 text-sm font-semibold text-ink">Doctors today</h2>
                    <DoctorPicker doctors={data.doctors} value={entry?.doctorId ?? null} readOnly />
                </section>
            )}

            {waLink && (
                <section className={CARD}>
                    <div className="flex items-start gap-3">
                        <MessageCircle className="mt-0.5 shrink-0 text-success" size={20} />
                        <div className="min-w-0 flex-1">
                            <h2 className="text-sm font-semibold text-ink">Get updates on WhatsApp</h2>
                            <p className="text-sm text-slate">
                                Tap the button and send the pre-filled message once. After that we&apos;ll message you when you&apos;re
                                next and when it&apos;s your turn.
                            </p>
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-block rounded-full bg-success px-4 py-2 text-sm font-semibold text-white"
                            >
                                Turn on WhatsApp updates
                            </a>
                        </div>
                    </div>
                </section>
            )}

            <section className={CARD}>
                <h2 className="text-sm font-semibold text-ink">Updates</h2>
                {data.updates.length === 0 ? (
                    <p className="mt-2 text-sm text-slate">No updates yet. They&apos;ll appear here as things happen.</p>
                ) : (
                    <ul className="mt-3 space-y-3">
                        {data.updates.map((u) => (
                            <li key={u.id} className="text-sm">
                                <p className="text-ink">{u.message}</p>
                                <p className="text-xs text-slate">{relTime(u.createdAt)}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
    return (
        <div className="rounded-xl bg-cloud p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</p>
            <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
            <p className="text-xs text-slate">{sub}</p>
        </div>
    );
}