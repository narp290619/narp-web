import {
    doc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { updateBooking } from "../repositories/booking.repository";

const BOOKINGS_COLLECTION = "Bookings";

function bookingRef(
    bookingId: string,
) {
    return doc(
        db,
        BOOKINGS_COLLECTION,
        bookingId,
    );
}

export async function verifyBooking(
    bookingId: string,
) {

    await updateDoc(
        bookingRef(bookingId),
        {

            status: "verified",

            verifiedAt: serverTimestamp(),

            updatedAt: serverTimestamp(),

        },
    );

}

export async function cancelBooking(
    bookingId: string,
) {

    await updateDoc(
        bookingRef(bookingId),
        {

            status: "cancelled",

            cancelledAt: serverTimestamp(),

            updatedAt: serverTimestamp(),

        },
    );

}

export async function acceptBooking(
    bookingId: string,
) {

    await updateDoc(
        bookingRef(bookingId),
        {

            status: "accepted",

            acceptedAt: serverTimestamp(),

            updatedAt: serverTimestamp(),

        },
    );

}

export async function startBooking(
    bookingId: string,
) {

    await updateDoc(
        bookingRef(bookingId),
        {

            status: "in_progress",

            startedAt: serverTimestamp(),

            updatedAt: serverTimestamp(),

        },
    );

}

export async function completeBooking(
    bookingId: string,
) {

    await updateDoc(
        bookingRef(bookingId),
        {

            status: "completed",

            completedAt: serverTimestamp(),

            updatedAt: serverTimestamp(),

        },
    );

}

export async function updateEta(

    bookingId: string,

    eta: string,

) {

    await updateDoc(

        bookingRef(bookingId),

        {

            eta,

            updatedAt: serverTimestamp(),

        },

    );

}

export async function updatePaymentStatus(

    bookingId: string,

    paymentStatus: string,

) {

    await updateDoc(

        bookingRef(bookingId),

        {

            paymentStatus,

            updatedAt: serverTimestamp(),

        },

    );

}

export async function saveVerificationPhoto(

    bookingId: string,

    selfieUrl: string,

): Promise<void> {

    await updateBooking(

        bookingId,

        {

            selfieUrl,

            verificationStatus: "pending",

            verifiedAt: null,

        },

    );

}

export async function markVerificationPending(
    bookingId: string,
) {

    await updateDoc(
        doc(db, "Bookings", bookingId),
        {

            verificationStatus: "pending",

            updatedAt: serverTimestamp(),

        },
    );

}