
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Layers } from "lucide-react";

import type { ParentCategory } from "@/lib/models/parent-category";
import type { Skill } from "@/lib/models/skill";

interface Props {
    category: ParentCategory;
    skills: Skill[];
}

export default function CategoryCard({ category, skills }: Props) {
    // Find the first skill that has an available image.
    const firstSkill = skills.find(
        (skill) =>
            skill.image?.trim() ||
            skill.skillSampleImage?.trim()
    );

    // Large background image.
    const heroImage =
        firstSkill?.skillSampleImage?.trim() ||
        firstSkill?.image?.trim() ||
        "/images/placeholders/service-placeholder.jpg";

    // Small floating icon.
    const iconImage =
        firstSkill?.image?.trim() ||
        "/images/placeholders/service-icon.png";

    const totalMembers = skills.reduce(
        (total, skill) =>
            total + (Number(skill.totalMembers) || 0),
        0
    );

    return (
        <Link href={`/services?category=${category.slug}`}>
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
                        alt={category.name}
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

                    {/* Floating Skill Icon */}
                    <div
                        className="
                            absolute
                            left-6
                            top-6
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
                            alt={`${category.name} icon`}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-xl object-cover"
                        />
                    </div>

                    {/* Category Title */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <h3
                            className="
                                text-2xl
                                font-bold
                                leading-tight
                                text-white
                                line-clamp-2
                                min-h-[3.5rem]
                            "
                        >
                            {category.name}
                        </h3>

                        <p className="mt-2 text-sm text-white/80">
                            Explore available services
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
                            <Layers size={16} />
                            {skills.length} Services
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
                            <Users size={15} />
                            {totalMembers} Freelancers
                        </div>

                    </div>

                    <p className="leading-7 text-slate-600">
                        {category.description ||
                            `Discover trusted professionals offering ${category.name.toLowerCase()} services through NARP.`}
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
                            Explore Category
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
