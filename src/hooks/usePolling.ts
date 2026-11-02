"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/types/api";

export function usePolling<T>(fetcher: () => Promise<T>, intervalMs = 5000) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [offline, setOffline] = useState(false);

    const fetcherRef = useRef(fetcher);
    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    const refresh = useCallback(async () => {
        try {
            setData(await fetcherRef.current());
            setOffline(false);
            setError(null);
        } catch (err) {
            if (err instanceof ApiError && err.code === "NETWORK_ERROR") setOffline(true);
            else setError(err instanceof ApiError ? err.message : "Couldn't load this page.");
        }
    }, []);

    useEffect(() => {
        void refresh();
        const id = setInterval(() => void refresh(), intervalMs);
        return () => clearInterval(id);
    }, [refresh, intervalMs]);

    return { data, setData, error, offline, refresh };
}