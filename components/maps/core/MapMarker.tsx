"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { MapLocation } from "../types";

interface Props {
    position: MapLocation;
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