import {
    Timestamp,
    DocumentSnapshot,
    QueryDocumentSnapshot,
    DocumentData,
    GeoPoint,
} from "firebase/firestore";

import { SkillMember } from "@/lib/models/skill-member";
import { Booking } from "@/lib/models/booking";

import { JobRequestDraft } from "../types/JobRequestDraft";

interface CreateBookingParams {

    booking: JobRequestDraft;

    freelancer: SkillMember;

    clientId: string;

}

export function mapBookingToFirestore({

    booking,

    freelancer,

    clientId,

}: CreateBookingParams) {

    const now = Timestamp.now();

    return {

        clientId,

        freelancerId: freelancer.userId,

        freelancerName:
            `${freelancer.firstName} ${freelancer.lastName}`,

        skillId: freelancer.skillId,

        date: booking.schedule.date,

        time: booking.schedule.time,

        schedule: now,

        isAsap:
            booking.schedule.time === "ASAP",

        details:
            booking.description,

        clientLat:
            booking.location.latitude,

        clientLng:
            booking.location.longitude,

        address:
            booking.location.address ?? null,

        freelancerLat:
            freelancer.latitude,

        freelancerLng:
            freelancer.longitude,

        freelancerLocation: new GeoPoint(

            freelancer.latitude,

            freelancer.longitude,

        ),

        status: "pending",

        paymentStatus: "payment_pending",

        reviewed: false,

        enriched: false,

        completedAt: null,

        acceptedAt: null,

        eta: null,

        distance: null,

        expiresAt: null,

        createdAt: now,

        updatedAt: now,

    };

}

export function mapBookingFromFirestore(

    snapshot:
        | DocumentSnapshot<DocumentData>
        | QueryDocumentSnapshot<DocumentData>,

): Booking {

    const data = snapshot.data();

    if (!data) {

        throw new Error(
            "Booking document does not exist.",
        );

    }

    return {

        id: snapshot.id,

        clientId: data.clientId,

        freelancerId: data.freelancerId,

        freelancerName: data.freelancerName,

        skillId: data.skillId,

        date: data.date,

        time: data.time,

        schedule: data.schedule,

        address: data.address ?? null,

        details: data.details,

        status: data.status,

        paymentStatus: data.paymentStatus,

        eta: data.eta ?? null,

        distance: data.distance ?? null,

        clientLat: data.clientLat,

        clientLng: data.clientLng,

        freelancerLat: data.freelancerLat,

        freelancerLng: data.freelancerLng,

        freelancerLocation:
            data.freelancerLocation ?? null,

        isAsap: data.isAsap,

        reviewed: data.reviewed,

        enriched: data.enriched,

        expiresAt:
            data.expiresAt ?? null,

        createdAt: data.createdAt,

        updatedAt: data.updatedAt,

        acceptedAt:
            data.acceptedAt ?? null,

        completedAt:
            data.completedAt ?? null,

        verificationStatus:
            data.verificationStatus ?? "pending",

        verificationConfidence:
            data.verificationConfidence ?? null,

        verifiedAt:
            data.verifiedAt ?? null,

    };

}