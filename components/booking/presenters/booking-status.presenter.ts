import { Booking } from "@/lib/models/booking";
import { PAYMENT_STATUS } from "@/lib/models/payment-status";
import { BOOKING_STATUS } from "@/lib/models/booking-status";

export interface BookingStatusPresentation {

    title: string;

    description: string;

    color: string;

    icon: string;

}

export function getBookingStatusPresentation(

    booking: Booking,

): BookingStatusPresentation {

    if (

        booking.paymentStatus ===
        PAYMENT_STATUS.PENDING

    ) {

        return {

            title: "Awaiting Payment",

            description:
                "Complete payment to confirm your booking.",

            color:
                "border-yellow-200 bg-yellow-50 text-yellow-900",

            icon: "💳",

        };

    }

    switch (booking.status) {

        case BOOKING_STATUS.ACCEPTED:

            return {

                title: "Payment Confirmed",

                description:
                    "Your booking is confirmed. Waiting for the freelancer.",

                color:
                    "border-blue-200 bg-blue-50 text-blue-900",

                icon: "✅",

            };

        case BOOKING_STATUS.TRAVELLING:

            return {

                title: "Freelancer On The Way",

                description:
                    "Your freelancer is travelling to your location.",

                color:
                    "border-sky-200 bg-sky-50 text-sky-900",

                icon: "🚗",

            };

        case BOOKING_STATUS.ARRIVED:

            return {

                title: "Freelancer Arrived",

                description:
                    "Your freelancer has arrived.",

                color:
                    "border-green-200 bg-green-50 text-green-900",

                icon: "📍",

            };

        case BOOKING_STATUS.IN_PROGRESS:

            return {

                title: "Service In Progress",

                description:
                    "The requested service is currently being performed.",

                color:
                    "border-orange-200 bg-orange-50 text-orange-900",

                icon: "🛠️",

            };

        case BOOKING_STATUS.COMPLETED:

            return {

                title: "Booking Completed",

                description:
                    "Thank you for using Narp.",

                color:
                    "border-emerald-200 bg-emerald-50 text-emerald-900",

                icon: "🎉",

            };

        case BOOKING_STATUS.CANCELLED:

            return {

                title: "Booking Cancelled",

                description:
                    "This booking has been cancelled.",

                color:
                    "border-red-200 bg-red-50 text-red-900",

                icon: "❌",

            };

        default:

            return {

                title: "Booking",

                description: "",

                color:
                    "border-slate-200 bg-slate-50 text-slate-900",

                icon: "📄",

            };

    }

}