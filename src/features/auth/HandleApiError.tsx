import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/types/api";

export function handleRegistrationError<T extends FieldValues>(
    err: unknown,
    setError: UseFormSetError<T>,
    opts: { onEmailTaken: () => void }
) {
    if (!(err instanceof ApiError)) {
        toast.error("Something went wrong. Please try again.");
        return;
    }
    switch (err.code) {
        case "EMAIL_TAKEN":
            opts.onEmailTaken();
            return;
        case "PHONE_TAKEN":
            setError("phone" as Path<T>, { message: "This phone number is already registered." });
            return;
        case "CLINIC_NOT_FOUND":
            setError("clinicCode" as Path<T>, { message: "We can't find a clinic with that code." });
            return;
    }
    const entries = Object.entries(err.fieldErrors ?? {});
    if (entries.length > 0) {
        entries.forEach(([field, message]) => setError(field as Path<T>, { message }));
        return;
    }
    toast.error(err.message);
}