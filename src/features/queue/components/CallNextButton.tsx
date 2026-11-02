import { ArrowRight } from "lucide-react";
import { gradientButton } from "@/components/shared/styles";
import { cn } from "@/lib/utils";

type Props = {
    next: { patientName: string; ticketNumber: number | null } | undefined;
    disabled: boolean;
    onClick: () => void;
};

// @ts-ignore
export function CallNextButton({ next, disabled, onClick }: Props) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={cn(
                gradientButton,
                "flex w-full items-center gap-4 rounded-full p-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
            )}
        >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
        <ArrowRight size={20} />
      </span>
            <span className="min-w-0 flex-1">
        <span className="block text-lg">Call next patient</span>
        <span className="block truncate text-xs font-normal opacity-90">
          {next
              ? `Advances to ${next.patientName} (#${next.ticketNumber}) & notifies them`
              : "Nobody is waiting"}
        </span>
      </span>
            <kbd className="hidden shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold sm:block">
                Press N
            </kbd>
        </button>
    );
}