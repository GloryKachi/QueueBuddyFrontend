import { apiGet, apiPost } from "@/lib/api-client";
import type { Doctor } from "./types";

export const listDoctors = (token: string) =>
    apiGet<Doctor[]>("/api/admin/doctors", { token });

export const approveDoctor = (token: string, id: number) =>
    apiPost<Doctor>(`/api/admin/doctors/${id}/approve`, {}, { token });

export const suspendDoctor = (token: string, id: number) =>
    apiPost<Doctor>(`/api/admin/doctors/${id}/suspend`, {}, { token });