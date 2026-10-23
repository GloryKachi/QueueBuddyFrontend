import { apiGet, apiPost } from "@/lib/api-client";
import type { LoginResponse, MeResponse, SignupResponse, UserResponse } from "./types";
import type { ClinicSignupValues, PatientValues, DoctorValues, LoginValues } from "./schemas";

const toSignup = (res: UserResponse | SignupResponse): SignupResponse =>
    "user" in res ? res : { clinic: null, user: res };

export const registerClinic = (data: ClinicSignupValues) =>
    apiPost<SignupResponse>("/api/auth/register/clinic", data);

export const registerPatient = async (data: PatientValues) =>
    toSignup(await apiPost<UserResponse | SignupResponse>("/api/auth/register/patient", data));

export const registerDoctor = async (data: DoctorValues) =>
    toSignup(await apiPost<UserResponse | SignupResponse>("/api/auth/register/doctor", data));

export const verifyEmail = (token: string) =>
    apiPost<SignupResponse>("/api/auth/verify-email", { token });

export const resendVerification = (email: string) =>
    apiPost<{ message: string }>("/api/auth/resend-verification", { email });

export const login = (data: LoginValues) =>
    apiPost<LoginResponse>("/api/auth/login", data);

export const fetchMe = (token: string) =>
    apiGet<MeResponse>("/api/me", { token });