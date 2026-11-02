import { RequireRole } from "@/features/auth/components/RequireRole";
import { QueueView } from "@/features/queue/components/QueueView";

export default function QueuePage() {
    return (
        <RequireRole roles={["ADMIN", "DOCTOR"]}>
            <QueueView />
        </RequireRole>
    );
}