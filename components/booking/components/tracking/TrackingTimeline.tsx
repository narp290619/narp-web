"use client";

import { BookingStatus } from "@/lib/models/booking";

import {
    CheckCircle2,
    Car,
    MapPin,
    Hammer,
    Clock3,
    PartyPopper,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

interface Props {
    status: BookingStatus;
}

interface TimelineStep {

    status: BookingStatus;

    title: string;

    icon: LucideIcon;

}

const STEPS: TimelineStep[] = [

    {

        status: "accepted",

        title: "Booking Accepted",

        icon: CheckCircle2,

    },

    {

        status: "travelling",

        title: "Freelancer On The Way",

        icon: Car,

    },

    {

        status: "arrived",

        title: "Freelancer Arrived",

        icon: MapPin,

    },

    {

        status: "in_progress",

        title: "Work In Progress",

        icon: Hammer,

    },

    {

        status: "completion_requested",

        title: "Waiting For Confirmation",

        icon: Clock3,

    },

    {

        status: "completed",

        title: "Completed",

        icon: PartyPopper,

    },

];

const STATUS_ORDER: BookingStatus[] = [

    "accepted",

    "travelling",

    "arrived",

    "in_progress",

    "completion_requested",

    "completed",

];

export default function TrackingTimeline({

    status,

}: Props) {

    const currentIndex =
        STATUS_ORDER.indexOf(status);

    return (

        <div
            className="
                rounded-2xl
                border
                bg-white
                p-6
            "
        >

            <h2 className="text-lg font-semibold">

                Booking Progress

            </h2>

            <div className="mt-6">

                {STEPS.map((step, index) => {

                    const completed =
                        index < currentIndex;

                    const active =
                        index === currentIndex;

                    const isLast =
                        index === STEPS.length - 1;

                    const Icon = step.icon;

                    return (

                        <div
                            key={step.status}
                            className="flex"
                        >

                            {/* Left column */}

                            <div
                                className="
                        mr-4
                        flex
                        flex-col
                        items-center
                    "
                            >

                                <div
                                    className={`
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            text-lg
                            transition-all
                            duration-300

                            ${completed
                                            ? "bg-green-500 text-white"
                                            : active
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-300 scale-100"
                                                : "bg-slate-200 text-slate-500"
                                        }
                        `}
                                >

                                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.5} />

                                </div>

                                {!isLast && (

                                    <div
                                        className={`
                                w-1
                                flex-1
                                min-h-8

                                ${completed
                                                ? "bg-green-500"
                                                : "bg-slate-300"
                                            }
                            `}
                                    />

                                )}

                            </div>

                            {/* Right column */}

                            <div
                                className="pb-8"
                            >

                                <p
                                    className={`
                            text-base
                            font-semibold

                            ${completed
                                            ? "text-green-600"
                                            : active
                                                ? "text-blue-600"
                                                : "text-slate-500"
                                        }
                        `}
                                >

                                    {step.title}

                                </p>

                                <p
                                    className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                                >

                                    {completed
                                        ? "Completed"
                                        : active
                                            ? "Current step"
                                            : "Waiting"}

                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}