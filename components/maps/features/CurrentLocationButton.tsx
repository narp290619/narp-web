"use client";

import { useState } from "react";

import { LocateFixed } from "lucide-react";

import { getCurrentLocation } from "@/lib/maps/location.service";

import { MapLocation } from "../types";

interface Props {

    onLocationFound(
        location: MapLocation,
    ): void;

}

export default function CurrentLocationButton({

    onLocationFound,

}: Props) {

    const [

        loading,

        setLoading,

    ] = useState(false);

    async function handleClick() {

        try {

            setLoading(true);

            const position =
                await getCurrentLocation();

            onLocationFound({

                latitude:
                    position.coords.latitude,

                longitude:
                    position.coords.longitude,

            });

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to retrieve your current location."
            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <button

            type="button"

            onClick={handleClick}

            disabled={loading}

            className="
                flex
                items-center
                gap-2

                rounded-xl

                border

                bg-white

                px-4
                py-2

                text-sm
                font-medium

                transition

                hover:bg-slate-50

                disabled:cursor-not-allowed
                disabled:opacity-50
            "

        >

            <LocateFixed size={18} />

            {

                loading

                    ? "Locating..."

                    : "Use Current Location"

            }

        </button>

    );

}