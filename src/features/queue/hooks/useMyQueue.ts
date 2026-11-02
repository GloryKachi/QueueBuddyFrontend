"use client";

import { usePolling } from "@/hooks/usePolling";
import { getMyQueue } from "../api";
import type { MyQueue } from "../types";

export function useMyQueue(token: string) {
    const { data, setData, error, offline } = usePolling<MyQueue>(() => getMyQueue(token));
    return { data, setData, error, offline };
}