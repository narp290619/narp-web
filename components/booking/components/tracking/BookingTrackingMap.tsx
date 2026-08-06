"use client";

import {
    APIProvider,
    Map,
    AdvancedMarker,
    Polyline,
    useMap,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";
import AnimatedFreelancerMarker from "../AnimatedFreelancerMarker";

interface LatLng {

    lat: number;

    lng: number;

}

interface Props {

    client: LatLng;

    freelancer: LatLng;

    completedPath: LatLng[];

    remainingPath: LatLng[];

}

export default function BookingTrackingMap({

    client,

    freelancer,

    completedPath,

    remainingPath,

}: Props) {

    const [

        animatedFreelancer,

        setAnimatedFreelancer,

    ] = useState(freelancer);

    useEffect(() => {

        const start = animatedFreelancer;

        const end = freelancer;

        const frames = 30;

        let frame = 0;

        const interval = setInterval(() => {

            frame++;

            const t = frame / frames;

            setAnimatedFreelancer({

                lat:

                    start.lat +

                    (end.lat - start.lat) * t,

                lng:

                    start.lng +

                    (end.lng - start.lng) * t,

            });

            if (frame >= frames) {

                clearInterval(interval);

            }

        }, 33);

        return () => clearInterval(interval);

    }, [freelancer]);

    const [followFreelancer, setFollowFreelancer] =
        useState(false);

    return (

        <div className="h-[450px] w-full rounded-2xl overflow-hidden">

            <APIProvider
                apiKey={
                    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
                }
            >

                <Map

                    defaultCenter={client}
                    defaultZoom={15}

                    mapId={
                        process.env.NEXT_PUBLIC_GOOGLE_MAP_ID
                    }

                    gestureHandling="greedy"

                    disableDefaultUI={false}

                    onDrag={() => setFollowFreelancer(false)}

                >

                    <Polyline

                        path={completedPath}

                        strokeColor="#94A3B8"

                        strokeWeight={4}

                    />

                    <Polyline

                        path={remainingPath}

                        strokeColor="#2563EB"

                        strokeWeight={6}

                    />

                    <button
                        onClick={() => setFollowFreelancer(true)}
                        className="
                            absolute
                            bottom-6
                            right-6
                            rounded-full
                            bg-white
                            shadow-lg
                            px-4
                            py-3
                        "
                    >
                        🧭 Recenter
                    </button>

                    <CameraFollow

                        follow={followFreelancer}

                        position={freelancer}

                    />

                    {/* <FitBounds

                        client={client}

                        freelancer={freelancer}

                    /> */}

                    <AdvancedMarker
                        position={client}
                    >

                        <div className="text-3xl">

                            📍

                        </div>

                    </AdvancedMarker>

                    <AnimatedFreelancerMarker
                        position={freelancer}
                    />

                </Map>

            </APIProvider>

        </div>

    );

}

function FitBounds({

    client,

    freelancer,

}: Props) {

    const map = useMap();

    React.useEffect(() => {

        if (!map) return;

        const bounds =
            new google.maps.LatLngBounds();

        bounds.extend(client);

        bounds.extend(freelancer);

        map.fitBounds(bounds, 100);

    }, [

        map,

    ]);

    return null;

}

function CameraFollow({
    position,
    follow,
}: {
    position: LatLng;
    follow: boolean;
}) {

    const map = useMap();

    useEffect(() => {

        if (!map || !follow) return;

        map.panTo(position);

    }, [
        map,
        follow,
        position,
    ]);

    return null;

}