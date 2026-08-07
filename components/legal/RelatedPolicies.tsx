import Link from "next/link";

type Policy = {
    title: string;
    href: string;
    icon: string;
};

type RelatedPoliciesProps = {
    current?: string;
};

const policies: Policy[] = [
    {
        title: "Privacy Policy",
        href: "/legal/privacy",
        icon: "🔒",
    },
    {
        title: "Terms of Service",
        href: "/legal/terms",
        icon: "📜",
    },
    {
        title: "Refund Policy",
        href: "/legal/refund",
        icon: "💰",
    },
    {
        title: "Escrow Policy",
        href: "/legal/escrow",
        icon: "🛡️",
    },
    {
        title: "Cancellation Policy",
        href: "/legal/cancellation",
        icon: "❌",
    },
    {
        title: "Dispute Resolution",
        href: "/legal/dispute-resolution",
        icon: "⚖️",
    },
    {
        title: "Cookie Policy",
        href: "/legal/cookies",
        icon: "🍪",
    },
    {
        title: "Community Guidelines",
        href: "/legal/community-guidelines",
        icon: "🤝",
    },
    {
        title: "Acceptable Use Policy",
        href: "/legal/acceptable-use",
        icon: "🚫",
    },
];

export default function RelatedPolicies({
    current,
}: RelatedPoliciesProps) {

    const related = policies.filter(
        (policy) => policy.href !== current,
    );

    return (

        <section className="rounded-3xl bg-white p-8 shadow-lg">

            <h2 className="text-2xl font-bold">

                Related Policies

            </h2>

            <p className="mt-3 text-gray-600">

                Looking for more information? These documents may
                also be helpful.

            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                {related.map((policy) => (

                    <Link
                        key={policy.href}
                        href={policy.href}
                        className="
                            rounded-2xl
                            border
                            bg-gray-50
                            p-5
                            transition
                            hover:border-blue-500
                            hover:bg-blue-50
                            hover:shadow
                        "
                    >

                        <div className="text-3xl">

                            {policy.icon}

                        </div>

                        <h3 className="mt-4 font-bold">

                            {policy.title}

                        </h3>

                    </Link>

                ))}

            </div>

        </section>

    );

}