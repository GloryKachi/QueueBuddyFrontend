import type { MyQueue, QueueSnapshot } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class QueueApiError extends Error {
    code: string;
    constructor(message: string, code = "ERROR") {
        super(message);
        this.name = "QueueApiError";
        this.code = code;
    }
}

async function request<T>(
    method: "GET" | "POST" | "PUT",
    path: string,
    token: string,
    body?: unknown,
): Promise<T> {
    let res: Response;
    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
            cache: "no-store",
        });
    } catch {
        throw new QueueApiError("Can't reach the server. Check your connection.", "NETWORK_ERROR");
    }

    if (!res.ok) {
        let message = "Something went wrong. Please try again.";
        let code = "ERROR";
        try {
            const data = await res.json();
            if (data?.message) message = data.message;
            if (data?.code) code = data.code;
        } catch {
            /* no JSON body */
        }
        throw new QueueApiError(message, code);
    }
    return (await res.json()) as T;
}

// ---- staff ----
export const getQueue = (token: string) => request<QueueSnapshot>("GET", "/api/queue", token);

export const acceptRequest = (token: string, id: number, doctorId: number | null) =>
    request<QueueSnapshot>("POST", `/api/queue/entries/${id}/accept`, token, { doctorId });

export const rejectRequest = (token: string, id: number, reason: string) =>
    request<QueueSnapshot>("POST", `/api/queue/entries/${id}/reject`, token, { reason });

export const assignDoctor = (token: string, id: number, doctorId: number) =>
    request<QueueSnapshot>("POST", `/api/queue/entries/${id}/assign`, token, { doctorId });

export const completeEntry = (token: string, id: number) =>
    request<QueueSnapshot>("POST", `/api/queue/entries/${id}/complete`, token);

export const skipEntry = (token: string, id: number) =>
    request<QueueSnapshot>("POST", `/api/queue/entries/${id}/skip`, token);

export const cancelEntry = (token: string, id: number) =>
    request<QueueSnapshot>("POST", `/api/queue/entries/${id}/cancel`, token);

export const notifyEntry = (token: string, id: number) =>
    request<QueueSnapshot>("POST", `/api/queue/entries/${id}/notify`, token);

export const callNext = (token: string, doctorId?: number) =>
    request<QueueSnapshot>(
        "POST",
        `/api/queue/call-next${doctorId ? `?doctorId=${doctorId}` : ""}`,
        token,
    );

export const setDuty = (token: string, onDuty: boolean) =>
    request<{ onDuty: boolean }>("PUT", "/api/doctor/duty", token, { onDuty });

// ---- patient ----
export const getMyQueue = (token: string) => request<MyQueue>("GET", "/api/me/queue", token);

export const requestToJoin = (token: string, doctorId: number | null) =>
    request<MyQueue>("POST", "/api/me/queue/request", token, { doctorId });

export const cancelMyPlace = (token: string) =>
    request<MyQueue>("POST", "/api/me/queue/cancel", token);