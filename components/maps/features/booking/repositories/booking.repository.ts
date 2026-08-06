import {
    addDoc,
    collection,
    doc,
    DocumentReference,
    getDoc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";

import {
    getFunctions,
    httpsCallable,
} from "firebase/functions";

import { auth, db, functions } from "@/lib/firebase";

import { Booking, BookingStatus } from "@/lib/models/booking";
import { SkillMember } from "@/lib/models/skill-member";

import { JobRequestDraft } from "@/components/maps/features/booking/types/JobRequestDraft";

import {
    mapBookingFromFirestore,
    mapBookingToFirestore,
} from "@/components/maps/features/booking/mappers/booking.mapper";
import { PAYMENT_STATUS } from "@/lib/models/payment-status";
import { BOOKING_STATUS } from "@/lib/models/booking-status";

interface CreateBookingParams {

    booking: JobRequestDraft;

    freelancer: SkillMember;

}

export async function createBooking({
    booking,
    freelancer,
}: CreateBookingParams): Promise<DocumentReference> {

    const user = auth.currentUser;

    if (!user) {
        throw new Error("User must be signed in.");
    }

    const document = mapBookingToFirestore({
        booking,
        freelancer,
        clientId: user.uid,
    });

    return await addDoc(
        collection(db, "Bookings"),
        document,
    );
}

export async function getBooking(

    bookingId: string,

): Promise<Booking | null> {

    const snapshot = await getDoc(

        doc(

            db,

            "Bookings",

            bookingId,

        ),

    );

    if (!snapshot.exists()) {

        return null;

    }

    return mapBookingFromFirestore(

        snapshot,

    );

}

export async function updateBooking(

    bookingId: string,

    data: Partial<Booking>,

): Promise<void> {

    await updateDoc(

        doc(
            db,
            "Bookings",
            bookingId,
        ),

        data,

    );

}

export async function markBookingPaymentHeld(
    bookingId: string,
) {
    return updateBooking(bookingId, {
        paymentStatus: PAYMENT_STATUS.HELD,
    });
}

export async function markWorkerOnTheWay(
    bookingId: string,
) {
    return updateBooking(bookingId, {
        status: BOOKING_STATUS.TRAVELLING,
    });
}

export async function markArrived(
    bookingId: string,
) {
    return updateBooking(bookingId, {
        status: "arrived",
    });
}

export async function startBooking(
    bookingId: string,
) {
    return updateBooking(bookingId, {
        status: "in_progress",
    });
}

export async function updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
): Promise<void> {

    await updateBooking(
        bookingId,
        {
            status,
        },
    );

}

export async function completeBooking(
    bookingId: string,
) {

    const callable =
        httpsCallable(
            functions,
            "completeBooking",
        );

    await callable({
        bookingId,
    });

}

export async function confirmJobCompletion(
    bookingId: string,
) {

    const functions =
        getFunctions(undefined, "asia-southeast1");

    const callable =
        httpsCallable(
            functions,
            "confirmJobCompletion",
        );

    await callable({
        bookingId,
    });

}

export function subscribeToBooking(

    bookingId: string,

    callback: (booking: Booking | null) => void,

) {

    return onSnapshot(

        doc(db, "Bookings", bookingId),

        (snapshot) => {

            if (!snapshot.exists()) {

                callback(null);

                return;

            }

            callback(

                mapBookingFromFirestore(snapshot),

            );

        },

        (error) => {

            console.error(error);

        },

    );

}

export async function requestCompletion(
    bookingId: string,
) {

    return updateBooking(
        bookingId,
        {
            status:
                BOOKING_STATUS.COMPLETION_REQUESTED,
        },
    );

}
