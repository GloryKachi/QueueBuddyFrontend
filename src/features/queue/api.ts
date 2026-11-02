import { apiGet, apiPost } from "@/lib/api-client";
import type { MyQueue, QueueSnapshot, VisitType } from "./types";

// ----- staff -----
export const getQueue = (token: string) =>
    apiGet<QueueSnapshot>("/api/queue", { token });

export const callNext = (token: string) =>
    apiPost<QueueSnapshot>("/api/queue/call-next", {}, { token });

const entryAction = (action: string) => (token: string, id: number) =>
    apiPost<QueueSnapshot>(`/api/queue/entries/${id}/${action}`, {}, { token });

export const acceptRequest = entryAction("accept");
export const completeEntry = entryAction("complete");
export const skipEntry = entryAction("skip");
export const cancelEntry = entryAction("cancel");
export const notifyEntry = entryAction("notify");

export const rejectRequest = (token: string, id: number, reason: string) =>
    apiPost<QueueSnapshot>(`/api/queue/entries/${id}/reject`, { reason }, { token });

// ----- patient -----
export const getMyQueue = (token: string) =>
    apiGet<MyQueue>("/api/me/queue", { token });

export const requestToJoin = (token: string, visitType: VisitType) =>
    apiPost<MyQueue>("/api/me/queue/request", { visitType }, { token });

export const cancelMyPlace = (token: string) =>
    apiPost<MyQueue>("/api/me/queue/cancel", {}, { token });