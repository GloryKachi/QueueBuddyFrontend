"use client";

import { doctorLabel } from "../doctor";
import type { DoctorOption, QueueItem } from "../types";

const PILL: Record<string, { label: string; className: string }> = {
    NEXT: { label: "Next", className: "bg-brand-tint text-brand" },
    NOTIFIED: { label: "Notified", className: "bg-warning/15 text-warning" },
    LATE: { label: "Late", className: "bg-danger/10 text-danger" },
    WAITING: { label: "Waiting", className: "bg-cloud text-slate" },
};

const BTN =
    "rounded-full border border-mist px-3 py-1.5 text-sm font-medium text-ink hover:bg-cloud disabled:opacity-50";

type Props = {
    item: QueueItem;
    doctors: DoctorOption[];
    canAssign: boolean;
    busy: boolean;
    onNotify: () => void;
    onSkip: () => void;
    onRemove: () => void;
    onAssign: (doctorId: number) => void;
};

export function QueueRow({ item, doctors, canAssign, busy, onNotify, onSkip, onRemove, onAssign }: Props) {
    const pill = PILL[item.displayStatus] ?? PILL.WAITING;

    return (
        <article className="rounded-2xl border border-mist bg-white p-4">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-lg font-bold text-brand">
                    {item.ticketNumber ?? "–"}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-ink">{item.patientName}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pill.className}`}>
              {pill.label}
            </span>
                    </div>
                    <p className="text-sm text-slate">
                        {item.maskedPhone} · waiting {item.waitingMinutes} min
                        {item.doctorName ? ` · ${doctorLabel(item.doctorName)}` : ""}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                {canAssign && doctors.length > 1 && (
                    <select
                        aria-label={`Doctor for ${item.patientName}`}
                        value={item.doctorId ?? ""}
                        disabled={busy}
                        onChange={(e) => onAssign(Number(e.target.value))}
                        className="rounded-lg border border-mist bg-white px-3 py-1.5 text-sm text-ink"
                    >
                        {item.doctorId === null && <option value="">Assign a doctor…</option>}
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>
                                {doctorLabel(d.name)}
                            </option>
                        ))}
                    </select>
                )}
                <button type="button" className={BTN} disabled={busy} onClick={onNotify}>Notify</button>
                <button type="button" className={BTN} disabled={busy} onClick={onSkip}>No-show</button>
                <button type="button" className={BTN} disabled={busy} onClick={onRemove}>Remove</button>
            </div>
        </article>
    );
}