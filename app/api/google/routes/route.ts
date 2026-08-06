import { NextRequest, NextResponse } from "next/server";

const GOOGLE_ROUTES_URL =
    "https://routes.googleapis.com/directions/v2:computeRoutes";

export async function POST(
    request: NextRequest,
) {

    console.log(">>> /api/google/routes called");

    try {

        const {

            origin,

            destination,

        } = await request.json();

        const response = await fetch(

            GOOGLE_ROUTES_URL,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "X-Goog-Api-Key":
                        process.env.GOOGLE_ROUTES_API_KEY!,

                    "X-Goog-FieldMask":
                        "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",

                },

                body: JSON.stringify({

                    origin: {

                        location: {

                            latLng: {

                                latitude:
                                    origin.lat,

                                longitude:
                                    origin.lng,

                            },

                        },

                    },

                    destination: {

                        location: {

                            latLng: {

                                latitude:
                                    destination.lat,

                                longitude:
                                    destination.lng,

                            },

                        },

                    },

                    travelMode: "DRIVE",

                }),

            },

        );

        if (!response.ok) {

            const errorText = await response.text();

            console.error("Google Routes API Error:");
            console.error(errorText);

            return NextResponse.json(
                {
                    success: false,
                    error: errorText,
                },
                {
                    status: response.status,
                },
            );

        }

        const data =
            await response.json();

        return NextResponse.json(data);

    } catch (error) {

        return NextResponse.json(

            {

                success: false,

                error:
                    String(error),

            },

            {

                status: 500,

            },

        );

    }

}