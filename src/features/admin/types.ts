export type DoctorStatus = "PENDING_VERIFICATION" | "PENDING_APPROVAL" | "ACTIVE" | "SUSPENDED";

export type Doctor = {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    specialization: string | null;
    licenseNumber: string | null;
    status: DoctorStatus;
    createdAt: string | null;
};