"use client";

import { useCallback } from "react";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapLocation } from "@/components/maps/types";


export function useReverseGeocoder() {

    const geocodingLibrary =
        useMapsLibrary("geocoding");

    const reverseGeocode = useCallback(

        async (

            latitude: number,

            longitude: number,

        ): Promise<MapLocation> => {

            if (!geocodingLibrary) {

                return {

                    latitude,

                    longitude,

                };

            }

            const geocoder =
                new geocodingLibrary.Geocoder();

            const response =
                await geocoder.geocode({

                    location: {

                        lat: latitude,

                        lng: longitude,

                    },

                });

            if (

                response.results.length === 0

            ) {

                return {

                    latitude,

                    longitude,

                };

            }

            return {

                latitude,

                longitude,

                address:
                    response.results[0].formatted_address,

                placeId:
                    response.results[0].place_id,

            };

        },

        [geocodingLibrary],

    );

    return {

        reverseGeocode,

        isLoaded:
            geocodingLibrary !== undefined,

    };

}