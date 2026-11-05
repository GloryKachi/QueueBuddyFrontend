"use client";

import { Check } from "lucide-react";
import { doctorLabel } from "../doctor";
import type { DoctorOption } from "../types";

type Props = {
    doctors: DoctorOption[];
    value: number | null;
    onChange?: (id: number | null) => void;
    readOnly?: boolean;
    disabled?: boolean;
};

export function DoctorPicker({ doctors, value, onChange, readOnly = false, disabled = false }: Props) {
    if (doctors.length === 0) {
        return <p className="text-sm text-slate">No doctors have joined this clinic yet.</p>;
    }
    const anyOnDuty = doctors.some((d) => d.onDuty);

    return (
        <div className="space-y-2">
            {!readOnly && (
                <Row
                    selected={value === null}
                    selectable={!disabled && anyOnDuty}
                    title="Any available doctor"
                    subtitle="The front desk will choose a doctor for you"
                    onClick={() => onChange?.(null)}
                />
            )}
            {doctors.map((d) => (
                <Row
                    key={d.id}
                    selected={!readOnly && value === d.id}
                    selectable={!readOnly && !disabled && d.onDuty}
                    dim={!d.onDuty}
                    readOnly={readOnly}
                    title={doctorLabel(d.name)}
                    subtitle={d.specialization ?? "General practice"}
                    badge={d.onDuty ? "On duty" : "Off duty"}
                    badgeOn={d.onDuty}
                    extra={d.onDuty ? `${d.waiting} waiting` : undefined}
                    onClick={() => onChange?.(d.id)}
                />
            ))}
        </div>
    );
}

type RowProps = {
    selected: boolean;
    selectable: boolean;
    title: string;
    subtitle: string;
    badge?: string;
    badgeOn?: boolean;
    extra?: string;
    dim?: boolean;
    readOnly?: boolean;
    onClick: () => void;
};

function Row({ selected, selectable, title, subtitle, badge, badgeOn, extra, dim, readOnly, onClick }: RowProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={readOnly || !selectable}
            aria-pressed={selected}
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                selected ? "border-brand bg-brand-tint" : "border-mist bg-white"
            } ${dim ? "opacity-60" : ""} ${selectable ? "hover:border-brand" : "cursor-default"}`}
        >
      <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              selected ? "border-brand bg-brand text-white" : "border-mist"
          }`}
      >
        {selected && <Check size={12} />}
      </span>
            <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">{title}</span>
        <span className="block truncate text-xs text-slate">{subtitle}</span>
      </span>
            {extra && <span className="text-xs text-slate">{extra}</span>}
            {badge && (
                <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        badgeOn ? "bg-success/15 text-success" : "bg-cloud text-slate"
                    }`}
                >
          {badge}
        </span>
            )}
        </button>
    );
}