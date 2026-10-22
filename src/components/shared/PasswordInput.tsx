"use client";
import { useState, type ComponentProps } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { FormField } from "./FormField";

type Props = Omit<ComponentProps<typeof FormField>, "type" | "icon" | "endAdornment">;

export function PasswordInput(props: Props) {
    const [show, setShow] = useState(false);
    return (
        <FormField
            autoComplete="new-password"
            {...props}
            type={show ? "text" : "password"}
            icon={<Lock size={16} />}
            endAdornment={
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="text-slate hover:text-ink"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            }
        />
    );
}