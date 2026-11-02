"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { useSession } from "@/features/auth/components/SessionProvider";
import { ApiError } from "@/types/api";
import {
    acceptRequest, callNext, cancelEntry, completeEntry,
    notifyEntry, rejectRequest, skipEntry,
} from "../api";
import { useQueue } from "../hooks/useQueue";
import type { QueueItem, QueueSnapshot } from "../types";
import { CallNextButton } from "./CallNextButton";
import { NowServingCard } from "./NowServingCard";
import { QueueRow } from "./QueueRow";
import { QueueStatsCards } from "./QueueStatsCards";
import { RejectDialog } from "./RejectDialog";
import { RequestsPanel } from "./RequestsPanel";

export function QueueView() {
    const { token } = useSession();
    const { snapshot, setSnapshot, error, offline } = useQueue(token);
    const [busy, setBusy] = useState(false);
    const [declining, setDeclining] = useState<QueueItem | null>(null);
    const seenRequests = useRef<Set<number> | null>(null);

    const nextUp = snapshot?.waiting[0];
    const canCall = !!nextUp && !busy && !offline;

    async function run(action: () => Promise<QueueSnapshot>, success?: string): Promise<boolean> {
        setBusy(true);
        try {
            setSnapshot(await action());
            if (success) toast.success(success);
            return true;
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
            return false;
        } finally {
            setBusy(false);
        }
    }

    const handleCallNext = () =>
        run(() => callNext(token), nextUp ? `Called ${nextUp.patientName}` : undefined);

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
        return <Loader2 className="mx-auto mt-24 h-8 w-8 animate-spin text-brand" />;
    }

    const dateLabel = new Date(`${snapshot.date}T00:00:00`).toLocaleDateString("en-NG", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

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

            <div>
                <h1 className="text-3xl font-bold tracking-tight text-ink">
                    Waiting <span className="text-slate">({snapshot.stats.waiting})</span>
                </h1>
                <p className="text-sm text-slate">{dateLabel}</p>
            </div>

            <div className="mt-6 space-y-6">
                <RequestsPanel
                    requests={snapshot.requests}
                    busy={busy || offline}
                    onAccept={(item) =>
                        void run(() => acceptRequest(token, item.id), `${item.patientName} added to the queue`)
                    }
                    onDecline={setDeclining}
                />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="space-y-3">
                        {snapshot.waiting.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-mist bg-white p-10 text-center text-slate">
                                Nobody is waiting. Patients join by requesting a place from their account, and you&apos;ll see
                                their request above.
                            </div>
                        ) : (
                            snapshot.waiting.map((item) => (
                                <QueueRow
                                    key={item.id}
                                    item={item}
                                    busy={busy || offline}
                                    onNotify={() => void run(() => notifyEntry(token, item.id), `Notified ${item.patientName}`)}
                                    onSkip={() => skip(item)}
                                    onRemove={() =>
                                        confirmThen(`Remove ${item.patientName} from the queue?`,
                                            () => cancelEntry(token, item.id), "Removed from the queue")
                                    }
                                />
                            ))
                        )}
                    </section>

                    <aside className="space-y-4">
                        {snapshot.serving.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-mist bg-white p-6 text-center text-slate">
                                <p className="text-xs font-semibold uppercase tracking-wider">Now serving</p>
                                <p className="mt-2">Nobody is being served.</p>
                            </div>
                        ) : (
                            snapshot.serving.map((item) => (
                                <NowServingCard
                                    key={item.id}
                                    item={item}
                                    busy={busy || offline}
                                    onDone={() => void run(() => completeEntry(token, item.id), `${item.patientName} is done`)}
                                    onSkip={() => skip(item)}
                                />
                            ))
                        )}

                        <CallNextButton next={nextUp} disabled={!canCall} onClick={() => void handleCallNext()} />
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