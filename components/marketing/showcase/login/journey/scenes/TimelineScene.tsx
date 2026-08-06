"use client";

import { ClipboardCheck } from "lucide-react";

import TimelineStep from "../ui/TimelineStep";

export default function TimelineScene() {
    return (
        <div className="flex h-full flex-col bg-white">

            <div className="flex items-center gap-3 p-6">

                <div className="rounded-xl bg-orange-100 p-3">

                    <ClipboardCheck
                        className="text-orange-500"
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">
                        Job Progress
                    </h2>

                    <p className="text-sm text-slate-500">
                        Builder is completing your request
                    </p>

                </div>

            </div>

            <div className="flex-1 px-8">

                <TimelineStep
                    title="Booking Requested"
                    time="09:00 AM"
                    completed
                />

                <TimelineStep
                    title="Builder Accepted"
                    time="09:02 AM"
                    completed
                />

                <TimelineStep
                    title="Arrived at Location"
                    time="09:20 AM"
                    completed
                />

                <TimelineStep
                    title="Job In Progress"
                    time="Now"
                    active
                />

                <TimelineStep
                    title="Awaiting Completion"
                    time="Next"
                />

            </div>

            <div className="px-6 pb-8">

                <div className="rounded-3xl bg-orange-50 p-5">

                    <p className="text-sm text-slate-500">
                        Estimated Completion
                    </p>

                    <p className="mt-1 text-2xl font-bold text-orange-500">
                        45 minutes
                    </p>

                </div>

            </div>

        </div>
    );
}