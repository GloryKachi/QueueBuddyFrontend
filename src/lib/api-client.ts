import { env } from "@/config/env";
import { ApiError, type ApiErrorBody } from "@/types/api";

export async function apiPost<TResponse>(path: string, body: unknown): Promise<TResponse> {
    let res: Response;
    try {
        res = await fetch(`${env.apiUrl}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    } catch {
        throw new ApiError(0, {
            code: "NETWORK_ERROR",
            message: "Can't reach the server. Check your connection and try again.",
        });
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
        throw new ApiError(
            res.status,
            (data as ApiErrorBody) ?? { code: "UNKNOWN", message: "Something went wrong." }
        );
    }
    return data as TResponse;
}