"use client";

import { Booking } from "@/lib/models/booking";
import { BOOKING_STATUS } from "@/lib/models/booking-status";

import BookingTimelineStep from "./BookingTimelineStep";

interface Props {

    booking: Booking;

}

const timeline = [

    {
        status: BOOKING_STATUS.PENDING,
        title: "Pending",
    },

    {
        status: BOOKING_STATUS.ACCEPTED,
        title: "Accepted",
    },

    {
        status: BOOKING_STATUS.TRAVELLING,
        title: "Travelling",
    },

    {
        status: BOOKING_STATUS.ARRIVED,
        title: "Arrived",
    },

    {
        status: BOOKING_STATUS.IN_PROGRESS,
        title: "In Progress",
    },

    {
        status: BOOKING_STATUS.COMPLETED,
        title: "Completed",
    },

];

export default function BookingTimeline({

    booking,

}: Props) {

    if (

        booking.status === BOOKING_STATUS.CANCELLED ||

        booking.status === BOOKING_STATUS.EXPIRED

    ) {

        return (

            <div
                className="
                    rounded-3xl
                    border
                    border-red-200
                    bg-red-50
                    p-8
                "
            >

                <h2 className="text-xl font-bold text-red-700">

                    Booking Cancelled

                </h2>

                <p className="mt-2 text-red-600">

                    This booking is no longer active.

                </p>

            </div>

        );

    }

    const current = timeline.findIndex(

        step => step.status === booking.status,

    );

    return (

        <div
            className="
                rounded-3xl
                border
                bg-white
                p-8
                shadow-sm
            "
        >

            <h2 className="mb-6 text-xl font-bold">

                Booking Progress

            </h2>

            <div className="space-y-6">

                {timeline.map((step, index) => (

                    <BookingTimelineStep

                        key={step.status}

                        title={step.title}

                        completed={index < current}

                        active={index === current}

                    />

                ))}

            </div>

        </div>

    );

}