"use client";

import Image from "next/image";
import Link from "next/link";

import {
    Star,
    ShieldCheck,
    Briefcase,
    ArrowRight,
} from "lucide-react";

interface Props {
    freelancer: {
        userId: string;
        skillId: string;
        firstName: string;
        lastName: string;
        profileImageUrl: string;
        aboutMemberSkill: string;
        startingPrice: number;
        rating: number;
        reviewCount: number;
        completedJobs?: number;
        isVerified: boolean;
    };
}

export default function FreelancerCard({
    freelancer,
}: Props) {

    return (

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
                hover:-translate-y-2
                hover:border-orange-200
                hover:shadow-2xl
            "
        >

            {/* Header */}

            <div className="relative p-7">

                {freelancer.isVerified && (

                    <div
                        className="
                            absolute
                            right-6
                            top-6

                            flex
                            items-center
                            gap-1

                            rounded-full

                            bg-emerald-100

                            px-3
                            py-1

                            text-xs
                            font-semibold
                            text-emerald-700
                        "
                    >

                        <ShieldCheck size={14} />

                        Verified

                    </div>

                )}

                <div className="flex items-center gap-5">

                    <Image
                        src={
                            freelancer.profileImageUrl ||
                            "/images/placeholders/profilePicGuest.png"
                        }
                        alt={`${freelancer.firstName} ${freelancer.lastName}`}
                        width={78}
                        height={78}
                        className="
                            rounded-full
                            w-auto
                            object-cover
                            ring-4
                            ring-orange-100
                            transition
                            duration-500
                            group-hover:ring-orange-300
                        "
                    />

                    <div>

                        <h3 className="text-xl font-bold text-slate-900">

                            {freelancer.firstName} {freelancer.lastName}

                        </h3>

                        <p className="mt-1 text-sm text-slate-500">

                            Freelancer

                        </p>

                    </div>

                </div>

            </div>

            {/* Stats */}

            <div
                className="
                    flex
                    items-center
                    justify-between

                    border-y
                    border-slate-100

                    px-7
                    py-4
                "
            >

                <div className="flex items-center gap-2">

                    <Star
                        size={18}
                        className="fill-orange-400 text-orange-400"
                    />

                    <div>

                        <div className="font-bold">

                            {freelancer.rating > 0
                                ? freelancer.rating.toFixed(1)
                                : "New"}

                        </div>

                        <div className="text-xs text-slate-500">

                            {freelancer.reviewCount} Reviews

                        </div>

                    </div>

                </div>

                <div className="flex items-center gap-2">

                    <Briefcase
                        size={18}
                        className="text-slate-500"
                    />

                    <div>

                        <div className="font-bold">

                            {freelancer.completedJobs ?? 0}

                        </div>

                        <div className="text-xs text-slate-500">

                            Jobs

                        </div>

                    </div>

                </div>

            </div>

            {/* About */}

            <div className="px-7 py-6">

                <p
                    className="
                        line-clamp-3
                        leading-7
                        text-slate-600
                    "
                >

                    {freelancer.aboutMemberSkill}

                </p>

            </div>

            {/* Footer */}

            <div
                className="
                    flex
                    items-center
                    justify-between

                    border-t
                    border-slate-100

                    px-7
                    py-6
                "
            >

                <div>

                    <div className="text-sm text-slate-500">

                        Starting from

                    </div>

                    <div
                        className="
                            text-2xl
                            font-black
                            text-orange-500
                        "
                    >

                        ₱{freelancer.startingPrice.toLocaleString()}

                    </div>

                </div>

                <Link
                    href={`/freelancers/${freelancer.userId}/${freelancer.skillId}`}
                    className="
                        flex
                        items-center
                        gap-2

                        rounded-full

                        border
                        border-orange-200

                        px-5
                        py-3

                        font-semibold
                        text-orange-600

                        transition-all

                        hover:bg-orange-500
                        hover:text-white
                    "
                >

                    View

                    <ArrowRight size={18} />

                </Link>

            </div>

        </article>

    );

}