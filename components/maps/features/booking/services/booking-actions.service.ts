import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { Booking } from "@/lib/models/booking";
import { BOOKING_STATUS } from "@/lib/models/booking-status";

import { cancelBooking } from "./booking.service";
import { BookingAction } from "@/components/booking/components/BookingActions";
import { confirmJobCompletion, requestCompletion, updateBookingStatus } from "../repositories/booking.repository";
import { getBookingUserRole } from "./booking-role";

interface GetBookingActionsParams {
    booking: Booking;
    router: AppRouterInstance;
    currentUserId: string;
    isAdmin?: boolean;
}

export function getBookingActions({
    booking,
    router,
    currentUserId,
    isAdmin,
}: GetBookingActionsParams): BookingAction[] {

    const role = getBookingUserRole({

        booking,

        currentUserId,

        isAdmin,

    });

    const actions: BookingAction[] = [];

    const isClient =
        booking.clientId === currentUserId;

    const isFreelancer =
        booking.freelancerId === currentUserId;

    switch (booking.status) {

        case BOOKING_STATUS.PENDING:

            // Identity not yet verified
            if (booking.verificationStatus !== "verified") {

                actions.push({
                    id: "verify",
                    label: "Verify Identity",
                    variant: "primary",
                    onClick: () => {
                        router.push(
                            `/bookings/${booking.id}/face-verification`,
                        );
                    },
                });

            }
            // Verified but payment still pending
            else if (booking.paymentStatus === "payment_pending") {

                actions.push({
                    id: "payment",
                    label: "Pay Now",
                    variant: "primary",
                    onClick: () => {
                        router.push(
                            `/bookings/${booking.id}/payment`,
                        );
                    },
                });

            }

            actions.push({
                id: "cancel",
                label: "Cancel Booking",
                variant: "danger",
                onClick: async () => {

                    if (
                        !confirm(
                            "Are you sure you want to cancel this booking?",
                        )
                    ) {
                        return;
                    }

                    await cancelBooking(
                        booking.id,
                    );
                },
            });

            break;

        case BOOKING_STATUS.ACCEPTED:

            if (booking.paymentStatus === "payment_pending") {

                actions.push({
                    id: "payment",
                    label: "Pay Now",
                    variant: "primary",
                    onClick: () => {
                        router.push(`/bookings/${booking.id}/payment`);
                    }

                });

            }

            else if (

                booking.paymentStatus === "held" &&

                role === "freelancer"

            ) {

                actions.push({

                    id: "start_navigation",

                    label: "Start Navigation",

                    variant: "primary",

                    onClick: async () => {

                        await updateBookingStatus(

                            booking.id,

                            BOOKING_STATUS.TRAVELLING,

                        );

                    },

                });

            }

            else if (

                booking.paymentStatus === "held" &&

                role === "client"

            ) {

                actions.push({

                    id: "waiting",

                    label: "Waiting for Freelancer",

                    variant: "secondary",

                    disabled: true,

                    onClick: () => { },

                });

            }

            break;

        case BOOKING_STATUS.TRAVELLING:

            if (role === "freelancer") {

                actions.push({
                    id: "arrived",
                    label: "I've Arrived",
                    variant: "primary",
                    onClick: async () => {

                        if (
                            !confirm("Confirm that you've arrived at the client's location?")
                        ) {
                            return;
                        }

                        await updateBookingStatus(
                            booking.id,
                            BOOKING_STATUS.ARRIVED,
                        );

                    },
                });

            }

            else if (role === "client") {

                actions.push({
                    id: "track",
                    label: "Track Freelancer",
                    variant: "primary",
                    onClick: () =>
                        router.push(
                            `/bookings/${booking.id}/tracking`,
                        ),
                });

            }

            break;

        case BOOKING_STATUS.ARRIVED:

            if (role === "freelancer") {

                actions.push({
                    id: "start_job",
                    label: "Start Job",
                    variant: "primary",
                    onClick: async () => {

                        if (
                            !confirm("Start working on this booking?")
                        ) {
                            return;
                        }

                        await updateBookingStatus(
                            booking.id,
                            BOOKING_STATUS.IN_PROGRESS,
                        );

                    },
                });

            }

            else if (role === "client") {

                actions.push({
                    id: "worker_arrived",
                    label: "Freelancer Has Arrived",
                    variant: "secondary",
                    disabled: true,
                    onClick: () => { },
                });

            }

            break;

        case BOOKING_STATUS.IN_PROGRESS:

            if (role === "freelancer") {

                actions.push({

                    id: "request_completion",

                    label: "Request Completion",

                    variant: "primary",

                    onClick: async () => {

                        await requestCompletion(
                            booking.id,
                        );

                    },

                });

            }

            else if (role === "client") {

                actions.push({

                    id: "job_in_progress",

                    label: "Job In Progress",

                    variant: "secondary",

                    disabled: true,

                    onClick: () => { },

                });

            }

            break;

        case BOOKING_STATUS.COMPLETION_REQUESTED:

            if (role === "client") {

                actions.push({

                    id: "confirm_completion",

                    label: "Confirm Job Completion",

                    variant: "primary",

                    onClick: async () => {

                        if (

                            !confirm(

                                "Release payment and finish this booking?"

                            )

                        ) {

                            return;

                        }

                        await confirmJobCompletion(

                            booking.id,

                        );

                    },

                });

            }

            else if (role === "freelancer") {

                actions.push({

                    id: "waiting",

                    label: "Waiting for Client Confirmation",

                    variant: "secondary",

                    disabled: true,

                    onClick: () => { },

                });

            }

            break;

        case BOOKING_STATUS.COMPLETED:

            if (booking.paymentStatus === "held") {

                actions.push({

                    id: "confirm_completion",

                    label: "Confirm Job Completion",

                    variant: "primary",

                    onClick: async () => {

                        if (
                            !confirm(
                                "Release the payment and mark this booking as finished?"
                            )
                        ) {
                            return;
                        }

                        await confirmJobCompletion(
                            booking.id,
                        );

                    },

                });

            }

            else if (
                booking.paymentStatus === "released" &&
                !booking.reviewed
            ) {

                if (role === "client") {

                    actions.push({

                        id: "review",

                        label: "Leave Review",

                        variant: "primary",

                        onClick: () =>
                            router.push(
                                `/bookings/${booking.id}/review`,
                            ),

                    });

                }

                else if (role === "freelancer") {

                    actions.push({

                    id: "payment_released",

                    label: "Payment Released",

                    variant: "secondary",

                    disabled: true,

                    onClick: () => { },

                });


                }

            }

            break;
    }

    return actions;
}