"use client";

import { useEffect, useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type MenuItem = { label: string; onSelect: () => void; danger?: boolean };

export function RowMenu({ items, disabled }: { items: MenuItem[]; disabled?: boolean }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-label="More actions"
                aria-expanded={open}
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className="rounded-full p-2 text-slate hover:bg-cloud hover:text-ink disabled:opacity-50"
            >
                <EllipsisVertical size={18} />
            </button>
            {open && (
                <ul className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-mist bg-white p-1 shadow-lg">
                    {items.map((item) => (
                        <li key={item.label}>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    item.onSelect();
                                }}
                                className={cn(
                                    "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-cloud",
                                    item.danger ? "text-danger" : "text-ink"
                                )}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}