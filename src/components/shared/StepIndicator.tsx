import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradientButton } from "./styles";

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
    return (
        <div className="flex items-center gap-3" aria-label="Progress">
            {steps.map((label, i) => {
                const n = i + 1;
                const done = n < current;
                const active = n === current;
                return (
                    <div key={label} className={cn("flex items-center gap-3", i > 0 && "flex-1")}>
                        {i > 0 && <span className="h-px flex-1 bg-mist" />}
                        <span
                            aria-current={active ? "step" : undefined}
                            className={cn(
                                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                                active && gradientButton,
                                done && "bg-brand-tint text-brand",
                                !active && !done && "bg-brand-tint/70 text-slate"
                            )}
                        >
              {done ? <Check size={12} /> : <span>{n}</span>}
                            {label}
            </span>
                    </div>
                );
            })}
        </div>
    );
}