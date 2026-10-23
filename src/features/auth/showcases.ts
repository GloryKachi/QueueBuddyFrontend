import {
    Bell, Clock, ListOrdered, MessageCircle, MousePointerClick,
    ShieldCheck, Smartphone, Users,
} from "lucide-react";
import type { ShowcaseConfig } from "./components/AuthShowcase";

export const clinicShowcase: ShowcaseConfig = {
    label: "CLINIC SUITE",
    pill: { icon: Users, strong: "Waiting 6", rest: "· Avg consult 14 min" },
    points: [
        { icon: Smartphone, text: "No app for patients to install" },
        { icon: MessageCircle, text: "WhatsApp updates sent automatically" },
        { icon: MousePointerClick, text: "Run it in a few taps" },
    ],
};

export const patientShowcase: ShowcaseConfig = {
    label: "PATIENT",
    pill: { icon: Clock, strong: "You're #3", rest: "· About 15 min" },
    points: [
        { icon: MessageCircle, text: "Updates on WhatsApp and on the website" },
        { icon: Users, text: "See your place in line, live" },
        { icon: Bell, text: "Get a message before it's your turn" },
    ],
};

export const doctorShowcase: ShowcaseConfig = {
    label: "DOCTOR",
    pill: { icon: Users, strong: "4 waiting", rest: "· Next: Amaka O." },
    points: [
        { icon: ListOrdered, text: "See who's next at a glance" },
        { icon: MousePointerClick, text: "Call the next patient in one tap" },
        { icon: ShieldCheck, text: "Accounts approved by your clinic admin" },
    ],
};

export const loginShowcase: ShowcaseConfig = {
    label: "WELCOME BACK",
    pill: clinicShowcase.pill,
    points: clinicShowcase.points,
};