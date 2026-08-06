"use client";

import {
    BatteryFull,
    Wifi,
    Signal,
} from "lucide-react";

export default function PersistentStatusBar() {
    return (
        <div className="flex items-center justify-between px-6 py-4 text-xs font-semibold">

            <span>9:41</span>

            <div className="flex items-center gap-1">

                <Signal size={14} />

                <Wifi size={14} />

                <BatteryFull size={15} />

            </div>

        </div>
    );
}