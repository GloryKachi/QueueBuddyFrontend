import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
    brand: "bg-brand text-white",
    soft: "bg-brand-tint text-brand",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-[#B26B00]",
    danger: "bg-danger/10 text-danger",
    neutral: "border border-mist text-slate",
};

export type PillTone = keyof typeof tones;

export function StatusPill({ tone = "neutral", children }: { tone?: PillTone; children: ReactNode }) {
    return (
        <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
    );
}