"use client";

import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";

import type { SkillMember } from "@/lib/models/skill-member";

interface Props {

    member: SkillMember;

}

export default function FreelancerBookingCard({

    member,

}: Props) {

    return (

        <section
            className="
                rounded-2xl
                border
                bg-white
                p-6
            "
        >

            <h2
                className="
                    mb-5
                    text-xl
                    font-bold
                "
            >

                You're booking

            </h2>

            <div
                className="
                    flex
                    items-center
                    gap-5
                "
            >

                <Image

                    src={
                        member.profileImageUrl ||
                        "/images/default-avatar.png"
                    }

                    alt={`${member.firstName} ${member.lastName}`}

                    width={88}

                    height={88}

                    className="
                        h-22
                        w-22
                        rounded-full
                        border
                        object-cover
                    "

                />

                <div className="flex-1">

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <h3
                            className="
                                text-xl
                                font-bold
                            "
                        >

                            {member.firstName} {member.lastName}

                        </h3>

                        {

                            member.isVerified && (

                                <BadgeCheck

                                    size={20}

                                    className="
                                        text-sky-500
                                    "

                                />

                            )

                        }

                    </div>

                    <p
                        className="
                            mt-1
                            text-slate-500
                        "
                    >

                        {member.skillId}

                    </p>

                    <div
                        className="
                            mt-3
                            flex
                            items-center
                            gap-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-1
                            "
                        >

                            <Star

                                size={18}

                                className="
                                    fill-yellow-400
                                    text-yellow-400
                                "

                            />

                            <span className="font-semibold">

                                {member.rating.toFixed(1)}

                            </span>

                            <span className="text-slate-500">

                                ({member.reviewCount})

                            </span>

                        </div>

                        <div
                            className="
                                rounded-full
                                bg-orange-50
                                px-4
                                py-1

                                text-sm
                                font-semibold
                                text-orange-600
                            "
                        >

                            Starts at ₱
                            {member.startingPrice.toLocaleString("en-PH")}

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}