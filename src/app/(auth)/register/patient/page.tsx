import { AuthCard } from "@/components/shared/AuthCard";
import { AuthShowcase } from "@/features/auth/components/AuthShowcase";
import { PatientRegisterForm } from "@/features/auth/components/PatientRegisterForm";
import {patientShowcase} from "@/features/auth/showcases";

export default async function PatientRegisterPage({
                                                    searchParams,
                                                  }: {
  searchParams: Promise<{ clinic?: string }>;
}) {
  const { clinic } = await searchParams;
  return (
      <AuthCard aside={<AuthShowcase {...patientShowcase} />} imageSrc="/auth-patient.svg">
        <PatientRegisterForm defaultClinicCode={clinic} />
      </AuthCard>
  );
}