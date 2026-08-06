import {
    doc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function replyToReview(

    reviewId: string,

    message: string,

) {

    await updateDoc(

        doc(db, "Reviews", reviewId),

        {

            freelancerReply: message.trim(),

            freelancerReplyAt: serverTimestamp(),

        },

    );

}