"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";

import type { Skill } from "@/lib/models/skill";
import Link from "next/link";

interface Props {
    skill: Skill;
}

export default function ServiceCard({ skill }: Props) {
    const heroImage =
        skill.skillSampleImage ||
        "/images/placeholders/service-placeholder.jpg";

    const iconImage =
        skill.image ||
        "/images/placeholders/service-icon.png";

    return (
        <Link
            href={`/services/${skill.slug}`}
        >

            <article
                className="
                group
                overflow-hidden
                rounded-[30px]
                border
                border-slate-200
                bg-white
                transition-all
                duration-500
                hover:-translate-y-3
                hover:border-orange-200
                hover:shadow-[0_30px_80px_rgba(249,115,22,.18)]
            "
            >
                {/* Hero Image */}

                <div className="relative h-64 overflow-hidden">

                    <Image
                        src={heroImage}
                        alt={skill.title}
                        fill
                        sizes="(max-width:768px) 100vw,
                           (max-width:1200px) 50vw,
                           25vw"
                        className="
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.08]
                    "
                    />

                    {/* Gradient */}

                    <div
                        className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/85
                        via-black/25
                        to-transparent
                    "
                    />

                    {/* Floating icon */}

                    <div
                        className="
                        absolute
                        left-6
                        bottom-20

                        rounded-2xl
                        bg-white

                        p-3

                        shadow-xl

                        transition-all
                        duration-500

                        group-hover:-translate-y-2
                        group-hover:scale-105
                    "
                    >
                        <Image
                            src={iconImage}
                            alt={skill.title}
                            width={48}
                            height={48}
                            // className="rounded-xl h-auto w-auto"
                            className="h-12 w-12 rounded-xl object-cover"
                        />
                    </div>

                    {/* Title */}

                    <div className="absolute bottom-6 left-6 right-6">

                        <h3 className="text-2xl font-bold text-white">
                            {skill.title}
                        </h3>

                        <p className="mt-1 text-sm text-white/80">
                            Trusted freelancers near you
                        </p>

                    </div>

                </div>

                {/* Card Content */}

                <div className="space-y-5 p-6">

                    <div className="flex items-center justify-between">

                        <div
                            className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            bg-orange-50

                            px-4
                            py-2

                            text-sm
                            font-semibold
                            text-orange-600
                        "
                        >
                            <Users size={16} />

                            {skill.totalMembers > 0
                                ? `${skill.totalMembers} Freelancers`
                                : "Be the first Freelancer"}
                        </div>

                        <div
                            className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            bg-emerald-50

                            px-3
                            py-2

                            text-sm
                            font-medium
                            text-emerald-700
                        "
                        >
                            <ShieldCheck size={15} />

                            Verified
                        </div>

                    </div>

                    <p className="leading-7 text-slate-600">
                        Find trusted {skill.title.toLowerCase()} freelancers
                        ready to help with your next project.
                    </p>

                    <div
                        className="
                        flex
                        items-center
                        justify-between

                        border-t
                        border-slate-100

                        pt-5
                    "
                    >
                        <span
                            className="
                            font-semibold
                            text-slate-900

                            transition-colors

                            group-hover:text-orange-500
                        "
                        >
                            View Service
                        </span>

                        <ArrowRight
                            className="
                            h-5
                            w-5

                            text-orange-500

                            transition-transform
                            duration-300

                            group-hover:translate-x-1
                        "
                        />
                    </div>

                </div>
            </article>
        </Link>
    );
}