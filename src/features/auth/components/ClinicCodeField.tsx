import type { ComponentProps } from "react";
import { KeyRound } from "lucide-react";
import { FormField } from "@/components/shared/FormField";

type Props = Omit<ComponentProps<typeof FormField>, "label" | "icon">;

export function ClinicCodeField(props: Props) {
    return (
        <FormField
            label="Clinic code"
            placeholder="e.g. RGTK9K"
            maxLength={6}
            autoCapitalize="characters"
            autoComplete="off"
            hint="Ask the clinic's front desk for this 6-character code"
            icon={<KeyRound size={16} />}
            inputClassName="font-mono uppercase tracking-widest"
            {...props}
        />
    );
}