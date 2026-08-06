// "use client";

// import { useCallback, useEffect, useState } from "react";

// import { useBooking } from "@/hooks/useBookings";
// import { useBookingTracking } from "@/hooks/useBookingTracking";

// import {
//     getRoute,
//     RouteResult,
// } from "@/lib/services/google-routes.service";

// import BookingTrackingMap from "@/components/booking/components/tracking/BookingTrackingMap";
// import TrackingInfoCard from "@/components/booking/components/tracking/TrackingInfoCard";
// import { decodePolyline } from "@/lib/utils/polyline";

// interface Props {
//     bookingId: string;
// }

// export default function TrackingClient({
//     bookingId,
// }: Props) {

//     const {
//         booking,
//         loading,
//     } = useBooking(bookingId);

//     const tracking =
//         useBookingTracking(bookingId);

//     const [
//         route,
//         setRoute,
//     ] = useState<RouteResult | null>(null);

//     const [
//         routePath,
//         setRoutePath,
//     ] = useState<
//         {
//             lat: number;
//             lng: number;
//         }[]
//     >([]);

//     const loadRoute = useCallback(async () => {

//         if (!booking || !tracking) return;

//         console.log("Loading Google Route...");

//         try {

//             const result = await getRoute({

//                 origin: {

//                     lat: tracking.freelancerLat,
//                     lng: tracking.freelancerLng,

//                 },

//                 destination: {

//                     lat: booking.clientLat,
//                     lng: booking.clientLng,

//                 },

//             });

//             console.log("Google Route Result:");
//             console.log(result);

//             setRoute(result);

//             if (result) {

//                 const path =
//                     decodePolyline(result.polyline);

//                 setRoutePath(path);

//             }

//         } catch (error) {

//             console.error(error);

//         }

//     }, [

//         booking?.clientLat,
//         booking?.clientLng,

//         tracking?.freelancerLat,
//         tracking?.freelancerLng,

//     ]);

//     useEffect(() => {

//         loadRoute();

//     }, [

//         loadRoute,

//     ]);

//     useEffect(() => {

//         if (booking?.status !== "travelling") {

//             return;

//         }

//         const interval = setInterval(() => {

//             console.log("Refreshing route...");

//             loadRoute();

//         }, 30000);

//         return () => clearInterval(interval);

//     }, [

//         booking?.status,

//         loadRoute,

//     ]);

//     const eta = route
//         ? `${Math.ceil(route.durationSeconds / 60)} min`
//         : tracking?.eta ?? "--";

//     const distance = route
//         ? route.distanceMeters >= 1000
//             ? `${(route.distanceMeters / 1000).toFixed(1)} km`
//             : `${route.distanceMeters} m`
//         : tracking?.distance ?? "--";

//     if (loading || !booking) {

//         return (

//             <div className="p-10">

//                 Loading tracking...

//             </div>

//         );

//     }

//     if (!tracking) {

//         return (

//             <div className="p-10">

//                 Waiting for freelancer location...

//             </div>

//         );

//     }

//     return (

//         <div className="space-y-6 p-8">

//             <h1 className="text-3xl font-bold">

//                 Live Tracking

//             </h1>

//             <TrackingInfoCard

//                 status={booking.status}

//                 eta={eta}

//                 distance={distance}

//                 lastUpdated={tracking.lastUpdated}

//             />

//             <BookingTrackingMap

//                 client={{
//                     lat: booking.clientLat,
//                     lng: booking.clientLng,
//                 }}

//                 freelancer={{
//                     lat: tracking.freelancerLat,
//                     lng: tracking.freelancerLng,
//                 }}

//                 routePath={routePath}

//             />

//         </div>

//     );

// }


"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useBooking } from "@/hooks/useBookings";
import { useBookingTracking } from "@/hooks/useBookingTracking";

import {
    getRoute,
    RouteResult,
} from "@/lib/services/google-routes.service";

import { decodePolyline } from "@/lib/utils/polyline";

