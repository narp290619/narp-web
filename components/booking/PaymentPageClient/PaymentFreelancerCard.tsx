"use client";

import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";

import type { SkillMember } from "@/lib/models/skill-member";

interface Props {

    freelancer: SkillMember;

}

export default function PaymentFreelancerCard({

    freelancer,

}: Props) {

    return (

        <section
            className="
                rounded-3xl
                border
                bg-white
                p-6
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    items-start
                    gap-5
                "
            >

                <Image

                    src={
                        freelancer.profileImageUrl ||
                        "/images/default-avatar.png"
                    }

                    alt={`${freelancer.firstName} ${freelancer.lastName}`}

                    width={96}

                    height={96}

                    className="
                        h-24
                        w-24
                        rounded-full
                        object-cover
                        border
                    "

                />

                <div className="flex-1">

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            flex-wrap
                        "
                    >

                        <h2
                            className="
                                text-2xl
                                font-bold
                            "
                        >

                            {freelancer.firstName}
                            {" "}
                            {freelancer.lastName}

                        </h2>

                        {

                            freelancer.isVerified && (

                                <BadgeCheck
                                    size={22}
                                    className="text-blue-500"
                                />

                            )

                        }

                    </div>

                    <div
                        className="
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-6
                            text-slate-600
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <Star
                                size={18}
                                className="
                                    fill-yellow-400
                                    text-yellow-400
                                "
                            />

                            <span
                                className="
                                    font-semibold
                                "
                            >

                                {freelancer.rating.toFixed(1)}

                            </span>

                            <span>

                                ({freelancer.reviewCount} reviews)

                            </span>

                        </div>

                        <div>

                            <span
                                className="
                                    text-slate-500
                                "
                            >

                                Starting at

                            </span>

                            <div
                                className="
                                    text-xl
                                    font-bold
                                    text-orange-600
                                "
                            >

                                ₱
                                {freelancer.startingPrice.toLocaleString()}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}