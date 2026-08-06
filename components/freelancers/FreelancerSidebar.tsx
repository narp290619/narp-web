"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    Calendar,
    MessageCircle,
    ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import type { SkillMember } from "@/lib/models/skill-member";

interface Props {
    member: SkillMember;
}

export default function FreelancerSidebar({
    member,
}: Props) {

    const router = useRouter();

    const {

        user,

        loading,

    } = useAuth();

    function handleBookNow() {

        if (loading) {

            return;

        }

        if (!user) {

            router.push("/login");

            return;

        }

        router.push(

            `/book/${member.userId}/${member.skillId}`,

        );

    }

    return (
        <aside className="sticky top-28 space-y-6">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
                <div className="text-center">
                    <div className="text-slate-500">
                        Starting Price
                    </div>

                    <div className="mt-2 text-4xl font-black text-orange-500">
                        ₱{member.startingPrice.toLocaleString()}
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        type="button"
                        onClick={handleBookNow}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-3
                            rounded-xl
                            bg-orange-500
                            px-6
                            py-4
                            font-semibold
                            text-white
                            transition
                            hover:bg-orange-600
                        "
                    >

                        <Calendar size={20} />

                        Book Freelancer

                    </button>

                    <Link
                        href="#"
                        className="flex items-center justify-center gap-3 rounded-xl border px-6 py-4 font-semibold transition hover:bg-slate-50"
                    >
                        <MessageCircle size={20} />
                        Message
                    </Link>
                </div>

                <div className="mt-8 border-t pt-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                        <ShieldCheck
                            size={18}
                            className="text-emerald-500"
                        />
                        Verified by NARP
                    </div>

                    <div className="mt-3">
                        • Secure Payments
                    </div>

                    <div className="mt-2">
                        • Live GPS Tracking
                    </div>

                    <div className="mt-2">
                        • Ratings & Reviews
                    </div>

                    <div className="mt-6 rounded-2xl bg-orange-50 p-5">

                        <div className="text-sm text-slate-500">
                            Response Time
                        </div>

                        <div className="mt-1 font-bold">
                            Usually within 15 minutes
                        </div>

                    </div>

                    <div className="mt-4 rounded-2xl bg-blue-50 p-5">

                        <div className="text-sm text-slate-500">
                            Completed Jobs
                        </div>

                        <div className="mt-1 text-2xl font-bold">
                            {member.completedJobs ?? 0}
                        </div>

                    </div>
                </div>
            </div>
        </aside>
    );
}