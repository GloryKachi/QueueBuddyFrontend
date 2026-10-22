import { MessageCircle, MousePointerClick, Smartphone, Users } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const points = [
    { icon: Smartphone, text: "No app for patients to install" },
    { icon: MessageCircle, text: "WhatsApp updates sent automatically" },
    { icon: MousePointerClick, text: "Run it in a few taps" },
];

export function ClinicShowcase() {
    return (
        <>
            <Logo label="CLINIC SUITE" className="absolute left-5 top-5" />

            <div className="absolute left-5 top-[28%] flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm shadow-md backdrop-blur">
                <Users size={16} className="text-brand" />
                <span className="font-semibold text-ink">Waiting 6</span>
                <span className="text-slate">· Avg consult 14 min</span>
            </div>

            <ul className="absolute inset-x-5 bottom-5 space-y-3 rounded-2xl bg-white/80 p-4 backdrop-blur-md">
                {points.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm font-medium text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand shadow-sm">
              <Icon size={16} />
            </span>
                        {text}
                    </li>
                ))}
            </ul>
        </>
    );
}