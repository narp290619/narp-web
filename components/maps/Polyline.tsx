"use client";

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface Props {

    path: google.maps.LatLngLiteral[];

}

export default function Polyline({

    path,

}: Props) {

    const map = useMap();

    useEffect(() => {

        if (!map || path.length === 0) {

            return;

        }

        const polyline = new google.maps.Polyline({

            path,

            strokeColor: "#2563eb",

            strokeOpacity: 1,

            strokeWeight: 5,

        });

        polyline.setMap(map);

        return () => {

            polyline.setMap(null);

        };

    }, [

        map,

        path,

    ]);

    return null;

}