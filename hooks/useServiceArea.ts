"use client";

import { useEffect, useMemo, useState } from "react";

import { MapLocation } from "@/components/maps/types";

import {
    ServiceArea,
    ServiceAreaResult,
    validateServiceArea,
} from "@/components/maps/services/service-area.service";

interface UseServiceAreaResult extends ServiceAreaResult {

    loading: boolean;

}

export function useServiceArea(

    location: MapLocation | null | undefined,

    area: ServiceArea | null | undefined,

): UseServiceAreaResult {

    const [

        result,

        setResult,

    ] = useState<ServiceAreaResult>({

        withinArea: false,

        distanceKm: 0,

    });

    const [

        loading,

        setLoading,

    ] = useState(false);

    useEffect(() => {

        if (!location || !area) {

            setResult({

                withinArea: false,

                distanceKm: 0,

            });

            return;

        }

        setLoading(true);

        const validation =
            validateServiceArea(
                location,
                area,
            );

        setResult(validation);

        setLoading(false);

    }, [

        location,

        area,

    ]);

    return useMemo(

        () => ({

            loading,

            withinArea: result.withinArea,

            distanceKm: result.distanceKm,

        }),

        [

            loading,

            result,

        ],

    );

}