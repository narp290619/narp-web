import { SkillMember } from "@/lib/models/skill-member";
import { MapLocation } from "../types";

export interface ServiceArea {

    center: {

        latitude: number;

        longitude: number;

    };

    radiusKm: number;

}

export interface ServiceAreaResult {

    withinArea: boolean;

    distanceKm: number;

}

const EARTH_RADIUS_KM = 6371;

function toRadians(
    degrees: number,
): number {

    return degrees * Math.PI / 180;

}

export function calculateDistanceKm(

    from: MapLocation,

    to: MapLocation,

): number {

    const dLat =
        toRadians(
            to.latitude - from.latitude,
        );

    const dLng =
        toRadians(
            to.longitude - from.longitude,
        );

    const lat1 =
        toRadians(from.latitude);

    const lat2 =
        toRadians(to.latitude);

    const a =

        Math.sin(dLat / 2) ** 2 +

        Math.cos(lat1) *

        Math.cos(lat2) *

        Math.sin(dLng / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a),
        );

    return EARTH_RADIUS_KM * c;

}

export function validateServiceArea(

    location: MapLocation,

    area: ServiceArea,

): ServiceAreaResult {

    const distanceKm =
        calculateDistanceKm(

            location,

            {

                latitude: area.center.latitude,

                longitude: area.center.longitude,

            },

        );

    return {

        withinArea:
            distanceKm <= area.radiusKm,

        distanceKm,

    };

}

export function getServiceArea(
    freelancer: SkillMember,
): ServiceArea {

    return {

        center: {

            latitude: freelancer.latitude,

            longitude: freelancer.longitude,

        },

        radiusKm:
            freelancer.serviceRadiusKm ?? 10,

    };

}