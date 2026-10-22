import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ label, className }: { label?: string; className?: string }) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-2.5 rounded-2xl bg-white/90 px-4 py-2.5 shadow-md backdrop-blur",
                className
            )}
        >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#4FB6FF] to-[#1565C0] text-white">
        <MessageSquare size={16} />
      </span>
            <span className="font-bold text-ink">QueueBuddy</span>
            {label && <span className="text-[10px] font-semibold tracking-wider text-brand">{label}</span>}
        </div>
    );
}