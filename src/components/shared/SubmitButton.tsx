import type { ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { gradientButton } from "./styles";

type Props = ComponentProps<typeof Button> & { loading?: boolean };

export function SubmitButton({ loading, children, disabled, className, ...props }: Props) {
    return (
        <Button
            type="submit"
            disabled={loading || disabled}
            className={cn("h-12 w-full rounded-full text-base", gradientButton, className)}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </Button>
    );
}