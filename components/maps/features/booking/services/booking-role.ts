import { Booking } from "@/lib/models/booking";

export type BookingUserRole =
    | "client"
    | "freelancer"
    | "admin"
    | "unknown";

interface Params {

    booking: Booking;

    currentUserId: string;

    isAdmin?: boolean;

}

export function getBookingUserRole({

    booking,

    currentUserId,

    isAdmin = false,

}: Params): BookingUserRole {

    if (isAdmin) {

        return "admin";

    }

    if (booking.clientId === currentUserId) {

        return "client";

    }

    if (booking.freelancerId === currentUserId) {

        return "freelancer";

    }

    return "unknown";

}