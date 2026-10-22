import type { ComponentProps } from "react";
import { FormField } from "./FormField";

type Props = Omit<ComponentProps<typeof FormField>, "type" | "icon" | "inputClassName">;

export function PhoneInput(props: Props) {
    return (
        <FormField
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="803 123 4567"
            {...props}
            type="tel"
            icon={
                <>
                    <span aria-hidden>🇳🇬</span>
                    <span className="text-sm font-medium text-ink">+234</span>
                    <span className="h-4 w-px bg-mist" />
                </>
            }
            inputClassName="pl-[5.75rem]"
        />
    );
}