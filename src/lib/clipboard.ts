import { toast } from "sonner";

export async function copyText(text: string, successMessage: string) {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(successMessage);
    } catch {
        toast.error("Couldn't copy. Please copy it manually.");
    }
}