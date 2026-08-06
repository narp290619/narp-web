import { MapLocation } from "../types";

export async function getPlaceDetails(
    placeId: string,
): Promise<MapLocation> {

    return new Promise((resolve, reject) => {

        const container =
            document.createElement("div");

        const service =
            new google.maps.places.PlacesService(
                container,
            );

        service.getDetails(

            {

                placeId,

                fields: [

                    "geometry",

                    "formatted_address",

                    "place_id",

                    "name",

                ],

            },

            (place, status) => {

                if (

                    status !==
                        google.maps.places.PlacesServiceStatus.OK ||

                    !place ||

                    !place.geometry?.location

                ) {

                    reject(

                        new Error(
                            "Unable to retrieve place details.",
                        ),

                    );

                    return;

                }

                resolve({

                    latitude:
                        place.geometry.location.lat(),

                    longitude:
                        place.geometry.location.lng(),

                    address:
                        place.formatted_address ??
                        place.name ??
                        "",

                    placeId:
                        place.place_id,

                });

            },

        );

    });

}