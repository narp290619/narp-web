import { BOOKING_STATUS } from "@/lib/models/booking-status";
import { PaymentStatus } from "@/lib/models/booking";

export interface BookingStatusUI {

    title: string;

    description: string;

}

export function getBookingStatusUI(

    status: string,

    paymentStatus: PaymentStatus,

): BookingStatusUI {

    if (paymentStatus === "payment_pending") {

        return {

            title: "Waiting for Payment",

            description:
                "Complete your payment to confirm this booking.",

        };

    }

    if (paymentStatus === "held") {

        switch (status) {

            case BOOKING_STATUS.ACCEPTED:

                return {

                    title: "Waiting for Freelancer",

                    description:
                        "Your payment is securely held in escrow while the freelancer prepares.",

                };

            case BOOKING_STATUS.TRAVELLING:

                return {

                    title: "Freelancer is Travelling",

                    description:
                        "Your freelancer is on the way.",

                };

            case BOOKING_STATUS.ARRIVED:

                return {

                    title: "Freelancer Arrived",

                    description:
                        "Meet your freelancer to begin the service.",

                };

            case BOOKING_STATUS.IN_PROGRESS:

                return {

                    title: "Service in Progress",

                    description:
                        "Your booking is currently underway.",

                };

            case BOOKING_STATUS.COMPLETED:

                return {

                    title: "Completed",

                    description:
                        "Your booking has been completed successfully.",

                };

        }

    }

    return {

        title: "Booking",

        description: "Booking information",

    };

}