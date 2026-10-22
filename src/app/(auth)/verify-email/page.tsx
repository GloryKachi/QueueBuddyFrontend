import { Suspense } from "react";
import { VerifyEmailView } from "@/features/auth/components/VerifyEmailView";

export default function VerifyEmailPage() {
  return (
      <Suspense>
        <VerifyEmailView />
      </Suspense>
  );
}