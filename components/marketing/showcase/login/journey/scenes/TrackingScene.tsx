"use client";

import { MapPinned } from "lucide-react";
import MiniMap from "../../ui/MiniMap";


export default function TrackingScene() {

    return (

        <div className="flex h-full flex-col bg-white">

            <div className="flex items-center gap-3 p-6">

                <div className="rounded-xl bg-orange-100 p-3">

                    <MapPinned className="text-orange-500"/>

                </div>

                <div>

                    <h2 className="font-bold text-xl">

                        Live Tracking

                    </h2>

                    <p className="text-sm text-slate-500">

                        Builder is on the way

                    </p>

                </div>

            </div>

            <div className="flex-1 px-6 pb-6">

                <MiniMap/>

            </div>

        </div>

    );

}