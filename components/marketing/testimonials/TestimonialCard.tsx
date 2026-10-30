
"use client";

import Image from "next/image";
import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
    name: string;
    role: string;
    avatar?: string | null;
    rating: number;
    review: string;
    className?: string;
}

export default function TestimonialCard({
    name,
    role,
    avatar,
    rating,
    review,
    className = "",
}: Props) {
    const [imageFailed, setImageFailed] = useState(false);

    const profileImageUrl = avatar?.trim();
    const initial = (name || "N").charAt(0).toUpperCase();
    const safeRating = Math.min(5, Math.max(0, Math.round(rating)));

    return (
        <div
            className={`
                group
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
                transition-all
                duration-500
                hover:-translate-y-3
                hover:border-orange-300
                hover:shadow-[0_30px_80px_rgba(249,115,22,.15)]
                ${className}
            `}
        >
            {/* Background Quote */}
            <div
                className="
                    absolute
                    right-6
                    top-2
                    select-none
                    text-[110px]
                    font-black
                    leading-none
                    text-orange-100
                "
            >
                "
            </div>

            {/* Stars */}
            <div className="relative mb-6 flex gap-1">
                {Array.from({ length: safeRating }).map((_, index) => (
                    <Star
                        key={index}
                        className="h-5 w-5 fill-orange-400 text-orange-400"
                    />
                ))}
            </div>

            {/* Review */}
            <p className="relative text-lg italic leading-8 text-slate-600">
                "{review}"
            </p>

            {/* Reviewer */}
            <div className="relative mt-10 flex items-center gap-4">
                <div
                    className="
                        relative
                        flex
                        h-16
                        w-16
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-blue-50
                        text-xl
                        font-bold
                        text-[#1565c0]
                        ring-2
                        ring-orange-200
                        transition
                        duration-500
                        group-hover:scale-110
                    "
                >
                    {profileImageUrl && !imageFailed ? (
                        <Image
                            src={profileImageUrl}
                            alt={`${name}'s profile`}
                            fill
                            unoptimized
                            sizes="64px"
                            className="object-cover"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        initial
                    )}
                </div>

                <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-900">
                        {name}
                    </h3>

                    <p className="text-sm capitalize text-slate-500">
                        {role}
                    </p>
                </div>
            </div>

            {/* Reviewer identity */}
            <div className="mt-8 text-sm font-medium text-slate-400">
                NARP Community Member
            </div>
        </div>
    );
}
