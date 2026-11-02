"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/Modal";
import type { QueueItem } from "../types";

const PRESETS = [
    "The clinic is closed for today.",
    "No doctor is available right now.",
    "Please book an appointment first.",
];

type Props = {
    item: QueueItem | null;
    onClose: () => void;
    onSubmit: (item: QueueItem, reason: string) => Promise<boolean>;
};

export function RejectDialog({ item, onClose, onSubmit }: Props) {
    return (
        <Modal open={!!item} onClose={onClose} title="Decline request">
            {item && <RejectForm key={item.id} item={item} onClose={onClose} onSubmit={onSubmit} />}
        </Modal>
    );
}

function RejectForm({ item, onClose, onSubmit }: { item: QueueItem } & Omit<Props, "item">) {
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const valid = reason.trim().length >= 3;

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!valid) return;
        setSubmitting(true);
        const ok = await onSubmit(item, reason.trim());
        setSubmitting(false);
        if (ok) onClose();
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-slate">
                Tell <span className="font-semibold text-ink">{item.patientName}</span> why. They&apos;ll see this note.
            </p>

            <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => setReason(p)}
                        className="rounded-full border border-mist px-3 py-1.5 text-xs text-slate hover:bg-brand-tint hover:text-brand"
                    >
                        {p}
                    </button>
                ))}
            </div>

            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={200}
                rows={3}
                placeholder="Write a short reason…"
                className="w-full rounded-2xl border border-mist bg-white p-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!valid || submitting}
                        className="rounded-full bg-danger text-white hover:bg-danger/90">
                    Decline request
                </Button>
            </div>
        </form>
    );
}