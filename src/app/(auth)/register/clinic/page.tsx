import { AuthCard } from "@/components/shared/AuthCard";
import { AuthShowcase } from "@/features/auth/components/AuthShowcase";
import { ClinicSignupForm } from "@/features/auth/components/ClinicSignupForm";
import { clinicShowcase } from "@/features/auth/showcases";

export default function ClinicRegisterPage() {
    return (
        <AuthCard aside={<AuthShowcase {...clinicShowcase} />} imageSrc="/auth-clinic.svg">
            <ClinicSignupForm />
        </AuthCard>
    );
}