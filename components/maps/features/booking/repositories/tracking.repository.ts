import {
    doc,
    updateDoc,
    onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function updateBookingTracking(

    bookingId: string,

    data: {

        freelancerLat: number;

        freelancerLng: number;

        eta: string;

        distance: string;

        heading?: number;

    }

) {

    await updateDoc(

        doc(db, "Bookings", bookingId),

        {

            ...data,

            lastLocationUpdate: new Date(),

        },

    );

}

export function subscribeBookingTracking(

    bookingId: string,

    callback: (data: any) => void,

) {

    return onSnapshot(

        doc(db, "Bookings", bookingId),

        (snapshot) => {

            callback(snapshot.data());

        },

    );

}