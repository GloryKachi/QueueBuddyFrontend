"use client";

import { usePolling } from "@/hooks/usePolling";
import { getQueue } from "../api";
import type { QueueSnapshot } from "../types";

export function useQueue(token: string) {
    const { data, setData, error, offline } = usePolling<QueueSnapshot>(() => getQueue(token));
    return { snapshot: data, setSnapshot: setData, error, offline };
}