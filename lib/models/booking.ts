import {
    GeoPoint,
    Timestamp,
} from "firebase/firestore";

export type BookingStatus =
    | "pending"
    | "accepted"
    | "travelling"
    | "arrived"
    | "in_progress"
    | "completion_requested"
    | "completed"
    | "cancelled"
    | "expired";

export type PaymentStatus =
    | "payment_pending"
    | "processing"
    | "held"
    | "released"
    | "refunded";

export interface Booking {

    id: string;

    clientId: string;

    freelancerId: string;

    freelancerName: string;

    skillId: string;

    date: string;

    time: string;

    schedule: Timestamp;

    address?: string | null;

    details: string;

    status: BookingStatus;

    paymentStatus: PaymentStatus;

    eta?: string | null;

    distance?: string | null;

    clientLat: number;

    clientLng: number;

    freelancerLat: number;

    freelancerLng: number;

    freelancerLocation?: GeoPoint | null;

    isAsap: boolean;

    reviewed: boolean;

    enriched: boolean;

    expiresAt?: Timestamp | null;

    createdAt: Timestamp;

    updatedAt: Timestamp;

    acceptedAt?: Timestamp | null;

    completedAt?: Timestamp | null;

    selfieUrl?: string | null;

    verificationStatus?: "pending" | "verified" | "failed";

    verificationConfidence?: number | null;

    verifiedAt?: Timestamp | null;

}