"use client";

type Props = { onDuty: boolean; busy: boolean; onToggle: () => void };

export function DutyToggle({ onDuty, busy, onToggle }: Props) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={onDuty}
            disabled={busy}
            onClick={onToggle}
            className="flex items-center gap-3 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
        >
      <span className={`relative h-6 w-11 rounded-full transition-colors ${onDuty ? "bg-success" : "bg-mist"}`}>
        <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                onDuty ? "left-[22px]" : "left-0.5"
            }`}
        />
      </span>
            {onDuty ? "On duty" : "Off duty"}
        </button>
    );
}