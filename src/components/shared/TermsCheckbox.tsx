import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

type Props = { checked: boolean; onChange: (v: boolean) => void; error?: string };

export function TermsCheckbox({ checked, onChange, error }: Props) {
    return (
        <div className="space-y-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate">
                <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} />
                <span>
          I agree to the{" "}
                    <Link href="#" className="font-medium text-brand hover:underline">Terms</Link> and{" "}
                    <Link href="#" className="font-medium text-brand hover:underline">Privacy Policy</Link>
        </span>
            </label>
            {error && <p className="text-sm text-danger">{error}</p>}
        </div>
    );
}