export function doctorLabel(name: string | null | undefined): string {
    if (!name) return "a doctor";
    return /^dr\.?\s/i.test(name) ? name : `Dr ${name}`;
}