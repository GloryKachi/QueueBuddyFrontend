"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";

import { AlertBanner } from "@/components/shared/AlertBanner";
import { FormField } from "@/components/shared/FormField";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { ApiError } from "@/types/api";
import { login } from "../api";
import { loginSchema, type LoginInput, type LoginValues } from "../schemas";
import { setToken } from "../session";

type Notice = { variant: "error" | "info"; content: ReactNode } | null;

export function LoginForm() {
    const router = useRouter();
    const [notice, setNotice] = useState<Notice>(null);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput, unknown, LoginValues>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
        defaultValues: { email: "", password: "" },
    });

    async function onValid(values: LoginValues) {
        setNotice(null);
        try {
            const res = await login(values);
            setToken(res.token);
            router.push("/dashboard");
        } catch (err) {
            if (!(err instanceof ApiError)) {
                toast.error("Something went wrong. Please try again.");
                return;
            }
            switch (err.code) {
                case "INVALID_CREDENTIALS":
                    setNotice({ variant: "error", content: "Incorrect email or password." });
                    return;
                case "EMAIL_NOT_VERIFIED":
                    setNotice({
                        variant: "info",
                        content: (
                            <>
                                Please verify your email first.{" "}
                                <Link
                                    href={`/check-email?email=${encodeURIComponent(values.email)}`}
                                    className="font-semibold underline"
                                >
                                    Resend the verification email
                                </Link>
                            </>
                        ),
                    });
                    return;
                case "PENDING_APPROVAL":
                    setNotice({ variant: "info", content: err.message });
                    return;
                case "ACCOUNT_SUSPENDED":
                    setNotice({ variant: "error", content: err.message });
                    return;
            }
            const entries = Object.entries(err.fieldErrors ?? {});
            if (entries.length > 0) {
                entries.forEach(([field, message]) =>
                    setError(field as keyof LoginInput, { message })
                );
                return;
            }
            toast.error(err.message);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">Welcome back</h1>
            <p className="mt-1 text-slate">Sign in to your QueueBuddy account.</p>

            <form noValidate onSubmit={handleSubmit(onValid)} className="mt-6 space-y-5">
                {notice && <AlertBanner variant={notice.variant}>{notice.content}</AlertBanner>}

                <FormField
                    label="Email address"
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    icon={<Mail size={16} />}
                    error={errors.email?.message}
                    {...register("email")}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <SubmitButton loading={isSubmitting}>
                    Sign in <ArrowRight className="ml-2 h-4 w-4" />
                </SubmitButton>
            </form>

            <div className="mt-6 space-y-1 text-center text-sm text-slate">
                <p>
                    New clinic?{" "}
                    <Link href="/register/clinic" className="font-semibold text-brand hover:underline">
                        Set up your clinic
                    </Link>
                </p>
                <p>
                    <Link href="/register/patient" className="font-semibold text-brand hover:underline">
                        I&apos;m a patient
                    </Link>
                    {" · "}
                    <Link href="/register/doctor" className="font-semibold text-brand hover:underline">
                        I&apos;m a doctor
                    </Link>
                </p>
            </div>
        </div>
    );
}