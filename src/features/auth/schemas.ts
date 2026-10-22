import { z } from "zod";
import { NG_PHONE_REGEX, NG_PHONE_MESSAGE, toNgPhone } from "@/lib/phone";

const phone = z
    .string()
    .min(1, "Phone number is required")
    .transform(toNgPhone)
    .refine((v) => NG_PHONE_REGEX.test(v), NG_PHONE_MESSAGE);

const email = z.string().min(1, "Email is required").email("Enter a valid email");
const password = z.string().min(8, "Use at least 8 characters");
const fullName = z.string().trim().min(2, "Enter your full name");
const terms = z.boolean().refine((v) => v === true, "You must accept the terms");
const clinicCode = z
    .string()
    .trim()
    .length(6, "The clinic code is 6 characters")
    .transform((v) => v.toUpperCase());

export const clinicStepOneSchema = z.object({
    clinicName: z.string().trim().min(2, "Enter the clinic name"),
    clinicWhatsapp: phone,
    city: z.string().trim().min(2, "Enter the city"),
});

export const clinicStepTwoSchema = z.object({
    fullName,
    email,
    password,
    acceptedTerms: terms,
});

export const clinicSignupSchema = z.object({
    ...clinicStepOneSchema.shape,
    ...clinicStepTwoSchema.shape,
});

export const patientSchema = z.object({
    fullName, email, phone, password, clinicCode, acceptedTerms: terms,
});

export const doctorSchema = z.object({
    fullName,
    email,
    password,
    specialization: z.string().trim().min(2, "Enter your specialization"),
    licenseNumber: z.string().trim().min(2, "Enter your licence number"),
    clinicCode,
    acceptedTerms: terms,
});

export type ClinicSignupInput = z.input<typeof clinicSignupSchema>;
export type ClinicSignupValues = z.output<typeof clinicSignupSchema>;
export type PatientInput = z.input<typeof patientSchema>;
export type PatientValues = z.output<typeof patientSchema>;
export type DoctorInput = z.input<typeof doctorSchema>;
export type DoctorValues = z.output<typeof doctorSchema>;