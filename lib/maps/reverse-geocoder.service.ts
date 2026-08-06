// import { MapLocation } from "@/components/maps/types";

// export async function reverseGeocode(
//     latitude: number,
//     longitude: number,
// ): Promise<MapLocation> {

//     const geocoder = new google.maps.Geocoder();

//     const response = await geocoder.geocode({

//         location: {

//             lat: latitude,

//             lng: longitude,

//         },

//     });

//     if (!response.results.length) {

//         return {

//             latitude,

//             longitude,

//         };

//     }

//     return {

//         latitude,

//         longitude,

//         address: response.results[0].formatted_address,

//         placeId: response.results[0].place_id,

//     };

// }