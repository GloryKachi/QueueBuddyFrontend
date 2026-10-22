export const NG_PHONE_REGEX = /^(?:\+234|234|0)[789][01]\d{8}$/;
export const NG_PHONE_MESSAGE = "Enter a valid Nigerian number, e.g. 803 123 4567";

export const cleanPhone = (v: string) => v.replace(/[\s()-]/g, "");

/** "0803…", "803…", "234803…" or "+234803…" → "+234803…" */
export function toNgPhone(v: string): string {
    const c = cleanPhone(v);
    if (c.startsWith("+234")) return c;
    if (c.startsWith("234")) return `+${c}`;
    if (c.startsWith("0")) return `+234${c.slice(1)}`;
    return `+234${c}`;
}
