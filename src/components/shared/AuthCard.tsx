import type { ReactNode } from "react";

type Props = { children: ReactNode; aside?: ReactNode; imageSrc?: string };

export function AuthCard({ children, aside, imageSrc }: Props) {
    return (
        <div className="mx-auto grid w-full max-w-5xl gap-4 rounded-[2rem] bg-white p-3 shadow-xl md:grid-cols-2 md:p-4">
            <div
                className="relative hidden min-h-145 overflow-hidden rounded-3xl bg-linear-to-br from-brand-deep to-brand-light bg-cover bg-center md:block"
                style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : undefined}
            >
                {aside}
            </div>
            <div className="flex flex-col justify-center px-4 py-8 md:px-10">{children}</div>
        </div>
    );
}