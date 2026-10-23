"use client";

import { Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard";

export function ClinicCodeCard({ code }: { code: string }) {
    const link = (role: "doctor" | "patient") =>
        `${window.location.origin}/register/${role}?clinic=${code}`;

    return (
        <div className="rounded-2xl border border-mist bg-white p-6 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate">Your clinic code</p>
            <p className="mt-3 font-mono text-4xl font-bold tracking-[0.2em] text-brand">{code}</p>
            <p className="mt-2 text-sm text-slate">Doctors and patients need this to join your clinic.</p>

            <div className="mt-5 space-y-2">
                <Button variant="outline" className="h-10 w-full rounded-full"
                        onClick={() => copyText(code, "Clinic code copied")}>
                    <Copy size={14} className="mr-2" /> Copy code
                </Button>
                <Button variant="outline" className="h-10 w-full rounded-full text-brand"
                        onClick={() => copyText(link("doctor"), "Doctor sign-up link copied")}>
                    <Link2 size={14} className="mr-2" /> Copy doctor link
                </Button>
                <Button variant="outline" className="h-10 w-full rounded-full text-brand"
                        onClick={() => copyText(link("patient"), "Patient sign-up link copied")}>
                    <Link2 size={14} className="mr-2" /> Copy patient link
                </Button>
            </div>
        </div>
    );
}