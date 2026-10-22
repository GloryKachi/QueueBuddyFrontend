import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"input"> & {
    label: string;
    error?: string;
    hint?: string;
    icon?: ReactNode;
    endAdornment?: ReactNode;
    inputClassName?: string;
};

export function FormField({
                              label, error, hint, icon, endAdornment, inputClassName, id, className, ...props
                          }: Props) {
    const fieldId = id ?? props.name;
    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={fieldId} className="text-sm font-semibold text-ink">
                {label}
            </Label>
            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-slate">
            {icon}
          </span>
                )}
                <Input
                    id={fieldId}
                    aria-invalid={!!error}
                    className={cn(
                        "h-12 rounded-full border-mist bg-white pl-11 pr-4 text-ink shadow-sm placeholder:text-slate/60",
                        endAdornment && "pr-12",
                        error && "border-danger focus-visible:ring-danger/30",
                        inputClassName
                    )}
                    {...props}
                />
                {endAdornment && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">{endAdornment}</span>
                )}
            </div>
            {error ? (
                <p className="text-sm text-danger">{error}</p>
            ) : hint ? (
                <p className="text-sm text-slate">{hint}</p>
            ) : null}
        </div>
    );
}