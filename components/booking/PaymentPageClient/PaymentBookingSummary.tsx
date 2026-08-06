"use client";

import {
    CalendarDays,
    Clock3,
    FileText,
    MapPin,
    Briefcase,
} from "lucide-react";

import type { Booking } from "@/lib/models/booking";

interface Props {

    booking: Booking;

    skillName?: string;

}

export default function PaymentBookingSummary({

    booking,

    skillName,

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

            <h2
                className="
                    mb-6
                    text-2xl
                    font-bold
                "
            >

                Booking Summary

            </h2>

            <div className="space-y-5">

                {

                    skillName && (

                        <SummaryRow

                            icon={<Briefcase size={20} />}

                            label="Service"

                            value={skillName}

                        />

                    )

                }

                <SummaryRow

                    icon={<CalendarDays size={20} />}

                    label="Date"

                    value={booking.date}

                />

                <SummaryRow

                    icon={<Clock3 size={20} />}

                    label="Time"

                    value={booking.time}

                />

                <SummaryRow

                    icon={<MapPin size={20} />}

                    label="Location"

                    value={
                        booking.address ||
                        "No address provided"
                    }

                />

                <SummaryRow

                    icon={<FileText size={20} />}

                    label="Job Description"

                    value={
                        booking.details ||
                        "No description provided"
                    }

                    multiline

                />

            </div>

        </section>

    );

}

interface SummaryRowProps {

    icon: React.ReactNode;

    label: string;

    value: string;

    multiline?: boolean;

}

function SummaryRow({

    icon,

    label,

    value,

    multiline = false,

}: SummaryRowProps) {

    return (

        <div
            className="
                flex
                items-start
                gap-4
            "
        >

            <div
                className="
                    mt-1
                    text-orange-500
                "
            >

                {icon}

            </div>

            <div className="flex-1">

                <p
                    className="
                        text-sm
                        text-slate-500
                    "
                >

                    {label}

                </p>

                <p
                    className={`
                        mt-1
                        font-semibold
                        text-slate-800

                        ${
                            multiline
                                ? "whitespace-pre-wrap"
                                : ""
                        }
                    `}
                >

                    {value}

                </p>

            </div>

        </div>

    );

}