import { Bell } from "lucide-react";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { gradientButton } from "@/components/shared/styles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { visitTypeLabel } from "../labels";
import type { QueueItem } from "../types";

type Props = {
    requests: QueueItem[];
    busy: boolean;
    onAccept: (item: QueueItem) => void;
    onDecline: (item: QueueItem) => void;
};

export function RequestsPanel({ requests, busy, onAccept, onDecline }: Props) {
    if (requests.length === 0) return null;

    return (
        <section className="rounded-2xl border border-brand bg-brand-tint/50 p-4 sm:p-5">
            <div className="flex items-center gap-2">
                <Bell size={18} className="text-brand" />
                <h2 className="font-bold text-ink">Join requests</h2>
                <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-white">
          {requests.length}
        </span>
            </div>

            <div className="mt-3 space-y-2">
                {requests.map((item) => (
                    <article
                        key={item.id}
                        className="flex flex-wrap items-center gap-3 rounded-xl border border-mist bg-white p-3"
                    >
                        <InitialsAvatar name={item.patientName} className="h-10 w-10" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-ink">{item.patientName}</p>
                            <p className="text-xs text-slate">
                                {item.maskedPhone ? `${item.maskedPhone} · ` : ""}
                                {visitTypeLabel[item.visitType]} ·{" "}
                                {item.waitingMinutes === 0 ? "just now" : `${item.waitingMinutes} min ago`}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" disabled={busy} onClick={() => onDecline(item)}
                                    className="rounded-full border-danger/40 text-danger hover:bg-danger/5">
                                Decline
                            </Button>
                            <Button size="sm" disabled={busy} onClick={() => onAccept(item)}
                                    className={cn("rounded-full", gradientButton)}>
                                Accept
                            </Button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}