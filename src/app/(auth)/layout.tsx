export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen items-center bg-[#F5F8FC] p-4">{children}</main>
    );
}