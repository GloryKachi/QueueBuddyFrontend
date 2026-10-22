export type UserResponse = {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
    status: "PENDING_VERIFICATION" | "PENDING_APPROVAL" | "ACTIVE" | "SUSPENDED";
};

export type ClinicSummary = {
    id: number;
    name: string;
    whatsappNumber: string;
    city: string;
    joinCode: string;
};

export type SignupResponse = {
    clinic: ClinicSummary | null;
    user: UserResponse;
    message: string;
};