import BookingTrackingMap from "@/components/booking/components/tracking/BookingTrackingMap";
import TrackingInfoCard from "@/components/booking/components/tracking/TrackingInfoCard";
import TrackingTimeline from "@/components/booking/components/tracking/TrackingTimeline";
import { splitRoute } from "@/lib/utils/split-route";
import TrackingActions from "@/components/booking/components/tracking/TrackingActions";

interface Props {
    bookingId: string;
}

export default function TrackingClient({
    bookingId,
}: Props) {

    const {
        booking,
        loading,
    } = useBooking(bookingId);

    const tracking =
        useBookingTracking(bookingId);

    // const animatedFreelancer =
    //     useAnimatedLocation({

    //         lat: tracking?.freelancerLat ?? 0,

    //         lng: tracking?.freelancerLng ?? 0,

    //     });

    const [
        route,
        setRoute,
    ] = useState<RouteResult | null>(null);

    const loadRoute = useCallback(async () => {

        if (!booking || !tracking) {

            return;

        }

        console.log("Loading Google Route...");

        try {

            const result = await getRoute({

                origin: {

                    lat: tracking.freelancerLat,
                    lng: tracking.freelancerLng,

                },

                destination: {

                    lat: booking.clientLat,
                    lng: booking.clientLng,

                },

            });

            console.log("Google Route Result:");

            console.log(result);

            setRoute(result);

        } catch (error) {

            console.error(
                "Failed to load route:",
                error,
            );

        }

    }, [

        booking?.clientLat,
        booking?.clientLng,

        tracking?.freelancerLat,
        tracking?.freelancerLng,

    ]);

    useEffect(() => {

        loadRoute();

    }, [

        loadRoute,

    ]);

    useEffect(() => {

        if (booking?.status !== "travelling") {

            return;

        }

        const interval = setInterval(() => {

            console.log(
                "Refreshing Google Route...",
            );

            loadRoute();

        }, 30000);

        return () => clearInterval(interval);

    }, [

        booking?.status,

        loadRoute,

    ]);

    const routePath = useMemo(() => {

        if (!route) {

            return [];

        }

        return decodePolyline(
            route.polyline,
        );

    }, [

        route,

    ]);

    const eta = useMemo(() => {

        if (!route) {

            return tracking?.eta ?? "--";

        }

        return `${Math.ceil(
            route.durationSeconds / 60,
        )} min`;

    }, [

        route,

        tracking?.eta,

    ]);

    const distance = useMemo(() => {

        if (!route) {

            return tracking?.distance ?? "--";

        }

        if (route.distanceMeters >= 1000) {

            return `${(
                route.distanceMeters / 1000
            ).toFixed(1)} km`;

        }

        return `${route.distanceMeters} m`;

    }, [

        route,

        tracking?.distance,

    ]);

    const {

        completed,

        remaining,

    } = useMemo(() => {

        if (!tracking) {

            return {

                completed: [],

                remaining: [],

            };

        }

        return splitRoute(

            routePath,

            {

                lat: tracking.freelancerLat,

                lng: tracking.freelancerLng,

            },

        );

    }, [

        routePath,

        tracking,

    ]);

    useEffect(() => {

        console.log("Completed points:", completed.length);
        console.log("Remaining points:", remaining.length);

    }, [completed, remaining]);

    if (loading || !booking) {

        return (

            <div className="p-10">

                Loading tracking...

            </div>

        );

    }

    if (!tracking) {

        return (

            <div className="p-10">

                Waiting for freelancer location...

            </div>

        );

    }

    return (

        <div className="pt-30 space-y-6 p-8">

            <h1 className="text-3xl font-bold">

                Live Tracking

            </h1>

            <TrackingTimeline

                status={booking.status}

            />

            <TrackingInfoCard

                status={booking.status}

                eta={eta}

                distance={distance}

                lastUpdated={tracking.lastUpdated}

            />

            <TrackingActions
                freelancerId={booking.freelancerId}
            />

            <BookingTrackingMap

                client={{

                    lat: booking.clientLat,

                    lng: booking.clientLng,

                }}

                freelancer={{

                    lat: tracking.freelancerLat,

                    lng: tracking.freelancerLng,

                }}

                // freelancer={animatedFreelancer}

                completedPath={completed}

                remainingPath={remaining}

            />

        </div>

    );

}