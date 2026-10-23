import { cn } from "@/lib/utils";

export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
    const initials = name
        .replace(/^(dr|mr|mrs|ms)\.?\s+/i, "")
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
    return (
        <span
            aria-hidden
            className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-bold text-brand",
                className
            )}
        >
      {initials}
    </span>
    );
}