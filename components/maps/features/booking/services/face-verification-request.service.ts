import {
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface CreateFaceVerificationRequestParams {

    bookingId: string;

    clientId: string;

    selfieUrl: string;

}

export async function createFaceVerificationRequest({

    bookingId,

    clientId,

    selfieUrl,

}: CreateFaceVerificationRequestParams) {

    const document = {

        bookingId,

        clientId,

        selfieUrl,

        status: "pending",

        createdAt: serverTimestamp(),

    };

    const reference = await addDoc(

        collection(

            db,

            "FaceVerificationRequests",

        ),

        document,

    );

    return reference.id;

}