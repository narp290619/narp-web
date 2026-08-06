// export interface MapLocation {

//     latitude: number;

//     longitude: number;

//     address: string;

// }

export interface MapLocation {

    latitude: number;

    longitude: number;

    address?: string;

    placeId?: string;

    name?: string;

    city?: string;

    province?: string;

    country?: string;

    postalCode?: string;

}