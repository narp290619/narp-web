import Link from "next/link";
import {
    CalendarDays,
    CreditCard,
    UserRound,
    ShieldCheck,
    Star,
    Smartphone,
} from "lucide-react";

const topics = [
    {
        title: "Book a Service",
        description:
            "Learn how to search, book, and manage service requests.",
        href: "/help/bookings",
        icon: CalendarDays,
    },
    {
        title: "Payments & Escrow",
        description:
            "Understand payments, escrow protection, refunds, and withdrawals.",
        href: "/help/payments",
        icon: CreditCard,
    },
    {
        title: "Account & Profile",
        description:
            "Manage your account, verification, and profile settings.",
        href: "/help/account",
        icon: UserRound,
    },
    {
        title: "Safety & Verification",
        description:
            "Stay safe and learn about identity verification and reporting.",
        href: "/help/safety",
        icon: ShieldCheck,
    },
    {
        title: "Ratings & Reviews",
        description:
            "Learn how ratings work and how reviews are moderated.",
        href: "/help/reviews",
        icon: Star,
    },
    {
        title: "Mobile App",
        description:
            "Install, update, and troubleshoot the NARP mobile app.",
        href: "/help/mobile-app",
        icon: Smartphone,
    },
];

export default function PopularTopics() {
    return (
        <section>

            <div className="mb-8 text-center">

                <h2 className="text-3xl font-bold text-slate-900">
                    Popular Topics
                </h2>

                <p className="mt-3 text-slate-600">
                    Browse the most common help categories.
                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {topics.map((topic) => {

                    const Icon = topic.icon;

                    return (

                        <Link
                            key={topic.title}
                            href={topic.href}
                            className="
                                group
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-7
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-blue-300
                                hover:shadow-xl
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-blue-100
                                    text-blue-600
                                    transition
                                    group-hover:bg-blue-600
                                    group-hover:text-white
                                "
                            >

                                <Icon className="h-7 w-7" />

                            </div>

                            <h3 className="mt-6 text-xl font-bold text-slate-900">

                                {topic.title}

                            </h3>

                            <p className="mt-3 leading-7 text-slate-600">

                                {topic.description}

                            </p>

                            <div
                                className="
                                    mt-6
                                    font-semibold
                                    text-blue-600
                                    transition
                                    group-hover:translate-x-1
                                "
                            >
                                Learn more →
                            </div>

                        </Link>

                    );

                })}

            </div>

        </section>
    );
}