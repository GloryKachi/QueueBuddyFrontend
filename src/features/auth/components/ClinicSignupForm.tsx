"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Building2, Mail, MapPin, User } from "lucide-react";
import { toast } from "sonner";

import { AlertBanner } from "@/components/shared/AlertBanner";
import { FormField } from "@/components/shared/FormField";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { PhoneInput } from "@/components/shared/PhoneInput";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { TermsCheckbox } from "@/components/shared/TermsCheckbox";
import { ApiError } from "@/types/api";
import { registerClinic } from "../api";
import {
    clinicSignupSchema,
    type ClinicSignupInput,
    type ClinicSignupValues,
} from "../schemas";

const STEP_ONE_FIELDS = ["clinicName", "clinicWhatsapp", "city"] as const;

export function ClinicSignupForm() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [emailTaken, setEmailTaken] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        trigger,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ClinicSignupInput, unknown, ClinicSignupValues>({
        resolver: zodResolver(clinicSignupSchema),
        mode: "onTouched",
        defaultValues: {
            clinicName: "",
            clinicWhatsapp: "",
            city: "",
            fullName: "",
            email: "",
            password: "",
            acceptedTerms: false,
        },
    });

    async function goNext() {
        if (await trigger([...STEP_ONE_FIELDS])) setStep(2);
    }

    async function onValid(values: ClinicSignupValues) {
        setEmailTaken(false);
        try {
            await registerClinic(values);
            router.push(`/check-email?email=${encodeURIComponent(values.email)}`);
        } catch (err) {
            if (!(err instanceof ApiError)) {
                toast.error("Something went wrong. Please try again.");
                return;
            }
            if (err.code === "EMAIL_TAKEN") {
                setEmailTaken(true);
                return;
            }
            if (err.code === "CLINIC_PHONE_TAKEN") {
                setStep(1);
                setError("clinicWhatsapp", { message: err.message });
                return;
            }
            const entries = Object.entries(err.fieldErrors ?? {});
            if (entries.length > 0) {
                entries.forEach(([field, message]) =>
                    setError(field as keyof ClinicSignupInput, { message })
                );
                if (entries.some(([f]) => (STEP_ONE_FIELDS as readonly string[]).includes(f))) {
                    setStep(1);
                }
                return;
            }
            toast.error(err.message);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">Set up your clinic</h1>
            <p className="mt-1 text-slate">Takes about 2 minutes. No app to install.</p>

            <div className="mt-6">
                <StepIndicator steps={["Your clinic", "You"]} current={step} />
            </div>

            <form
                noValidate
                className="mt-6 space-y-5"
                onSubmit={(e) => {
                    if (step === 1) {
                        e.preventDefault();
                        void goNext();
                    } else {
                        void handleSubmit(onValid)(e);
                    }
                }}
            >
                {step === 1 ? (
                    <>
                        <FormField
                            label="Clinic name"
                            placeholder="Grace Family Healthcare"
                            icon={<Building2 size={16} />}
                            error={errors.clinicName?.message}
                            {...register("clinicName")}
                        />
                        <PhoneInput
                            label="Clinic WhatsApp number"
                            hint="Patients will message this number to join the queue"
                            error={errors.clinicWhatsapp?.message}
                            {...register("clinicWhatsapp")}
                        />
                        <FormField
                            label="City"
                            placeholder="Ikeja, Lagos State"
                            icon={<MapPin size={16} />}
                            error={errors.city?.message}
                            {...register("city")}
                        />
                        <SubmitButton>
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </SubmitButton>
                    </>
                ) : (
                    <>
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
                            {emailTaken && (
                                <AlertBanner variant="info">
                                    This email is already registered.{" "}
                                    <Link href="/login" className="font-semibold underline">
                                        Sign in instead.
                                    </Link>
                                </AlertBanner>
                            )}
                        </div>
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
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="mx-auto flex items-center gap-1 text-sm text-slate hover:text-ink"
                        >
                            <ArrowLeft size={14} /> Back to clinic details
                        </button>
                    </>
                )}
            </form>

            <p className="mt-6 text-center text-sm text-slate">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-brand hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}