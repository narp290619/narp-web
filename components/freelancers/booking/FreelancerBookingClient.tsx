"use client";

import { useBooking } from "@/hooks/useBookings";

import BookingInfoCard from "@/components/booking/components/BookingInfoCard";
import BookingStatusBadge from "@/components/booking/components/BookingStatusBadge";

import FreelancerBookingActions from "./FreelancerBookingActions";

interface Props {
    bookingId: string;
}

export default function FreelancerBookingClient({
    bookingId,
}: Props) {

    const {
        booking,
        loading,
        error,
    } = useBooking(bookingId);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !booking) {
        return <div>Booking not found.</div>;
    }

    return (

        <div className="space-y-6">

            <section className="rounded-3xl border bg-white p-8 shadow-sm">

                <h1 className="text-3xl font-bold">
                    Freelancer Booking
                </h1>

                <div className="mt-8 grid gap-4 md:grid-cols-2">

                    <BookingInfoCard
                        label="Status"
                        value={
                            <BookingStatusBadge
                                status={booking.status}
                            />
                        }
                    />

                    <BookingInfoCard
                        label="Customer"
                        value={booking.clientId}
                    />

                    <BookingInfoCard
                        label="Address"
                        value={booking.address ?? "--"}
                    />

                    <BookingInfoCard
                        label="Schedule"
                        value={`${booking.date} • ${booking.time}`}
                    />

                    <BookingInfoCard
                        label="Payment"
                        value={booking.paymentStatus}
                    />

                </div>

            </section>

            <FreelancerBookingActions
                booking={booking}
            />

        </div>

    );

}