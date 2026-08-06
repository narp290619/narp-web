import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface CreateVerificationRequestParams {

    // bookingId: string;

    userId: string;

    selfieUrl: string;

}

export interface VerificationResult {

    success: boolean;

    similarity?: number;

}

export async function createVerificationRequest({

    // bookingId,

    userId,

    selfieUrl,

}: CreateVerificationRequestParams): Promise<string> {

    const request = await addDoc(

        collection(

            db,

            "FaceAuthenticationRequests",

        ),

        {

            // bookingId,

            userId,

            selfieUrl,

            /*
             * Temporary values.
             * Later the backend AI
             * will calculate these.
             */
            similarity: 0.95,

            livenessPassed: true,

            deviceId: navigator.userAgent,

            createdAt: serverTimestamp(),

        },

    );

    return request.id;

}

export function waitForVerificationResult(

    requestId: string,

): Promise<VerificationResult> {

    return new Promise((resolve) => {

        const unsubscribe = onSnapshot(

            doc(

                db,

                "FaceAuthenticationResults",

                requestId,

            ),

            (snapshot) => {

                if (!snapshot.exists()) {

                    return;

                }

                const data = snapshot.data();

                unsubscribe();

                resolve({

                    success: data.authenticated,

                    similarity: data.similarity,

                });

            },

        );

    });

}