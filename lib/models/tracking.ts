import { Timestamp } from "firebase/firestore";

export interface BookingTracking {

    freelancerLat: number;

    freelancerLng: number;

    heading?: number;

    speed?: number;

    eta?: string | null;

    distance?: string | null;

    lastUpdated?: Timestamp | null;

}