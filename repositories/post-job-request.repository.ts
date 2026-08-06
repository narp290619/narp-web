import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    serverTimestamp,
    DocumentSnapshot,
    DocumentData,
    updateDoc,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import { JobRequestSession } from "@/lib/session/jobRequestDraft";

import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export async function createPostJobRequest(
    session: JobRequestSession,
) {

    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be signed in.");
    }

    const draft = session.draft;
    const freelancer = session.freelancer;

    const expiresAt = new Date(
        Date.now() + 12 * 60 * 60 * 1000,
    );

    const closeDialogAt = new Date(
        Date.now() + 30 * 1000,
    );

    const docRef = await addDoc(
        collection(db, "PostJobRequests"),
        {
            skillId: freelancer.skillId,
            clientId: user.uid,
            freelancerId: freelancer.userId,
            freelancerName:
                `${freelancer.firstName} ${freelancer.lastName}`,
            price: freelancer.startingPrice,
            schedule: new Date(
                `${draft.schedule.date}T${draft.schedule.time}`
            ),
            isAsap: false,
            date: draft.schedule.date,
            time: draft.schedule.time,
            details: draft.description,
            status: "pending",
            reviewed: false,
            createdAt: serverTimestamp(),
            expiresAt,
            closeDialogAt,
            paymentStatus: "payment_pending",
            completedAt: null,

            // Optional location fields
            clientLat: draft.location.latitude,
            clientLng: draft.location.longitude,
            address: draft.location.address ?? "",
        }
    );

    return docRef;
}

export interface JobRequest {

    id: string;

    status: string;

    freelancerId: string;

    freelancerName: string;

    skillId: string;

    details: string;

    price: number;

    isAsap: boolean;

    schedule?: Date;

    createdAt?: Date;

}

function mapFirestoreJobRequest(
    snapshot: DocumentSnapshot<DocumentData>,
): JobRequest {

    const data = snapshot.data();

    if (!data) {
        throw new Error("Job request does not exist.");
    }

    return {

        id: snapshot.id,

        status: data.status,

        freelancerId: data.freelancerId,

        freelancerName: data.freelancerName,

        skillId: data.skillId,

        details: data.details,

        price: data.price,

        isAsap: data.isAsap,

        schedule: data.schedule?.toDate(),

        createdAt: data.createdAt?.toDate(),

    };

}

export function subscribeToJobRequest(
    requestId: string,
    callback: (request: JobRequest | null) => void,
) {

    return onSnapshot(

        doc(db, "PostJobRequests", requestId),

        (snapshot) => {

            if (!snapshot.exists()) {

                callback(null);

                return;

            }

            // const data = snapshot.data();

            // callback({

            //     id: snapshot.id,

            //     status: data.status,

            //     freelancerId: data.freelancerId,

            //     freelancerName: data.freelancerName,

            //     skillId: data.skillId,

            //     details: data.details,

            //     price: data.price,

            //     isAsap: data.isAsap,

            //     schedule: data.schedule?.toDate(),

            //     createdAt: data.createdAt?.toDate(),

            // });

            callback(
                mapFirestoreJobRequest(snapshot),
            );

        },

    );

}

export async function cancelJobRequest(
    requestId: string,
) {

    await updateDoc(

        doc(db, "PostJobRequests", requestId),

        {

            status: "cancelled",

            cancelledAt: serverTimestamp(),

        },

    );

}

export async function acceptJobRequest(
    requestId: string,
) {
    const callable = httpsCallable(
        functions,
        "acceptJobRequest",
    );

    const result = await callable({
        bookingId: requestId,
    });

    return result.data;
}

export function subscribeToPendingJobRequests(
    callback: (requests: JobRequest[]) => void,
) {
    const q = query(
        collection(db, "PostJobRequests"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc"),
    );

    return onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<JobRequest, "id">),
        }));

        callback(requests);
    });
}