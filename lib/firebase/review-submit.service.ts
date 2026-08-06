import {
    writeBatch,
    collection,
    doc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface SubmitReviewParams {

    bookingId: string;

    freelancerId: string;

    clientId: string;

    clientName: string;

    clientProfileImageUrl?: string;

    clientVerified?: boolean;

    skillId: string;

    rating: number;

    comment: string;

}

export async function submitReview({

    bookingId,

    freelancerId,

    clientId,

    clientName,

    clientProfileImageUrl,

    clientVerified,

    skillId,

    rating,

    comment,

}: SubmitReviewParams): Promise<void> {

    const batch = writeBatch(db);

    //
    // Review document
    //

    const reviewRef = doc(
        collection(db, "Reviews"),
    );

    batch.set(reviewRef, {

        bookingId,

        freelancerId,

        clientId,

        clientName,

        clientProfileImageUrl,

        clientVerified,

        skillId,

        rating,

        comment,

        createdAt: serverTimestamp(),

    });

    //
    // Booking
    //

    batch.update(

        doc(db, "Bookings", bookingId),

        {

            reviewed: true,

            updatedAt: serverTimestamp(),

        },

    );

    //
    // Original Job Request
    //

    batch.update(

        doc(db, "PostJobRequests", bookingId),

        {

            reviewed: true,

        },

    );

    await batch.commit();

}