"use client";

import type { ReactNode } from "react";

import GoogleMapsProvider from "./GoogleMapsProvider";

interface Props {
    children: ReactNode;
}

export default function AppProviders({
    children,
}: Props) {
    return (
        <GoogleMapsProvider>
            {children}
        </GoogleMapsProvider>
    );
}