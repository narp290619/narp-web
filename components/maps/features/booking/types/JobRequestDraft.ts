import { MapLocation } from "@/components/maps/types";

export interface JobRequestDraft {

    schedule: {

        date: string;

        time: string;

    };

    location: MapLocation;

    description: string;

}