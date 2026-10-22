import { apiPost } from "@/lib/api-client";
import type { SignupResponse } from "./types";
import type { ClinicSignupValues, PatientValues, DoctorValues } from "./schemas";

export const registerClinic = (data: ClinicSignupValues) =>
    apiPost<SignupResponse>("/api/auth/register/clinic", data);

export const registerPatient = (data: PatientValues) =>
    apiPost<SignupResponse>("/api/auth/register/patient", data);

export const registerDoctor = (data: DoctorValues) =>
    apiPost<SignupResponse>("/api/auth/register/doctor", data);

export const verifyEmail = (token: string) =>
    apiPost<SignupResponse>("/api/auth/verify-email", { token });

export const resendVerification = (email: string) =>
    apiPost<{ message: string }>("/api/auth/resend-verification", { email });