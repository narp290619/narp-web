"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

import {
    GOOGLE_MAPS_API_KEY,
} from "@/lib/google-maps";

interface Props {

    children: React.ReactNode;

}

export default function GoogleMapsProvider({

    children,

}: Props) {

    return (

        <APIProvider

            apiKey={GOOGLE_MAPS_API_KEY}

            libraries={[

                "places",
                "geometry",
                "marker",

            ]}

        >

            {children}

        </APIProvider>

    );

}