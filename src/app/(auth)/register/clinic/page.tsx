import { AuthCard } from "@/components/shared/AuthCard";
import { ClinicShowcase } from "@/features/auth/components/ClinicShowcase";
import { ClinicSignupForm } from "@/features/auth/components/ClinicSignupForm";

export default function ClinicRegisterPage() {
  return (
      <AuthCard aside={<ClinicShowcase />} imageSrc="/auth-clinic.svg">
        <ClinicSignupForm />
      </AuthCard>
  );
}