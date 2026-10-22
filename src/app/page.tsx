import Link from "next/link";

const links = [
  { href: "/register/clinic", label: "Register a clinic", primary: true },
  { href: "/register/patient", label: "I'm a patient", primary: false },
  { href: "/register/doctor", label: "I'm a doctor", primary: false },
];

export default function Home() {
  return (
      <main className="flex flex-1 items-center justify-center bg-cloud p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-3xl font-bold text-ink">QueueBuddy</h1>
          <p className="mt-2 text-slate">
            Know your place in line, without waiting in it.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {links.map(({ href, label, primary }) => (
                <Link
                    key={href}
                    href={href}
                    className={
                      primary
                          ? "rounded-lg bg-linear-to-r from-brand to-brand-light px-4 py-3 font-semibold text-white"
                          : "rounded-lg border border-mist px-4 py-3 font-semibold text-brand hover:bg-brand-tint"
                    }
                >
                  {label}
                </Link>
            ))}
          </div>
        </div>
      </main>
  );
}