const KEY = "qb_token";

export function getToken(): string | null {
    try { return localStorage.getItem(KEY); } catch { return null; }
}
export function setToken(token: string) {
    try { localStorage.setItem(KEY, token); } catch { /* storage blocked */ }
}
export function clearToken() {
    try { localStorage.removeItem(KEY); } catch { /* storage blocked */ }
}