"use client";

import type { SkillMember } from "@/lib/models/skill-member";

interface Props {

    freelancer: SkillMember;

}

export default function BookingHeader({

    freelancer,

}: Props) {

    return (

        <>
            <h1 className="text-3xl font-bold">

                Book {freelancer.firstName}

            </h1>

            <p className="mt-2 text-slate-500">

                Complete the booking information before continuing to
                identity verification and payment.

            </p>
        </>

    );

}