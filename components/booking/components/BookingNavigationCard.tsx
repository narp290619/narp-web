"use client";

import { useBookingTracking } from "@/hooks/useBookingTracking";
import { Booking } from "@/lib/models/booking";

interface Props {
    booking: Booking;
}

export default function BookingNavigationCard({
    booking,
}: Props) {

    const tracking =
        useBookingTracking(
            booking.id,
        );

    return (

        <div
            className="
            rounded-3xl
            border
            bg-white
            p-8
        "
        >

            <h2 className="text-xl font-bold">

                Live Tracking

            </h2>

            {!tracking ? (

                <p className="mt-4 text-slate-500">

                    Waiting for freelancer location...

                </p>

            ) : (

                <div className="mt-6">

                    <a
                        href={`/bookings/${booking.id}/tracking`}
                        className="
                            inline-flex
                            items-center
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-3
                            text-white
                            font-medium
                        "
                    >

                        Open Live Tracking

                    </a>

                    <p>
                        Client:
                        {booking.clientLat}, {booking.clientLng}
                    </p>

                    <p>
                        Freelancer:
                        {tracking?.freelancerLat}, {tracking?.freelancerLng}
                    </p>

                </div>

            )}

        </div>

    );

}