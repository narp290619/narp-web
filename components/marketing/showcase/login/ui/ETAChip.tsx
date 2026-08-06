"use client";

import { Clock3 } from "lucide-react";

export default function ETAChip() {

    return (

        <div

            className="
                absolute
                left-1/2
                top-5
                -translate-x-1/2
                rounded-full
                bg-white
                px-4
                py-2
                shadow-lg
            "

        >

            <div className="flex items-center gap-2">

                <Clock3
                    size={15}
                    className="text-orange-500"
                />

                <span className="text-xs font-semibold">

                    ETA 2 min

                </span>

            </div>

        </div>

    );

}