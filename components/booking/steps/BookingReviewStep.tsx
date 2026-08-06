"use client";

import BookingPriceSummary from "@/components/maps/features/booking/components/BookingPriceSummary";
import FreelancerBookingCard from "@/components/maps/features/booking/components/FreelancerBookingCard";
import { JobRequestDraft } from "@/components/maps/features/booking/types/JobRequestDraft";
import { SkillMember } from "@/lib/models/skill-member";
import { CalendarDays, Clock3, MapPin, FileText } from "lucide-react";


interface Props {
    booking: JobRequestDraft;
    member: SkillMember;
}

export default function BookingReviewStep({
    booking,
    member,
}: Props) {

    const platformFee = member.startingPrice * 0.10;

    return (
        <div className="space-y-6">

            <div>
                <h2 className="text-2xl font-bold">
                    Review Booking
                </h2>

                <p className="mt-1 text-slate-500">
                    Please verify your booking details before continuing.
                </p>
            </div>

            <FreelancerBookingCard

                member={member}

            />

            <div className="rounded-2xl border bg-white">

                <div className="flex items-start gap-4 border-b p-5">

                    <CalendarDays
                        className="mt-1 text-orange-500"
                        size={20}
                    />

                    <div>

                        <p className="text-sm text-slate-500">
                            Booking Date
                        </p>

                        <p className="font-semibold">
                            {booking.schedule.date || "-"}
                        </p>

                    </div>

                </div>

                <div className="flex items-start gap-4 border-b p-5">

                    <Clock3
                        className="mt-1 text-orange-500"
                        size={20}
                    />

                    <div>

                        <p className="text-sm text-slate-500">
                            Booking Time
                        </p>

                        <p className="font-semibold">
                            {booking.schedule.time || "-"}
                        </p>

                    </div>

                </div>

                <div className="flex items-start gap-4 border-b p-5">

                    <MapPin
                        className="mt-1 text-orange-500"
                        size={20}
                    />

                    <div>

                        <p className="text-sm text-slate-500">
                            Service Location
                        </p>

                        <p className="font-semibold">
                            {booking.location.address ??
                                "No address selected"}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            {booking.location.latitude.toFixed(6)},
                            {" "}
                            {booking.location.longitude.toFixed(6)}
                        </p>

                    </div>

                </div>

                <div className="flex items-start gap-4 p-5">

                    <FileText
                        className="mt-1 text-orange-500"
                        size={20}
                    />

                    <div>

                        <p className="text-sm text-slate-500">
                            Job Description
                        </p>

                        <p className="whitespace-pre-wrap font-semibold">
                            {booking.description || "-"}
                        </p>

                    </div>

                </div>

            </div>

            <BookingPriceSummary

                serviceFee={member.startingPrice}

                platformFee={platformFee}

            />

        </div>
    );
}