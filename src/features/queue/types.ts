// export type VisitType = "CHECKUP" | "FOLLOW_UP" | "PROCEDURE";
// export type QueueStatus =
//     | "PENDING" | "WAITING" | "SERVING" | "DONE" | "SKIPPED" | "CANCELLED" | "REJECTED";
// export type DisplayStatus =
//     | "PENDING" | "NEXT" | "NOTIFIED" | "LATE" | "WAITING" | "SERVING"
//     | "DONE" | "SKIPPED" | "CANCELLED" | "REJECTED";
//
// export type QueueItem = {
//     id: number;
//     ticketNumber: number | null;
//     patientName: string;
//     maskedPhone: string | null;
//     visitType: VisitType;
//     status: QueueStatus;
//     displayStatus: DisplayStatus;
//     waitingMinutes: number;
//     estimatedWaitMinutes: number | null;
//     position: number | null;
//     joinedAt: string;
//     calledAt: string | null;
//     servedByName: string | null;
//     rejectionReason: string | null;
// };
//
// export type QueueStats = {
//     waiting: number;
//     pendingRequests: number;
//     avgConsultMinutes: number;
//     longestWaitMinutes: number;
//     servedToday: number;
// };
//
// export type QueueSnapshot = {
//     date: string;
//     clinicName: string;
//     requests: QueueItem[];
//     waiting: QueueItem[];
//     serving: QueueItem[];
//     stats: QueueStats;
// };
//
// export type NotificationItem = {
//     id: number;
//     type: string;
//     message: string;
//     createdAt: string;
// };
//
// export type MyQueue = {
//     clinicName: string;
//     entry: QueueItem | null;
//     nowServingTicket: number | null;
//     waitingCount: number;
//     avgConsultMinutes: number;
//     updates: NotificationItem[];
// };


export type QueueStatus =
    | "PENDING" | "WAITING" | "SERVING" | "DONE" | "SKIPPED" | "CANCELLED" | "REJECTED";

export type DisplayStatus =
    | "PENDING" | "NEXT" | "NOTIFIED" | "LATE" | "WAITING"
    | "SERVING" | "DONE" | "SKIPPED" | "CANCELLED" | "REJECTED";

export type QueueItem = {
    id: number;
    ticketNumber: number | null;
    patientName: string;
    maskedPhone: string;
    status: QueueStatus;
    displayStatus: DisplayStatus;
    waitingMinutes: number;
    estimatedWaitMinutes: number;
    position: number;
    joinedAt: string;
    calledAt: string | null;
    servedByName: string | null;
    rejectionReason: string | null;
    doctorId: number | null;
    doctorName: string | null;
    preferredDoctorId: number | null;
    preferredDoctorName: string | null;
};

export type QueueStats = {
    waiting: number;
    pendingRequests: number;
    avgConsultMinutes: number;
    longestWaitMinutes: number;
    servedToday: number;
};

export type DoctorOption = {
    id: number;
    name: string;
    specialization: string | null;
    onDuty: boolean;
    waiting: number;
};

export type QueueSnapshot = {
    date: string;
    clinicName: string;
    viewerRole: "ADMIN" | "DOCTOR";
    onDuty: boolean | null;
    requests: QueueItem[];
    waiting: QueueItem[];
    serving: QueueItem[];
    stats: QueueStats;
    doctors: DoctorOption[];
};

export type NotificationItem = {
    id: number;
    type: string;
    message: string;
    createdAt: string;
};

export type MyQueue = {
    patientName: string;
    clinicName: string;
    entry: QueueItem | null;
    nowServingTicket: number | null;
    waitingCount: number;
    avgConsultMinutes: number;
    updates: NotificationItem[];
    doctors: DoctorOption[];
};