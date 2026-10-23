export function timeAgo(iso: string): string {
    const ms = Date.now() - new Date(iso).getTime();
    if (Number.isNaN(ms)) return "";
    const seconds = Math.max(0, Math.floor(ms / 1000));
    const units: [number, string][] = [[86400, "day"], [3600, "hour"], [60, "minute"]];
    for (const [size, name] of units) {
        if (seconds >= size) {
            const n = Math.floor(seconds / size);
            return `${n} ${name}${n > 1 ? "s" : ""} ago`;
        }
    }
    return "just now";
}