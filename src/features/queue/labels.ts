import type { VisitType } from "./types";

export const visitTypes: { value: VisitType; label: string }[] = [
    { value: "CHECKUP", label: "Checkup" },
    { value: "FOLLOW_UP", label: "Follow-up" },
    { value: "PROCEDURE", label: "Procedure" },
];

export const visitTypeLabel: Record<VisitType, string> = {
    CHECKUP: "Checkup",
    FOLLOW_UP: "Follow-up",
    PROCEDURE: "Procedure",
};