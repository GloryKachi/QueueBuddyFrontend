"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/features/auth/components/SessionProvider";
import { ApiError } from "@/types/api";
import { cn } from "@/lib/utils";
import { approveDoctor, listDoctors, suspendDoctor } from "../api";
import type { Doctor, DoctorStatus } from "../types";
import { ClinicCodeCard } from "./ClinicCodeCard";
import { DoctorCard } from "./DoctorCard";

type Filter = "ALL" | DoctorStatus;

const chips: { value: Filter; label: string }[] = [
    { value: "PENDING_APPROVAL", label: "Needs approval" },
    { value: "ACTIVE", label: "Active" },
    { value: "SUSPENDED", label: "Suspended" },
    { value: "ALL", label: "All" },
];

export function DoctorsView() {
    const { token, me } = useSession();
    const [doctors, setDoctors] = useState<Doctor[] | null>(null);
    const [filter, setFilter] = useState<Filter>("PENDING_APPROVAL");
    const [busyId, setBusyId] = useState<number | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        listDoctors(token)
            .then((data) => {
                setDoctors(data);
                // nothing waiting? show everyone instead of an empty list
                if (!data.some((d) => d.status === "PENDING_APPROVAL")) setFilter("ALL");
            })
            .catch((err) =>
                setLoadError(err instanceof ApiError ? err.message : "Couldn't load your doctors.")
            );
    }, [token]);

    const counts = useMemo(() => {
        const list = doctors ?? [];
        return {
            ALL: list.length,
            PENDING_APPROVAL: list.filter((d) => d.status === "PENDING_APPROVAL").length,
            ACTIVE: list.filter((d) => d.status === "ACTIVE").length,
            SUSPENDED: list.filter((d) => d.status === "SUSPENDED").length,
        } as Record<string, number>;
    }, [doctors]);

    const visible = useMemo(() => {
        const list = (doctors ?? []).filter((d) => filter === "ALL" || d.status === filter);
        // needs-approval first, otherwise keep the server's newest-first order
        return [...list].sort(
            (a, b) =>
                Number(b.status === "PENDING_APPROVAL") - Number(a.status === "PENDING_APPROVAL")
        );
    }, [doctors, filter]);

    async function act(doctor: Doctor, action: "approve" | "suspend") {
        if (
            action === "suspend" &&
            !window.confirm(
                doctor.status === "PENDING_APPROVAL"
                    ? `Decline ${doctor.fullName}? They won't be able to sign in.`
                    : `Suspend ${doctor.fullName}? They won't be able to sign in.`
            )
        ) {
            return;
        }
        setBusyId(doctor.id);
        try {
            const updated = await (action === "approve" ? approveDoctor : suspendDoctor)(token, doctor.id);
            setDoctors((prev) => prev?.map((d) => (d.id === updated.id ? updated : d)) ?? prev);
            toast.success(
                action === "approve" ? `${doctor.fullName} can now sign in.` : `${doctor.fullName} was suspended.`
            );
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
        } finally {
            setBusyId(null);
        }
    }

    return (
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-ink">Doctors</h1>
                {counts.PENDING_APPROVAL > 0 && (
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-tint px-2 text-sm font-semibold text-brand">
            {counts.PENDING_APPROVAL}
          </span>
                )}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section>
                    <div className="flex flex-wrap gap-2">
                        {chips.map((chip) => (
                            <button
                                key={chip.value}
                                type="button"
                                onClick={() => setFilter(chip.value)}
                                className={cn(
                                    "rounded-full px-4 py-1.5 text-sm font-medium",
                                    filter === chip.value
                                        ? "bg-brand text-white"
                                        : "border border-mist bg-white text-slate hover:text-ink"
                                )}
                            >
                                {chip.label} <span className="opacity-70">{counts[chip.value]}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 space-y-3">
                        {loadError ? (
                            <p className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">{loadError}</p>
                        ) : doctors === null ? (
                            <Loader2 className="mx-auto mt-10 h-7 w-7 animate-spin text-brand" />
                        ) : visible.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-mist bg-white p-8 text-center text-slate">
                                {doctors.length === 0
                                    ? "No doctors yet. Share your clinic code and they'll show up here."
                                    : "No doctors in this list."}
                            </div>
                        ) : (
                            visible.map((doctor) => (
                                <DoctorCard
                                    key={doctor.id}
                                    doctor={doctor}
                                    busy={busyId === doctor.id}
                                    onApprove={() => act(doctor, "approve")}
                                    onSuspend={() => act(doctor, "suspend")}
                                />
                            ))
                        )}
                    </div>
                </section>

                <aside className="space-y-4">
                    <ClinicCodeCard code={me.clinic.joinCode} />
                    <p className="rounded-2xl bg-brand-tint p-4 text-sm text-brand">
                        Doctors register with your clinic code, then appear here. They can sign in as soon as you approve them.
                    </p>
                </aside>
            </div>
        </div>
    );
}