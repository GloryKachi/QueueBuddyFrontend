import { AuthCard } from "@/components/shared/AuthCard";
import { AuthShowcase } from "@/features/auth/components/AuthShowcase";
import { DoctorRegisterForm } from "@/features/auth/components/DoctorRegisterForm";
import { doctorShowcase } from "@/features/auth/showcases";

export default async function DoctorRegisterPage({
                                                   searchParams,
                                                 }: {
  searchParams: Promise<{ clinic?: string }>;
}) {
  const { clinic } = await searchParams;
  return (
      <AuthCard aside={<AuthShowcase {...doctorShowcase} />} imageSrc="/auth-doctor.svg">
        <DoctorRegisterForm defaultClinicCode={clinic} />
      </AuthCard>
  );
}