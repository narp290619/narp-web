"use client";

import { useState } from "react";

import { Booking } from "@/lib/models/booking";
import {
    BOOKING_STATUS,
} from "@/lib/models/booking-status";

import {
    completeBooking,
    updateBookingStatus,
} from "@/components/maps/features/booking/repositories/booking.repository";

interface Props {
    booking: Booking;
}

export default function FreelancerBookingActions({
    booking,
}: Props) {

    const [loading, setLoading] = useState(false);

    async function transition(nextStatus: Booking["status"]) {

        if (loading) return;

        try {

            setLoading(true);

            if (nextStatus === BOOKING_STATUS.COMPLETED) {

                await completeBooking(
                    booking.id,
                );

            } else {

                await updateBookingStatus(
                    booking.id,
                    nextStatus,
                );

            }

        } finally {

            setLoading(false);

        }

    }

    let label: string | null = null;
    let nextStatus: Booking["status"] | null = null;

    switch (booking.status) {

        case BOOKING_STATUS.ACCEPTED:

            label = "Start Navigation";
            nextStatus = BOOKING_STATUS.TRAVELLING;
            break;

        case BOOKING_STATUS.TRAVELLING:

            label = "I've Arrived";
            nextStatus = BOOKING_STATUS.ARRIVED;
            break;

        case BOOKING_STATUS.ARRIVED:

            label = "Start Job";
            nextStatus = BOOKING_STATUS.IN_PROGRESS;
            break;

        case BOOKING_STATUS.IN_PROGRESS:

            label = "Complete Job";
            nextStatus = BOOKING_STATUS.COMPLETED;
            break;

        default:

            return null;

    }

    return (

        <section
            className="
                rounded-2xl
                border
                bg-white
                p-6
                shadow-sm
            "
        >

            <h2 className="text-xl font-semibold">
                Actions
            </h2>

            <button
                className="
                    mt-6
                    w-full
                    rounded-xl
                    bg-orange-500
                    py-4
                    font-semibold
                    text-white
                    disabled:opacity-50
                "
                disabled={loading}
                onClick={() => transition(nextStatus!)}
            >
                {loading ? "Updating..." : label}
            </button>

        </section>

    );

}