import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export type ShowcaseConfig = {
    label: string;
    pill: { icon: LucideIcon; strong: string; rest: string };
    points: { icon: LucideIcon; text: string }[];
};

export function AuthShowcase({ label, pill, points }: ShowcaseConfig) {
    const PillIcon = pill.icon;
    return (
        <>
            <Logo label={label} className="absolute left-5 top-5" />

            <div className="absolute left-5 top-[28%] flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm shadow-md backdrop-blur">
                <PillIcon size={16} className="text-brand" />
                <span className="font-semibold text-ink">{pill.strong}</span>
                <span className="text-slate">{pill.rest}</span>
            </div>

            <ul className="absolute inset-x-5 bottom-5 space-y-3 rounded-2xl bg-white/80 p-4 backdrop-blur-md">
                {points.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm font-medium text-ink">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm">
              <Icon size={16} />
            </span>
                        {text}
                    </li>
                ))}
            </ul>
        </>
    );
}