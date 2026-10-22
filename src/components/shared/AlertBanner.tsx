import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const styles = {
    error:   { box: "bg-[#D64545]/10 border-[#D64545]/30 text-[#D64545]", Icon: AlertCircle },
    success: { box: "bg-[#1E9E63]/10 border-[#1E9E63]/30 text-[#1E9E63]", Icon: CheckCircle2 },
    info:    { box: "bg-[#E8F1FC] border-[#1565C0]/20 text-[#0D47A1]",    Icon: Info },
};

export function AlertBanner({
                                variant = "info",
                                children,
                            }: { variant?: keyof typeof styles; children: ReactNode }) {
    const { box, Icon } = styles[variant];
    return (
        <div role="alert" className={`flex gap-2 rounded-lg border p-3 text-sm ${box}`}>
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div>{children}</div>
        </div>
    );
}