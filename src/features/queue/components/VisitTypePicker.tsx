import { cn } from "@/lib/utils";
import { visitTypes } from "../labels";
import type { VisitType } from "../types";

export function VisitTypePicker({ value, onChange }: { value: VisitType; onChange: (v: VisitType) => void }) {
    return (
        <div className="flex flex-wrap gap-2">
            {visitTypes.map((t) => (
                <button
                    key={t.value}
                    type="button"
                    aria-pressed={value === t.value}
                    onClick={() => onChange(t.value)}
                    className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium",
                        value === t.value
                            ? "bg-brand text-white"
                            : "border border-mist bg-white text-slate hover:text-ink"
                    )}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}