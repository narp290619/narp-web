import {
    doc,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface BookingTracking {

    freelancerLat: number;

    freelancerLng: number;

    heading?: number;

    speed?: number;

    eta?: string | null;

    distance?: string | null;

    lastUpdated?: Timestamp | null;

}

export function subscribeBookingTracking(

    bookingId: string,

    callback: (
        tracking: BookingTracking | null,
    ) => void,

) {

    return onSnapshot(

        doc(db, "Bookings", bookingId),

        (snapshot) => {

            if (!snapshot.exists()) {

                callback(null);

                return;

            }

            const data = snapshot.data();

            callback(
                data.tracking ?? null,
            );

        },

    );

}