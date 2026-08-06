"use client";

import { useCallback } from "react";

import {
    Map,
    MapMouseEvent,
} from "@vis.gl/react-google-maps";

import MapMarker from "./MapMarker";

import type { MapLocation } from "../types";

interface Props {

    value: MapLocation;

    onChange(
        location: MapLocation,
    ): void;

    zoom?: number;

    height?: number;

    disableDefaultUI?: boolean;

}

export default function GoogleMap({

    value,

    onChange,

    zoom = 16,

    height = 450,

    disableDefaultUI = false,

}: Props) {

    const handleMapClick = useCallback(

        (event: MapMouseEvent) => {

            if (!event.detail.latLng) {

                return;

            }

            onChange({

                latitude: event.detail.latLng.lat,

                longitude: event.detail.latLng.lng,

                address: value.address,

                placeId: value.placeId,

            });

        },

        [

            onChange,
            value.address,
            value.placeId,

        ],

    );

    return (

        <div

            className="overflow-hidden rounded-3xl border"

            style={{

                height,

            }}

        >

            <Map

                mapId="NARP_MAP"

                center={{

                    lat: value.latitude,

                    lng: value.longitude,

                }}

                zoom={zoom}

                gestureHandling="greedy"

                disableDefaultUI={disableDefaultUI}

                onClick={handleMapClick}

                style={{

                    width: "100%",

                    height: "100%",

                }}

            >

                <MapMarker

                    position={value}

                />

            </Map>

        </div>

    );

}