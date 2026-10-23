import { RequireRole } from "@/features/auth/components/RequireRole";
import { DoctorsView } from "@/features/admin/components/DoctorsView";

export default function AdminDoctorsPage() {
    return (
        <RequireRole role="ADMIN">
            <DoctorsView />
        </RequireRole>
    );
}