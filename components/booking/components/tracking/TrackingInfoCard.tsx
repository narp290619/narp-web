"use client";

import { BookingStatus } from "@/lib/models/booking";
import { getRelativeTime } from "@/lib/utils/time";
import { getTrackingStatusInfo } from "@/lib/utils/tracking-status";
import { Timestamp } from "firebase/firestore";
import TrackingStatusBadge from "./TrackingStatusBadge";

interface Props {

    status: BookingStatus;

    eta?: string | null;

    distance?: string | null;

    lastUpdated?: Timestamp | null;

}

export default function TrackingInfoCard({

    status,

    eta,

    distance,

    lastUpdated,

}: Props) {

    const statusInfo =
        getTrackingStatusInfo(status);

    return (

        <div
            className="
            rounded-3xl
            border
            bg-white
            p-6
            shadow-sm
        "
        >

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <span className="text-3xl">

                        {statusInfo.icon}

                    </span>

                    <div>

                        <h2 className="text-xl font-bold">

                            {statusInfo.title}

                        </h2>

                        <p className={statusInfo.color}>

                            Live Tracking

                        </p>

                    </div>

                </div>

                <TrackingStatusBadge
                    status={status}
                />

            </div>

            {/* 👇 Replace the old grid with this */}

            <div className="mt-8 grid gap-4 md:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-sm text-slate-500">

                        Estimated Arrival

                    </p>

                    <p className="mt-2 text-2xl font-semibold">

                        {eta ?? "--"}

                    </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-sm text-slate-500">

                        Distance Away

                    </p>

                    <p className="mt-2 text-2xl font-semibold">

                        {distance ?? "--"}

                    </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-sm text-slate-500">

                        Updated

                    </p>

                    <p className="mt-2 text-lg font-medium">

                        {getRelativeTime(lastUpdated)}

                    </p>

                </div>

            </div>

        </div>

    );

}