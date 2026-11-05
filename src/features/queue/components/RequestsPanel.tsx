"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { doctorLabel } from "../doctor";
import type { DoctorOption, QueueItem } from "../types";

type Props = {
    requests: QueueItem[];
    doctors: DoctorOption[];
    isAdmin: boolean;
    busy: boolean;
    onAccept: (item: QueueItem, doctorId: number | null) => void;
    onDecline: (item: QueueItem) => void;
};

export function RequestsPanel({ requests, doctors, isAdmin, busy, onAccept, onDecline }: Props) {
    const [choice, setChoice] = useState<Record<number, number | "">>({});
    if (requests.length === 0) return null;

    return (
        <section className="rounded-2xl border border-brand/20 bg-brand-tint p-4">
            <h2 className="text-sm font-semibold text-ink">Join requests ({requests.length})</h2>
            <ul className="mt-3 space-y-3">
                {requests.map((item) => {
                    const selected: number | "" = choice[item.id] ?? item.preferredDoctorId ?? "";
                    const missing = isAdmin && selected === "";
                    return (
                        <li key={item.id} className="rounded-xl bg-white p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-ink">{item.patientName}</p>
                                    <p className="text-xs text-slate">
                                        {item.maskedPhone} · {item.waitingMinutes > 0 ? `${item.waitingMinutes} min ago` : "just now"}
                                        {item.preferredDoctorName ? ` · prefers ${doctorLabel(item.preferredDoctorName)}` : ""}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {isAdmin && (
                                    <select
                                        aria-label={`Doctor for ${item.patientName}`}
                                        value={selected}
                                        disabled={busy}
                                        onChange={(e) =>
                                            setChoice((c) => ({
                                                ...c,
                                                [item.id]: e.target.value === "" ? "" : Number(e.target.value),
                                            }))
                                        }
                                        className="min-w-0 flex-1 rounded-lg border border-mist bg-white px-3 py-2 text-sm text-ink"
                                    >
                                        <option value="">Choose a doctor…</option>
                                        {doctors.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {doctorLabel(d.name)}
                                                {d.specialization ? ` · ${d.specialization}` : ""} ({d.onDuty ? "on duty" : "off duty"})
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <button
                                    type="button"
                                    disabled={busy || missing}
                                    onClick={() => onAccept(item, isAdmin ? Number(selected) : null)}
                                    className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#4FB6FF] to-[#0B5CAB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                >
                                    <Check size={14} /> Accept
                                </button>
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => onDecline(item)}
                                    className="flex items-center gap-1.5 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-cloud disabled:opacity-50"
                                >
                                    <X size={14} /> Decline
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}