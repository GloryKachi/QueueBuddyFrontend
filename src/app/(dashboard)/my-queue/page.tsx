import { RequireRole } from "@/features/auth/components/RequireRole";
import { MyQueueView } from "@/features/queue/components/MyQueueView";

export default function MyQueuePage() {
    return (
        <RequireRole role="PATIENT">
            <MyQueueView />
        </RequireRole>
    );
}