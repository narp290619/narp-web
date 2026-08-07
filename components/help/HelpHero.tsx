"use client";

import { Search } from "lucide-react";

export default function HelpHero() {
    return (
        <section
            className="
                relative
                overflow-hidden
                bg-gradient-to-br
                from-blue-700
                via-blue-600
                to-sky-500
                text-white
            "
        >
            {/* Background Glow */}

            <div className="absolute inset-0 overflow-hidden">

                <div
                    className="
                        absolute
                        -top-32
                        left-1/2
                        h-[420px]
                        w-[420px]
                        -translate-x-1/2
                        rounded-full
                        bg-white/10
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        bottom-0
                        right-0
                        h-72
                        w-72
                        rounded-full
                        bg-cyan-400/10
                        blur-3xl
                    "
                />

            </div>

            <div
                className="
                    relative
                    mx-auto
                    flex
                    max-w-6xl
                    flex-col
                    items-center
                    px-6
                    py-28
                    text-center
                "
            >
                <div
                    className="
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        rounded-full
                        bg-white/15
                        text-5xl
                        shadow-lg
                        backdrop-blur
                    "
                >
                    ❓
                </div>

                <h1 className="mt-8 text-5xl font-extrabold tracking-tight">
                    Help Center
                </h1>

                <p
                    className="
                        mt-6
                        max-w-3xl
                        text-lg
                        leading-8
                        text-blue-100
                    "
                >
                    Find answers to common questions about bookings,
                    payments, escrow, accounts, and using the NARP
                    platform.
                </p>

                {/* Search */}

                <div className="mt-12 w-full max-w-2xl">

                    <div
                        className="
                            flex
                            items-center
                            rounded-2xl
                            bg-white
                            px-5
                            py-4
                            shadow-xl
                        "
                    >
                        <Search className="h-5 w-5 text-slate-400" />

                        <input
                            type="text"
                            placeholder="Search help articles..."
                            className="
                                ml-4
                                w-full
                                border-none
                                bg-transparent
                                text-slate-700
                                placeholder:text-slate-400
                                focus:outline-none
                            "
                        />
                    </div>

                    <p className="mt-4 text-sm text-blue-100">
                        Try searching for{" "}
                        <span className="font-semibold">
                            bookings
                        </span>
                        ,{" "}
                        <span className="font-semibold">
                            refunds
                        </span>
                        ,{" "}
                        <span className="font-semibold">
                            escrow
                        </span>
                        , or{" "}
                        <span className="font-semibold">
                            withdrawals
                        </span>
                        .
                    </p>

                </div>
            </div>
        </section>
    );
}