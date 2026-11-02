import { Clock, Timer, Users, type LucideIcon } from "lucide-react";
import type { QueueStats } from "../types";

function Stat({ icon: Icon, label, value, unit }: { icon: LucideIcon; label: string; value: number; unit?: string }) {
    return (
        <div className="rounded-2xl border border-mist bg-white p-4 shadow-sm">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint text-brand">
        <Icon size={16} />
      </span>
            <p className="mt-3 text-xs font-medium text-slate">{label}</p>
            <p className="text-2xl font-bold text-ink">
                {value}
                {unit && <span className="ml-1 text-sm font-medium text-slate">{unit}</span>}
            </p>
        </div>
    );
}

export function QueueStatsCards({ stats }: { stats: QueueStats }) {
    return (
        <div className="grid grid-cols-3 gap-3">
            <Stat icon={Users} label="Waiting" value={stats.waiting} />
            <Stat icon={Clock} label="Avg consult" value={stats.avgConsultMinutes} unit="min" />
            <Stat icon={Timer} label="Longest wait" value={stats.longestWaitMinutes} unit="min" />
        </div>
    );
}