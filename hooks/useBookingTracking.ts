"use client";

import { BookingTracking, subscribeBookingTracking } from "@/components/maps/features/booking/repositories/booking-tracking.repository";
import { useEffect, useState } from "react";



export function useBookingTracking(

    bookingId: string,

) {

    const [

        tracking,

        setTracking,

    ] = useState<BookingTracking | null>(null);

    useEffect(() => {

        const unsubscribe =
            subscribeBookingTracking(

                bookingId,

                setTracking,

            );

        return unsubscribe;

    }, [

        bookingId,

    ]);

    return tracking;

}