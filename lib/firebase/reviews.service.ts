import {
    collection,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { Review } from "@/lib/models/review";

export async function getReviews(
    freelancerId: string,
    skillId: string,
): Promise<Review[]> {

    const q = query(
        collection(db, "Reviews"),
        where("freelancerId", "==", freelancerId),
        where("skillId", "==", skillId),
        orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {

        const data = doc.data();

        return {

            id: doc.id,

            bookingId: data.bookingId,

            freelancerId: data.freelancerId,

            clientId: data.clientId,

            skillId: data.skillId,

            rating: data.rating ?? 0,

            comment: data.comment ?? "",

            autoReplied: data.autoReplied ?? false,

            replies:
                data.replies?.map((reply: any) => ({

                    id: reply.id,

                    senderId: reply.senderId,

                    message: reply.message,

                    isDeleted: reply.isDeleted ?? false,

                    createdAt:
                        reply.createdAt?.toMillis?.() ?? null,

                    deletedAt:
                        reply.deletedAt?.toMillis?.() ?? null,

                })) ?? [],

            createdAt:
                data.createdAt?.toDate?.() ?? null,

        };

    });

}