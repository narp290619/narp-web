export interface LatLng {
    lat: number;
    lng: number;
}

function distance(
    a: LatLng,
    b: LatLng,
) {

    const dx = a.lat - b.lat;
    const dy = a.lng - b.lng;

    return dx * dx + dy * dy;

}

export function splitRoute(

    route: LatLng[],

    current: LatLng,

) {

    if (route.length === 0) {

        return {

            completed: [],
            remaining: [],

        };

    }

    let closestIndex = 0;

    let closestDistance = Infinity;

    route.forEach((point, index) => {

        const d =
            distance(
                point,
                current,
            );

        if (d < closestDistance) {

            closestDistance = d;
            closestIndex = index;

        }

    });

    return {

        completed:
            route.slice(
                0,
                closestIndex + 1,
            ),

        remaining:
            route.slice(
                closestIndex,
            ),

    };

}