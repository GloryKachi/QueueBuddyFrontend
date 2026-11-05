import { Check, Megaphone, UserX } from "lucide-react";
import { LiveTimer } from "@/components/shared/LiveTimer";
import { Button } from "@/components/ui/button";
// import { visitTypeLabel } from "../labels";
import type { QueueItem } from "../types";

type Props = { item: QueueItem; busy: boolean; onDone: () => void; onSkip: () => void };

export function NowServingCard({ item, busy, onDone, onSkip }: Props) {
    return (
        <div className="rounded-2xl border border-brand bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
          <Megaphone size={16} /> Now serving
        </span>
                <span className="rounded-full bg-brand-tint px-3 py-1 text-sm text-brand">
          <LiveTimer since={item.calledAt} />
        </span>
            </div>

            <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-2xl font-bold leading-tight text-ink">{item.patientName}</h3>
          {/*          <span className="mt-2 inline-block rounded-full bg-cloud px-3 py-1 text-xs font-semibold text-slate">*/}
          {/*  {visitTypeLabel[item.visitType]}*/}
          {/*</span>*/}
                    <p className="mt-3 text-xs text-slate">
                        {item.maskedPhone ?? "No phone number"}
                        {item.servedByName && ` · ${item.servedByName}`}
                    </p>
                </div>
                <span className="text-6xl font-extrabold leading-none text-brand">#{item.ticketNumber ?? ""}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={busy} onClick={onDone}
                        className="h-11 rounded-full border-brand text-brand">
                    <Check size={16} className="mr-2" /> Done
                </Button>
                <Button variant="outline" disabled={busy} onClick={onSkip}
                        className="h-11 rounded-full text-slate">
                    <UserX size={16} className="mr-2" /> Skip / No-show
                </Button>
            </div>
        </div>
    );
}