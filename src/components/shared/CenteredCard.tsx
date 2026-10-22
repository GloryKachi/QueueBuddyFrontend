import type { ReactNode } from "react";

export function CenteredCard({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl">
            {children}
        </div>
    );
}