"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, User } from "lucide-react";

import { FormField } from "@/components/shared/FormField";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { PhoneInput } from "@/components/shared/PhoneInput";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { TermsCheckbox } from "@/components/shared/TermsCheckbox";
import { registerPatient } from "../api";
import { handleRegistrationError } from "../handleApiError";
import { patientSchema, type PatientInput, type PatientValues } from "../schemas";
import type { SignupResponse } from "../types";
import { ClinicCodeField } from "./ClinicCodeField";
import { EmailTakenBanner } from "./EmailTakenBanner";
import { RegistrationComplete } from "./RegistrationComplete";

export function PatientRegisterForm({ defaultClinicCode = "" }: { defaultClinicCode?: string }) {
    const router = useRouter();
    const [emailTaken, setEmailTaken] = useState(false);
    const [done, setDone] = useState<SignupResponse | null>(null);

    const {
        register,
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<PatientInput, unknown, PatientValues>({
        resolver: zodResolver(patientSchema),
        mode: "onTouched",
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            clinicCode: defaultClinicCode.toUpperCase().slice(0, 6),
            acceptedTerms: false,
        },
    });

    async function onValid(values: PatientValues) {
        setEmailTaken(false);
        try {
            const res = await registerPatient(values);
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
            <h1 className="text-3xl font-bold tracking-tight text-ink">Create your account</h1>
            <p className="mt-1 text-slate">
                Follow your place in the queue on WhatsApp and right here on the website.
            </p>

            <form noValidate onSubmit={handleSubmit(onValid)} className="mt-6 space-y-5">
                <ClinicCodeField error={errors.clinicCode?.message} {...register("clinicCode")} />
                <FormField
                    label="Your full name"
                    placeholder="Amaka Okafor"
                    autoComplete="name"
                    icon={<User size={16} />}
                    error={errors.fullName?.message}
                    {...register("fullName")}
                />
                <div className="space-y-2">
                    <FormField
                        label="Email address"
                        type="email"
                        placeholder="amaka@email.com"
                        autoComplete="email"
                        icon={<Mail size={16} />}
                        error={errors.email?.message}
                        {...register("email", { onChange: () => setEmailTaken(false) })}
                    />
                    {emailTaken && <EmailTakenBanner />}
                </div>
                <PhoneInput
                    label="WhatsApp number"
                    hint="Your queue updates are sent to this number"
                    error={errors.phone?.message}
                    {...register("phone")}
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
                    Are you a doctor?{" "}
                    <Link href="/register/doctor" className="font-semibold text-brand hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}