"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QueueApiError } from "../queueApi";

export function usePoll<T>(fetcher: () => Promise<T>, intervalMs = 5000) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [offline, setOffline] = useState(false);
    const fetcherRef = useRef(fetcher);

    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    const refresh = useCallback(async () => {
        try {
            const next = await fetcherRef.current();
            setData(next);
            setError(null);
            setOffline(false);
        } catch (err) {
            if (err instanceof QueueApiError && err.code === "NETWORK_ERROR") setOffline(true);
            else setError(err instanceof Error ? err.message : "Something went wrong.");
        }
    }, []);

    useEffect(() => {
        void refresh();
        const id = window.setInterval(() => {
            if (document.visibilityState === "visible") void refresh();
        }, intervalMs);
        return () => window.clearInterval(id);
    }, [refresh, intervalMs]);

    return { data, setData, error, offline, refresh };
}