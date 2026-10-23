import Link from "next/link";
import { Check } from "lucide-react";
import { gradientButton } from "@/components/shared/styles";
import { cn } from "@/lib/utils";
import type { SignupResponse } from "../types";

const titles: Record<string, string> = {
    ACTIVE: "You're all set!",
    PENDING_APPROVAL: "Almost there",
};

export function RegistrationComplete({ data }: { data: SignupResponse }) {
    return (
        <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#4FB6FF] to-[#0B5CAB] text-white shadow-lg shadow-[#0B5CAB]/30">
                <Check size={36} strokeWidth={3} />
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink">
                {titles[data.user.status] ?? "Account created"}
            </h1>
            {data.clinic && (
                <p className="mt-1 font-medium text-brand">{data.clinic.name}</p>
            )}
            <p className="mt-3 text-slate">{data.user.message}</p>
            <Link
                href="/login"
                className={cn(gradientButton, "mt-8 inline-flex h-12 w-full items-center justify-center rounded-full")}
            >
                Continue to sign in
            </Link>
        </div>
    );
}