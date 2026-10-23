import Link from "next/link";
import { AlertBanner } from "@/components/shared/AlertBanner";

export function EmailTakenBanner() {
    return (
        <AlertBanner variant="info">
            This email is already registered.{" "}
            <Link href="/login" className="font-semibold underline">
                Sign in instead.
            </Link>
        </AlertBanner>
    );
}