import { AuthCard } from "@/components/shared/AuthCard";
import { authImages } from "@/config/images";
import { AuthShowcase } from "@/features/auth/components/AuthShowcase";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { loginShowcase } from "@/features/auth/showcases";

export default function LoginPage() {
  return (
      <AuthCard aside={<AuthShowcase {...loginShowcase} />} imageSrc={authImages.clinic}>
        <LoginForm />
      </AuthCard>
  );
}