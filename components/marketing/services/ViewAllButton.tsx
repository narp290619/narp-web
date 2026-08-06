"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ViewAllButton() {
    return (
        <div className="mt-20 flex justify-center">
            <Link
                href="/services"
                className="
                    group
                    relative
                    inline-flex
                    items-center
                    gap-3
                    overflow-hidden
                    rounded-full
                    border
                    border-orange-200
                    bg-white
                    px-8
                    py-4
                    text-base
                    font-semibold
                    text-slate-900
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-orange-300
                    hover:shadow-xl
                "
            >
                {/* Background sweep */}

                <span
                    className="
                        absolute
                        inset-0
                        -translate-x-full
                        bg-gradient-to-r
                        from-orange-500
                        via-orange-400
                        to-orange-500
                        transition-transform
                        duration-500
                        group-hover:translate-x-0
                    "
                />

                {/* Text */}

                <span
                    className="
                        relative
                        z-10
                        transition-colors
                        duration-300
                        group-hover:text-white
                    "
                >
                    Browse All Services
                </span>

                {/* Arrow */}

                <ArrowRight
                    className="
                        relative
                        z-10
                        h-5
                        w-5
                        text-orange-500
                        transition-all
                        duration-300
                        group-hover:translate-x-1
                        group-hover:text-white
                    "
                />
            </Link>
        </div>
    );
}