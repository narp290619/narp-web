"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";

const quickLinks = [
    {
        label: "Bookings",
        href: "/help/bookings",
    },
    {
        label: "Payments",
        href: "/help/payments",
    },
    {
        label: "Account",
        href: "/help/account",
    },
    {
        label: "Safety",
        href: "/help/safety",
    },
    {
        label: "Reviews",
        href: "/help/reviews",
    },
];

export default function HelpHero() {
    return (
        <section className="py-16">

            <div className="mx-auto max-w-5xl px-6">

                <div
                    className="
                        overflow-hidden
                        rounded-3xl
                        bg-gradient-to-br
                        from-blue-700
                        via-blue-600
                        to-sky-500
                        px-8
                        py-20
                        text-center
                        text-white
                        shadow-xl
                        lg:px-16
                    "
                >

                    {/* Background Glow */}

                    <div className="absolute" />

                    <div className="relative">

                        <div
                            className="
                                mx-auto
                                flex
                                h-24
                                w-24
                                items-center
                                justify-center
                                rounded-full
                                bg-white/15
                                backdrop-blur
                            "
                        >
                            <HelpCircle className="h-12 w-12" />
                        </div>

                        <h1 className="mt-8 text-5xl font-extrabold lg:text-6xl">
                            Help Center
                        </h1>

                        <p
                            className="
                                mx-auto
                                mt-6
                                max-w-3xl
                                text-lg
                                leading-8
                                text-blue-100
                            "
                        >
                            Find answers to common questions about bookings,
                            payments, escrow, freelancer accounts, reviews,
                            and everything you need to get the most out of
                            NARP.
                        </p>

                        <div
                            className="
                                mt-12
                                flex
                                flex-wrap
                                justify-center
                                gap-4
                            "
                        >

                            {quickLinks.map((link) => (

                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="
                                        rounded-full
                                        bg-white/15
                                        px-6
                                        py-3
                                        text-sm
                                        font-semibold
                                        backdrop-blur
                                        transition-all
                                        duration-200
                                        hover:-translate-y-1
                                        hover:bg-white
                                        hover:text-blue-700
                                    "
                                >
                                    {link.label}
                                </Link>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}