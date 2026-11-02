import { Clock } from "lucide-react";
import { RowMenu, type MenuItem } from "@/components/shared/RowMenu";
import { StatusPill, type PillTone } from "@/components/shared/StatusPill";
import { cn } from "@/lib/utils";
import { visitTypeLabel } from "../labels";
import type { DisplayStatus, QueueItem } from "../types";

const statusView: Partial<Record<DisplayStatus, { label: string; tone: PillTone }>> = {
    NEXT: { label: "Next", tone: "brand" },
    NOTIFIED: { label: "Notified", tone: "soft" },
    LATE: { label: "Late", tone: "late" },
    WAITING: { label: "Waiting", tone: "neutral" },
    SERVING: { label: "Serving", tone: "brand" },
};

type Props = {
    item: QueueItem;
    busy: boolean;
    onNotify: () => void;
    onSkip: () => void;
    onRemove: () => void;
};

export function QueueRow({ item, busy, onNotify, onSkip, onRemove }: Props) {
    const view = statusView[item.displayStatus] ?? { label: item.displayStatus, tone: "neutral" as PillTone };
    const menu: MenuItem[] = [
        { label: "Notify to come to desk", onSelect: onNotify },
        { label: "Skip / no-show", onSelect: onSkip },
        { label: "Remove from queue", onSelect: onRemove, danger: true },
    ];

    return (
        <article
            className={cn(
                "flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm sm:gap-4 sm:p-4",
                item.displayStatus === "NEXT" ? "border-brand ring-1 ring-brand/20" : "border-mist"
            )}
        >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-tint font-bold text-brand">
          {item.ticketNumber ?? "–"}
      </span>
            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{item.patientName}</p>
                <p className="text-xs text-slate">{item.maskedPhone ?? "No phone number"}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate sm:hidden">
                    <Clock size={12} /> Waiting {item.waitingMinutes} min
                </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
        <span className="rounded-full bg-cloud px-3 py-1 text-xs font-semibold text-slate">
          {visitTypeLabel[item.visitType]}
        </span>
                <span className="flex items-center gap-1 whitespace-nowrap text-sm text-slate">
          <Clock size={14} /> Waiting {item.waitingMinutes} min
        </span>
            </div>

            <StatusPill tone={view.tone}>{view.label}</StatusPill>
            <RowMenu items={menu} disabled={busy} />
        </article>
    );
}