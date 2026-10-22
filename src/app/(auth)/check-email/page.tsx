import { Suspense } from "react";
import { CheckEmailView } from "@/features/auth/components/CheckEmailView";

export default function CheckEmailPage() {
  return (
      <Suspense>
        <CheckEmailView />
      </Suspense>
  );
}