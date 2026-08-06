"use client";

import Image from "next/image";
import { coveragePins } from "./coveragePins";
import CoveragePin from "./CoveragePin";
import CoverageHighlight from "./CoverageHighlight";
import { coverageHighlights } from "./coverageHighlights";
import MapGlow from "./effects/MapGlow";
import NetworkLines from "./effects/NetworkLines";
import { motion } from "framer-motion";

export default function CoverageMap() {
    return (
        <div className="relative mx-auto aspect-square max-w-3xl">

            <MapGlow />

            <Image
                src="/images/map/philippines.png"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="Philippines"
                fill
                className="object-contain"
            />

            <motion.div
                className="absolute inset-0"
                animate={{
                    y: [0, -3, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >

                <NetworkLines />

                {coveragePins.map((pin) => (
                    // <div
                    //   key={pin.city}
                    //   className="absolute"
                    //   style={{
                    //     top: pin.top,
                    //     left: pin.left,
                    //   }}
                    // >
                    //   <div className="relative">

                    //     <div className="absolute h-5 w-5 animate-ping rounded-full bg-orange-400 opacity-50" />

                    //     <div className="relative h-5 w-5 rounded-full border-2 border-white bg-orange-500 shadow-lg" />

                    //     <p className="mt-2 whitespace-nowrap text-sm font-semibold text-slate-700">
                    //       {pin.city}
                    //     </p>

                    //   </div>
                    // </div>
                    <CoveragePin
                        key={pin.city}
                        pin={pin}
                    />
                ))}

            </motion.div>

            {coverageHighlights.map((highlight) => (
                <CoverageHighlight
                    key={highlight.city}
                    {...highlight}
                />
            ))}

        </div>
    );
}