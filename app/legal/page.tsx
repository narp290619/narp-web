import Link from "next/link";

export const metadata = {
    title: "Legal Center | NARP",
    description:
        "Legal policies, terms, and guidelines for using NARP.",
};

const policies = [
    {
        title: "Privacy Policy",
        description:
            "Learn how we collect, use, and protect your information.",
        href: "/legal/privacy",
        icon: "🔒",
    },
    {
        title: "Terms of Service",
        description:
            "Rules and conditions for using the NARP platform.",
        href: "/legal/terms",
        icon: "📜",
    },
    {
        title: "Refund Policy",
        description:
            "Understand refunds, escrow, and payment reversals.",
        href: "/legal/refund",
        icon: "💰",
    },
    {
        title: "Cookie Policy",
        description:
            "How cookies improve your browsing experience.",
        href: "/legal/cookies",
        icon: "🍪",
    },
    {
        title: "Escrow Policy",
        description:
            "How client payments are securely protected.",
        href: "/legal/escrow",
        icon: "🛡️",
    },
    {
        title: "Cancellation Policy",
        description:
            "Client and freelancer cancellation rules.",
        href: "/legal/cancellation",
        icon: "❌",
    },
    {
        title: "Dispute Resolution",
        description:
            "How disagreements are investigated and resolved.",
        href: "/legal/dispute-resolution",
        icon: "⚖️",
    },
    {
        title: "Community Guidelines",
        description:
            "Expected behavior for all NARP users.",
        href: "/legal/community-guidelines",
        icon: "🤝",
    },
    {
        title: "Acceptable Use Policy",
        description:
            "Activities that are prohibited on NARP.",
        href: "/legal/acceptable-use",
        icon: "🚫",
    },
];

export default function LegalCenterPage() {

    return (

        <main className="min-h-screen bg-gray-100 py-10">

            <div className="mx-auto max-w-6xl px-5 pt-24">

                {/* Hero */}

                <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 p-10 text-center text-white shadow-lg">

                    <div className="text-6xl">

                        ⚖️

                    </div>

                    <h1 className="mt-5 text-4xl font-extrabold">

                        Legal Center

                    </h1>

                    <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/90">

                        Find all legal policies, terms, and
                        important information regarding your
                        use of NARP.

                    </p>

                </section>

                {/* Policies */}

                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

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

            </div>

        </main>

    );

}