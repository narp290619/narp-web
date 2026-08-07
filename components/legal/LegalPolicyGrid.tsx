import Link from "next/link";
import { Policy } from "@/lib/legal/policies";

type Props = {
    policies: Policy[];
};

export default function LegalPolicyGrid({
    policies,
}: Props) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy) => (
                <Link
                    key={policy.href}
                    href={policy.href}
                    className="
                        rounded-3xl
                        bg-white
                        p-7
                        shadow-lg
                        transition
                        hover:-translate-y-1
                        hover:shadow-xl
                    "
                >
                    <div className="text-5xl">
                        {policy.icon}
                    </div>

                    <h2 className="mt-5 text-2xl font-bold">
                        {policy.title}
                    </h2>

                    <p className="mt-3 text-gray-600">
                        {policy.description}
                    </p>
                </Link>
            ))}
        </div>
    );
}