"use client";

import { useEffect, useState } from "react";

export function LiveTimer({ since }: { since: string | null }) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!since) return null;
    const total = Math.max(0, Math.floor((now - new Date(since).getTime()) / 1000));
    const mm = String(Math.floor(total / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return <span className="font-mono tabular-nums">{mm}:{ss}</span>;
}