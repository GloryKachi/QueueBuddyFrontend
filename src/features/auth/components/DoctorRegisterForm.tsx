"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BadgeCheck, Mail, Stethoscope, User } from "lucide-react";

import { FormField } from "@/components/shared/FormField";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { TermsCheckbox } from "@/components/shared/TermsCheckbox";
import { registerDoctor } from "../api";
import { handleRegistrationError } from "../handleApiError";
import { doctorSchema, type DoctorInput, type DoctorValues } from "../schemas";
import type { SignupResponse } from "../types";
import { ClinicCodeField } from "./ClinicCodeField";
import { EmailTakenBanner } from "./EmailTakenBanner";
import { RegistrationComplete } from "./RegistrationComplete";
import { PhoneInput } from "@/components/shared/PhoneInput";

const SPECIALIZATIONS = [
    "General Practitioner", "Paediatrician", "Obstetrician & Gynaecologist",
    "Dentist", "Physician", "Surgeon", "Dermatologist", "Ophthalmologist",
];

export function DoctorRegisterForm({ defaultClinicCode = "" }: { defaultClinicCode?: string }) {
    const router = useRouter();
    const [emailTaken, setEmailTaken] = useState(false);
    const [done, setDone] = useState<SignupResponse | null>(null);

    const {
        register,
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<DoctorInput, unknown, DoctorValues>({
        resolver: zodResolver(doctorSchema),
        mode: "onTouched",
        defaultValues: {
            fullName: "",
            phone: "",
            email: "",
            password: "",
            specialization: "",
            licenseNumber: "",
            clinicCode: defaultClinicCode.toUpperCase().slice(0, 6),
            acceptedTerms: false,
        },
    });

    async function onValid(values: DoctorValues) {
        setEmailTaken(false);
        try {
            const res = await registerDoctor(values);
            if (res.user.status === "PENDING_VERIFICATION") {
                router.push(`/check-email?email=${encodeURIComponent(values.email)}`);
            } else {
                setDone(res);
            }
        } catch (err) {
            handleRegistrationError(err, setError, { onEmailTaken: () => setEmailTaken(true) });
        }
    }

    if (done) return <RegistrationComplete data={done} />;

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">Create your doctor account</h1>
            <p className="mt-1 text-slate">Your clinic admin approves doctor accounts before you can sign in.</p>

            <form noValidate onSubmit={handleSubmit(onValid)} className="mt-6 space-y-5">
                <ClinicCodeField error={errors.clinicCode?.message} {...register("clinicCode")} />
                <FormField
                    label="Your full name"
                    placeholder="Dr. Sarah Adeyemi"
                    autoComplete="name"
                    icon={<User size={16} />}
                    error={errors.fullName?.message}
                    {...register("fullName")}
                />
                <div className="space-y-2">
                    <FormField
                        label="Email address"
                        type="email"
                        placeholder="sarah@graceclinic.ng"
                        autoComplete="email"
                        icon={<Mail size={16} />}
                        error={errors.email?.message}
                        {...register("email", { onChange: () => setEmailTaken(false) })}
                    />
                    {emailTaken && <EmailTakenBanner />}
                </div>

                <PhoneInput
                    label="Phone number"
                    hint="Your mobile number"
                    error={errors.phone?.message}
                    {...register("phone")}
                />
                <FormField
                    label="Specialization"
                    placeholder="e.g. Paediatrician"
                    list="specializations"
                    icon={<Stethoscope size={16} />}
                    error={errors.specialization?.message}
                    {...register("specialization")}
                />
                <datalist id="specializations">
                    {SPECIALIZATIONS.map((s) => <option key={s} value={s} />)}
                </datalist>

                <FormField
                    label="Medical licence number"
                    placeholder="e.g. MDCN/12345"
                    icon={<BadgeCheck size={16} />}
                    error={errors.licenseNumber?.message}
                    {...register("licenseNumber")}
                />
                <PasswordInput
                    label="Password"
                    placeholder="At least 8 characters"
                    hint="At least 8 characters"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Controller
                    control={control}
                    name="acceptedTerms"
                    render={({ field }) => (
                        <TermsCheckbox
                            checked={field.value}
                            onChange={field.onChange}
                            error={errors.acceptedTerms?.message}
                        />
                    )}
                />
                <SubmitButton loading={isSubmitting}>
                    Create account <ArrowRight className="ml-2 h-4 w-4" />
                </SubmitButton>
            </form>

            <div className="mt-6 space-y-1 text-center text-sm text-slate">
                <p>
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
                </p>
                <p>
                    Are you a patient?{" "}
                    <Link href="/register/patient" className="font-semibold text-brand hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}