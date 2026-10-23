import type { ComponentProps } from "react";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusPill } from "@/components/shared/StatusPill";
import { gradientButton } from "@/components/shared/styles";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Doctor, DoctorStatus } from "../types";

const statusView: Record<DoctorStatus, { label: string; tone: ComponentProps<typeof StatusPill>["tone"] }> = {
    PENDING_APPROVAL: { label: "Needs approval", tone: "warning" },
    ACTIVE: { label: "Active", tone: "success" },
    SUSPENDED: { label: "Suspended", tone: "danger" },
    PENDING_VERIFICATION: { label: "Email not verified", tone: "neutral" },
};

type Props = { doctor: Doctor; busy: boolean; onApprove: () => void; onSuspend: () => void };

export function DoctorCard({ doctor: d, busy, onApprove, onSuspend }: Props) {
    const view = statusView[d.status];
    return (
        <article className="rounded-2xl border border-mist bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-4">
                <InitialsAvatar name={d.fullName} />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="truncate text-lg font-semibold text-ink">{d.fullName}</h3>
                        <StatusPill tone={view.tone}>{view.label}</StatusPill>
                    </div>
                    <p className="text-sm text-slate">
                        {[d.specialization, d.licenseNumber].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate">
                        <span className="inline-flex items-center gap-1"><Mail size={12} /> {d.email}</span>
                        {d.phone && <span className="inline-flex items-center gap-1"><Phone size={12} /> {d.phone}</span>}
                        {d.createdAt && <span>Registered {timeAgo(d.createdAt)}</span>}
                    </p>
                </div>
            </div>

            {d.status !== "PENDING_VERIFICATION" && (
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                    {d.status === "PENDING_APPROVAL" && (
                        <>
                            <Button size="sm" variant="outline" disabled={busy} onClick={onSuspend}
                                    className="rounded-full border-danger/40 text-danger hover:bg-danger/5">
                                Decline
                            </Button>
                            <Button size="sm" disabled={busy} onClick={onApprove}
                                    className={cn("rounded-full", gradientButton)}>
                                Approve
                            </Button>
                        </>
                    )}
                    {d.status === "ACTIVE" && (
                        <Button size="sm" variant="outline" disabled={busy} onClick={onSuspend}
                                className="rounded-full text-slate">
                            Suspend
                        </Button>
                    )}
                    {d.status === "SUSPENDED" && (
                        <Button size="sm" variant="outline" disabled={busy} onClick={onApprove}
                                className="rounded-full text-brand">
                            Reactivate
                        </Button>
                    )}
                </div>
            )}
        </article>
    );
}