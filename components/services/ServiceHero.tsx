"use client";

import Image from "next/image";
import { ShieldCheck, Star, Users, Download } from "lucide-react";

import type { Skill } from "@/lib/models/skill";

interface Props {
    skill: Skill;
}

export default function ServiceHero({
    skill,
}: Props) {

    const heroImage =
        skill.skillSampleImage ||
        "/images/placeholders/service-placeholder.jpg";

    return (

        <section className="relative py-20">

            {/* Orange glow */}

            <div
                className="
                    absolute
                    right-0
                    top-0
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-orange-200/30
                    blur-[140px]
                "
            />

            <div
                className="
                    relative
                    grid
                    items-center
                    gap-20
                    lg:grid-cols-2
                "
            >

                {/* LEFT */}

                <div>

                    <div
                        className="
                            inline-flex
                            rounded-full
                            bg-orange-100
                            px-5
                            py-2
                            text-sm
                            font-semibold
                            uppercase
                            tracking-widest
                            text-orange-600
                        "
                    >
                        {skill.category}
                    </div>

                    <h1
                        className="
                            mt-8
                            text-6xl
                            font-black
                            leading-tight
                            text-slate-900
                        "
                    >
                        {skill.title}
                    </h1>

                    <p
                        className="
                            mt-8
                            max-w-2xl
                            text-xl
                            leading-9
                            text-slate-600
                        "
                    >
                        {skill.description ??
                            `Book trusted ${skill.title.toLowerCase()} professionals anywhere in the Philippines with NARP.`}
                    </p>

                    {/* Statistics */}

                    <div className="mt-10 flex flex-wrap gap-4">

                        <Stat
                            icon={<Users size={18} />}
                            value={`${skill.totalMembers}`}
                            label="Professionals"
                        />

                        <Stat
                            icon={<ShieldCheck size={18} />}
                            value="Verified"
                            label="Identity Checked"
                        />

                        <Stat
                            icon={<Star size={18} fill="currentColor" />}
                            value={String(skill.averageRating ?? "New")}
                            label="Rating"
                        />

                    </div>

                    {/* Buttons */}

                    <div className="mt-12 flex flex-wrap gap-5">

                        <button
                            className="
                                rounded-full
                                bg-orange-500
                                px-8
                                py-4
                                text-lg
                                font-semibold
                                text-white
                                shadow-xl
                                transition
                                hover:-translate-y-1
                                hover:bg-orange-600
                            "
                        >
                            Find Professionals
                        </button>

                        <button
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-slate-300
                                bg-white
                                px-8
                                py-4
                                font-semibold
                                text-slate-700
                                transition
                                hover:border-orange-300
                                hover:text-orange-500
                            "
                        >
                            <Download size={18} />

                            Download App

                        </button>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="relative">

                    <Image
                        src={heroImage}
                        alt={skill.title}
                        width={900}
                        height={700}
                        priority
                        className="
                            rounded-[40px]
                            object-cover
                            shadow-[0_40px_80px_rgba(0,0,0,.18)]
                        "
                    />

                    {/* Floating Card */}

                    <div
                        className="
                            absolute
                            -bottom-8
                            left-8
                            rounded-3xl
                            bg-white/90
                            p-6
                            backdrop-blur-xl
                            shadow-2xl
                        "
                    >

                        <div className="flex items-center gap-10">

                            <MiniStat
                                title="Pros"
                                value={String(skill.totalMembers)}
                            />

                            <MiniStat
                                title="Verified"
                                value="100%"
                            />

                            <MiniStat
                                title="Rating"
                                value={String(skill.averageRating ?? "New")}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

function Stat({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: string;
    label: string;
}) {

    return (

        <div
            className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-4
                shadow-sm
            "
        >

            {icon}

            <div>

                <div className="font-bold">

                    {value}

                </div>

                <div className="text-sm text-slate-500">

                    {label}

                </div>

            </div>

        </div>

    );

}

function MiniStat({
    title,
    value,
}: {
    title: string;
    value: string;
}) {

    return (

        <div className="text-center">

            <div className="text-2xl font-black text-orange-500">

                {value}

            </div>

            <div className="text-sm text-slate-500">

                {title}

            </div>

        </div>

    );

}