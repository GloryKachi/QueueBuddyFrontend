import { env } from "@/config/env";
import { ApiError, type ApiErrorBody } from "@/types/api";

type Options = { token?: string };

async function request<T>(
    method: "GET" | "POST",
    path: string,
    body?: unknown,
    opts: Options = {}
): Promise<T> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

    let res: Response;
    try {
        res = await fetch(`${env.apiUrl}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
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
            (data as ApiErrorBody) ?? {
                code: res.status === 401 ? "UNAUTHORIZED" : "UNKNOWN",
                message: res.status === 401 ? "Please sign in again." : "Something went wrong.",
            }
        );
    }
    return data as T;
}

export const apiPost = <T>(path: string, body: unknown, opts?: Options) =>
    request<T>("POST", path, body, opts);

export const apiGet = <T>(path: string, opts?: Options) =>
    request<T>("GET", path, undefined, opts);