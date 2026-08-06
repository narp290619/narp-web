import { decode } from "@googlemaps/polyline-codec";

export interface LatLng {

    lat: number;

    lng: number;

}

export function decodePolyline(

    encoded: string,

): LatLng[] {

    return decode(encoded).map(

        ([lat, lng]) => ({

            lat,

            lng,

        }),

    );

}