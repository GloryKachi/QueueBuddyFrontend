"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { useSession } from "@/features/auth/components/SessionProvider";
import { doctorLabel } from "../doctor";
import { usePoll } from "../hooks/usePoll";
import {
    acceptRequest, assignDoctor, callNext, cancelEntry, completeEntry,
    getQueue, notifyEntry, rejectRequest, setDuty, skipEntry,
} from "../queueApi";
import type { QueueItem, QueueSnapshot } from "../types";
import { CallNextButton } from "./CallNextButton";
import { DutyToggle } from "./DutyToggle";
import { NowServingCard } from "./NowServingCard";
import { QueueRow } from "./QueueRow";
import { QueueStatsCards } from "./QueueStatsCards";
import { RejectDialog } from "./RejectDialog";
import { RequestsPanel } from "./RequestsPanel";

export function QueueView() {
    const { token } = useSession();
    const { data: snapshot, setData: setSnapshot, error, offline } = usePoll<QueueSnapshot>(() => getQueue(token));
    const [busy, setBusy] = useState(false);
    const [declining, setDeclining] = useState<QueueItem | null>(null);
    const [doctorFilter, setDoctorFilter] = useState<number | null>(null);
    const seenRequests = useRef<Set<number> | null>(null);

    const isAdmin = snapshot?.viewerRole === "ADMIN";
    const inFilter = (i: QueueItem) => !isAdmin || doctorFilter === null || i.doctorId === doctorFilter;
    const waitingList = (snapshot?.waiting ?? []).filter(inFilter);
    const servingList = (snapshot?.serving ?? []).filter(inFilter);
    const nextUp = waitingList[0];
    const canCall = !!nextUp && !busy && !offline && (!isAdmin || doctorFilter !== null);

    async function run(action: () => Promise<QueueSnapshot>, success?: string): Promise<boolean> {
        setBusy(true);
        try {
            setSnapshot(await action());
            if (success) toast.success(success);
            return true;
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            return false;
        } finally {
            setBusy(false);
        }
    }

    const handleCallNext = () =>
        run(
            () => callNext(token, isAdmin ? (doctorFilter ?? undefined) : undefined),
            nextUp ? `Called ${nextUp.patientName}` : undefined,
        );

    async function toggleDuty() {
        if (!snapshot) return;
        setBusy(true);
        try {
            const res = await setDuty(token, !snapshot.onDuty);
            setSnapshot({ ...snapshot, onDuty: res.onDuty });
            toast.success(res.onDuty ? "You're on duty. Patients can see you." : "You're off duty.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    useEffect(() => {
        if (!snapshot) return;
        const ids = new Set(snapshot.requests.map((r) => r.id));
        const seen = seenRequests.current;
        if (seen) {
            snapshot.requests
                .filter((r) => !seen.has(r.id))
                .forEach((r) => toast.info(`New join request: ${r.patientName}`));
        }
        seenRequests.current = ids;
        document.title = ids.size > 0 ? `(${ids.size}) QueueBuddy` : "QueueBuddy";
    }, [snapshot]);

    useEffect(() => () => { document.title = "QueueBuddy"; }, []);

    // Keyboard shortcut: N calls the next patient
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!e.key || e.key.toLowerCase() !== "n" || e.metaKey || e.ctrlKey || e.altKey) return;
            const el = e.target as HTMLElement | null;
            if (el && (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || el.isContentEditable)) return;
            if (declining || !canCall) return;
            e.preventDefault();
            void handleCallNext();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    function confirmThen(message: string, action: () => Promise<QueueSnapshot>, success: string) {
        if (window.confirm(message)) void run(action, success);
    }

    const skip = (item: QueueItem) =>
        confirmThen(`Mark ${item.patientName} as a no-show?`, () => skipEntry(token, item.id), "Marked as no-show");

    if (error && !snapshot) {
        return <p className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">{error}</p>;
    }
    if (!snapshot) {
        return offline ? (
            <p className="mt-24 text-center text-slate">You&apos;re offline. Reconnecting…</p>
        ) : (
            <Loader2 className="mx-auto mt-24 h-8 w-8 animate-spin text-brand" />
        );
    }

    const dateLabel = new Date(`${snapshot.date}T00:00:00`).toLocaleDateString("en-NG", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const lock = busy || offline;

    return (
        <div>
            {offline && (
                <div className="mb-4">
                    <AlertBanner variant="info">
            <span className="flex items-center gap-2">
              <WifiOff size={14} /> You&apos;re offline. Reconnecting… Actions are paused until you&apos;re back.
            </span>
                    </AlertBanner>
                </div>
            )}

            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-ink">
                        Waiting <span className="text-slate">({snapshot.stats.waiting})</span>
                    </h1>
                    <p className="text-sm text-slate">{dateLabel}</p>
                </div>
                {!isAdmin && (
                    <DutyToggle onDuty={!!snapshot.onDuty} busy={lock} onToggle={() => void toggleDuty()} />
                )}
            </div>

            {isAdmin && snapshot.doctors.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter by doctor">
                    <FilterChip active={doctorFilter === null} onClick={() => setDoctorFilter(null)}>
                        All doctors
                    </FilterChip>
                    {snapshot.doctors.map((d) => (
                        <FilterChip key={d.id} active={doctorFilter === d.id} onClick={() => setDoctorFilter(d.id)}>
                            <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${d.onDuty ? "bg-success" : "bg-mist"}`} />
                            {doctorLabel(d.name)} · {d.waiting}
                        </FilterChip>
                    ))}
                </div>
            )}

            <div className="mt-6 space-y-6">
                <RequestsPanel
                    requests={snapshot.requests}
                    doctors={snapshot.doctors}
                    isAdmin={isAdmin}
                    busy={lock}
                    onAccept={(item, doctorId) =>
                        void run(() => acceptRequest(token, item.id, doctorId), `${item.patientName} added to the queue`)
                    }
                    onDecline={setDeclining}
                />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="space-y-3">
                        {waitingList.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-mist bg-white p-10 text-center text-slate">
                                Nobody is waiting. Patients join by requesting a place from their account, and you&apos;ll see
                                their request above.
                            </div>
                        ) : (
                            waitingList.map((item) => (
                                <QueueRow
                                    key={item.id}
                                    item={item}
                                    doctors={snapshot.doctors}
                                    canAssign={isAdmin}
                                    busy={lock}
                                    onNotify={() => void run(() => notifyEntry(token, item.id), `Notified ${item.patientName}`)}
                                    onSkip={() => skip(item)}
                                    onRemove={() =>
                                        confirmThen(`Remove ${item.patientName} from the queue?`,
                                            () => cancelEntry(token, item.id), "Removed from the queue")
                                    }
                                    onAssign={(doctorId) =>
                                        void run(() => assignDoctor(token, item.id, doctorId), `${item.patientName} reassigned`)
                                    }
                                />
                            ))
                        )}
                    </section>

                    <aside className="space-y-4">
                        {servingList.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-mist bg-white p-6 text-center text-slate">
                                <p className="text-xs font-semibold uppercase tracking-wider">Now serving</p>
                                <p className="mt-2">Nobody is being served.</p>
                            </div>
                        ) : (
                            servingList.map((item) => (
                                <NowServingCard
                                    key={item.id}
                                    item={item}
                                    busy={lock}
                                    onDone={() => void run(() => completeEntry(token, item.id), `${item.patientName} is done`)}
                                    onSkip={() => skip(item)}
                                />
                            ))
                        )}

                        <CallNextButton next={nextUp} disabled={!canCall} onClick={() => void handleCallNext()} />
                        {isAdmin && doctorFilter === null && (
                            <p className="text-center text-xs text-slate">Pick a doctor above to call their next patient.</p>
                        )}
                        <QueueStatsCards stats={snapshot.stats} />
                    </aside>
                </div>
            </div>

            <RejectDialog
                item={declining}
                onClose={() => setDeclining(null)}
                onSubmit={(item, reason) =>
                    run(() => rejectRequest(token, item.id, reason), `Declined ${item.patientName}`)
                }
            />
        </div>
    );
}

function FilterChip({
                        active, onClick, children,
                    }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                active ? "border-brand bg-brand text-white" : "border-mist bg-white text-ink hover:bg-cloud"
            }`}
        >
            {children}
        </button>
    );
}