import Image from "next/image";
import {
    Star,
    ShieldCheck,
    MapPin,
    Briefcase,
    CalendarDays,
} from "lucide-react";

import type { SkillMember } from "@/lib/models/skill-member";

interface Props {
    member: SkillMember;
}

export default function FreelancerHero({
    member,
}: Props) {

    const memberSince =
        member.createdAt
            ? new Date(member.createdAt).getFullYear()
            : null;

    return (

        <section
            className="
                rounded-3xl
                border
                bg-white
                p-10
                shadow-sm
            "
        >

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

                {/* Avatar */}

                <Image
                    src={
                        member.profileImageUrl ||
                        "/images/placeholders/avatar.png"
                    }
                    alt={`${member.firstName} ${member.lastName}`}
                    width={140}
                    height={140}
                    className="
                        rounded-full
                        object-cover
                        ring-4
                        ring-orange-100
                    "
                />

                {/* Main Info */}

                <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3">

                        <h1 className="text-4xl font-bold text-slate-900">

                            {member.firstName} {member.lastName}

                        </h1>

                        {member.isVerified && (

                            <span
                                className="
                                    flex
                                    items-center
                                    gap-1

                                    rounded-full

                                    bg-emerald-100

                                    px-3
                                    py-1

                                    text-sm
                                    font-semibold
                                    text-emerald-700
                                "
                            >

                                <ShieldCheck size={16} />

                                Verified

                            </span>

                        )}

                    </div>

                    <p className="mt-2 text-xl font-medium text-orange-500">

                        {member.skillId}

                    </p>

                    <div
                        className="
                            mt-8
                            flex
                            flex-wrap
                            gap-8
                        "
                    >

                        {/* Rating */}

                        <div>

                            <div className="flex items-center gap-2">

                                <Star
                                    size={20}
                                    className="fill-yellow-400 text-yellow-400"
                                />

                                <span className="font-bold">

                                    {member.rating > 0
                                        ? member.rating.toFixed(1)
                                        : "New"}

                                </span>

                            </div>

                            <div className="text-sm text-slate-500">

                                {member.reviewCount} Reviews

                            </div>

                        </div>

                        {/* Jobs */}

                        <div>

                            <div className="flex items-center gap-2">

                                <Briefcase
                                    size={20}
                                    className="text-orange-500"
                                />

                                <span className="font-bold">

                                    {member.completedJobs ?? 0}

                                </span>

                            </div>

                            <div className="text-sm text-slate-500">

                                Jobs Completed

                            </div>

                        </div>

                        {/* Member Since */}

                        <div>

                            <div className="flex items-center gap-2">

                                <CalendarDays
                                    size={20}
                                    className="text-orange-500"
                                />

                                <span className="font-bold">

                                    {memberSince ?? "-"}

                                </span>

                            </div>

                            <div className="text-sm text-slate-500">

                                Member Since

                            </div>

                        </div>

                        {/* Location */}

                        {(member.latitude != null &&
                            member.longitude != null) && (

                            <div>

                                <div className="flex items-center gap-2">

                                    <MapPin
                                        size={20}
                                        className="text-orange-500"
                                    />

                                    <span className="font-bold">

                                        Available

                                    </span>

                                </div>

                                <div className="text-sm text-slate-500">

                                    Location Enabled

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </section>

    );

}