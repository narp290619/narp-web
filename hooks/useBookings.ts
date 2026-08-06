"use client";

import { useEffect, useState } from "react";
import {
    doc,
    onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Booking } from "@/lib/models/booking";

interface UseBookingResult {

    booking: Booking | null;

    loading: boolean;

    error: Error | null;

}

export function useBooking(
    bookingId: string,
): UseBookingResult {

    const [booking, setBooking] =
        useState<Booking | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<Error | null>(null);

    useEffect(() => {

        if (!bookingId) {

            setLoading(false);

            return;

        }

        const unsubscribe =
            onSnapshot(

                doc(
                    db,
                    "Bookings",
                    bookingId,
                ),

                (snapshot) => {

                    if (!snapshot.exists()) {

                        setBooking(null);

                        setLoading(false);

                        return;

                    }

                    setBooking({

                        id: snapshot.id,

                        ...(snapshot.data() as Omit<Booking, "id">),

                    });

                    setLoading(false);

                },

                (err) => {

                    setError(err);

                    setLoading(false);

                },

            );

        return unsubscribe;

    }, [bookingId]);

    return {

        booking,

        loading,

        error,

    };

}