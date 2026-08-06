"use client";

import BookingInfoCard from "@/components/booking/components/BookingInfoCard";
import BookingStatusBadge from "@/components/booking/components/BookingStatusBadge";
import BookingActions from "@/components/booking/components/BookingActions";
import { useBooking } from "@/hooks/useBookings";
import VerificationStatusBadge from "./components/VerificationStatusBadge";
import VerificationProgressCard from "./components/VerificationProgressCard";
import BookingProgressCard from "./components/BookingProgressCard";
import { BOOKING_STATUS } from "@/lib/models/booking-status";
import BookingStatusBanner from "./components/BookingStatusBanner";
import BookingTimeline from "./components/BookingTimeline";
import { auth } from "@/lib/firebase";
import FreelancerWorkflowCard from "./components/FreelancerWorkflowCard";
import BookingNavigationCard from "./components/BookingNavigationCard";


interface Props {

    bookingId: string;

}

export default function BookingDetailsClient({

    bookingId,

}: Props) {

    const {

        booking,

        loading,

        error,

    } = useBooking(bookingId);

    if (loading) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    bg-white
                    p-8
                    text-center
                "
            >

                Loading booking...

            </div>

        );

    }

    if (error) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-8
                    text-red-600
                "
            >

                Failed to load booking.

            </div>

        );

    }

    if (!booking) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    p-8
                "
            >

                Booking not found.

            </div>

        );

    }

    const uid = auth.currentUser?.uid;

    const currentBooking = booking;

    const role =
        uid === currentBooking.clientId
            ? "client"
            : uid === currentBooking.freelancerId
                ? "freelancer"
                : "unknown";

    return (

        <div className="space-y-6">

            <section
                className="
                    rounded-3xl
                    border
                    bg-white
                    p-8
                    shadow-sm
                "
            >

                <h1 className="text-3xl font-bold">

                    Booking Details

                </h1>

                <BookingStatusBanner
                    booking={currentBooking}
                />

                <BookingTimeline
                    booking={currentBooking}
                />

                {

                    booking.status === BOOKING_STATUS.TRAVELLING && (

                        <BookingNavigationCard

                            booking={booking}

                        />

                    )

                }

                <div
                    className="
                        mt-8
                        grid
                        gap-4
                        md:grid-cols-2
                    "
                >

                    <BookingInfoCard

                        label="Schedule"

                        value={`${currentBooking.date} • ${currentBooking.time}`}

                    />

                    {/* <BookingInfoCard

                        label="Status"

                        value={

                            <BookingStatusBadge

                                status={booking.status}

                            />

                        }

                    /> */}

                    <BookingInfoCard

                        label="Address"

                        value={

                            currentBooking.address ??

                            "--"

                        }

                    />

                    {/* <BookingInfoCard

                        label="Payment"

                        value={

                            booking.paymentStatus

                        }

                    /> */}

                    <BookingInfoCard

                        label="ETA"

                        value={

                            currentBooking.eta ??

                            "--"

                        }

                    />

                    <BookingInfoCard

                        label="Description"

                        value={

                            currentBooking.details

                        }

                    />

                    <BookingInfoCard
                        label="Identity Verification"
                        value={
                            <VerificationStatusBadge
                                status={currentBooking.verificationStatus}
                            />
                        }
                    />

                </div>

            </section>

            <VerificationProgressCard
                status={currentBooking.verificationStatus}
                confidence={currentBooking.verificationConfidence ?? undefined}
            />

            {/* {booking.status === BOOKING_STATUS.ACCEPTED &&
                booking.paymentStatus === "held" && (

                    <BookingProgressCard
                        title="Waiting for Freelancer"
                        description="Your payment has been secured. The freelancer will begin travelling soon."
                    />

                )}

            {booking.status === BOOKING_STATUS.TRAVELLING && (

                <BookingProgressCard
                    title="Freelancer is on the way"
                    description="The freelancer has started travelling to your location."
                />

            )}

            {booking.status === BOOKING_STATUS.ARRIVED && (

                <BookingProgressCard
                    title="Freelancer has arrived"
                    description="Please meet your freelancer to begin the service."
                />

            )}

            {booking.status === BOOKING_STATUS.IN_PROGRESS && (

                <BookingProgressCard
                    title="Service in progress"
                    description="The freelancer is currently working on your request."
                />

            )} */}

            {role === "freelancer" && (

                <FreelancerWorkflowCard
                    booking={currentBooking}
                />

            )}

            <BookingActions

                booking={currentBooking}

            />

        </div>

    );

}