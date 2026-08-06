"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface Props {

    position: {

        latitude: number;

        longitude: number;

    };

}

export default function MapMarker({
    position,
}: Props) {

    return (

        <AdvancedMarker

            position={{

                lat: position.latitude,

                lng: position.longitude,

            }}

        />

    );

}