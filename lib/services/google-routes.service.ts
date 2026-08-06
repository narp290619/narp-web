export interface LatLng {

    lat: number;

    lng: number;

}

export interface RouteResult {

    distanceMeters: number;

    durationSeconds: number;

    polyline: string;

}

export async function getRoute({

    origin,

    destination,

}: {

    origin: LatLng;

    destination: LatLng;

}): Promise<RouteResult | null> {

    console.log(">>> getRoute() called");

    console.log("Calling /api/google/routes...");

    const response = await fetch(

        "/api/google/routes",

        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

            },

            body: JSON.stringify({

                origin,

                destination,

            }),

        },

    );

    if (!response.ok) {

        return null;

    }

    const data =
        await response.json();

    const route =
        data.routes?.[0];

    if (!route) {

        return null;

    }

    return {

        distanceMeters:
            route.distanceMeters,

        durationSeconds:
            Number(
                route.duration.replace(
                    "s",
                    "",
                ),
            ),

        polyline:
            route.polyline
                .encodedPolyline,

    };

}