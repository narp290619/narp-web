"use client";

import { CheckCircle2, MapPin, XCircle } from "lucide-react";

interface Props {
    withinArea: boolean;
    distanceKm: number;
    radiusKm: number;
}

export default function ServiceAreaBadge({
    withinArea,
    distanceKm,
    radiusKm,
}: Props) {
    if (withinArea) {
        return (
            <div
                className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-green-200
                    bg-green-50
                    p-4
                "
            >
                <CheckCircle2
                    className="mt-0.5 text-green-600"
                    size={22}
                />

                <div>

                    <h3 className="font-semibold text-green-800">
                        Within Service Area
                    </h3>

                    <p className="mt-1 text-sm text-green-700">
                        This location is{" "}
                        <strong>
                            {distanceKm.toFixed(1)} km
                        </strong>{" "}
                        away.

                    </p>

                    <p className="mt-1 text-xs text-green-600">
                        Maximum coverage: {radiusKm} km
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div
            className="
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-4
            "
        >
            <XCircle
                className="mt-0.5 text-red-600"
                size={22}
            />

            <div>

                <h3 className="font-semibold text-red-800">
                    Outside Service Area
                </h3>

                <p className="mt-1 text-sm text-red-700">
                    This location is{" "}
                    <strong>
                        {distanceKm.toFixed(1)} km
                    </strong>{" "}
                    away.

                </p>

                <p className="mt-1 text-xs text-red-600">
                    Maximum coverage: {radiusKm} km
                </p>

                <div
                    className="
                        mt-3
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-red-700
                    "
                >
                    <MapPin size={14} />

                    Please choose a location within the freelancer's
                    service area.

                </div>

            </div>

        </div>
    );
}