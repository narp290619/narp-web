"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import CoverageTooltip from "./CoverageTooltip";
import type { CoveragePin as CoveragePinType } from "./coveragePins";

interface Props {
    pin: CoveragePinType;
}

export default function CoveragePin({ pin }: Props) {

    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            className="absolute"
            style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                transform: "translate(-50%, -50%)",
            }}
            // animate={{
            //     scale: [1, 1.12, 1],
            // }}
            // transition={{
            //     duration: 2,
            //     repeat: Infinity,
            //     ease: "easeInOut",
            // }}

            initial={{
                opacity: 0,
                y: 20,
            }}

            animate={{
                opacity: 1,
                y: [0, -8, 0],
            }}

            transition={{
                opacity: {
                    duration: 0.6,
                },
                y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                },
            }}

            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >

            <div className="relative">

                <div className="absolute h-5 w-5 rounded-full bg-orange-400 opacity-50 animate-ping" />

                <div className="relative h-5 w-5 rounded-full border-2 border-white bg-orange-500 shadow-lg" />

                <p className="mt-2 whitespace-nowrap text-xs font-semibold text-slate-700">
                    {pin.city}
                </p>

                {/* <div
                    className="
            absolute
            left-1/2
            bottom-8
            -translate-x-1/2

            invisible
            opacity-0

            transition-all
            duration-300

            group-hover:visible
            group-hover:opacity-100
        "
                >
                    <CoverageTooltip
                        city={pin.city}
                        professionals={pin.professionals}
                        skills={pin.skills}
                        rating={pin.rating}
                    />
                </div> */}

                <AnimatePresence>

                    {hovered && (

                        <motion.div
                            className="
                absolute
                left-1/2
                bottom-8
                -translate-x-1/2
                z-50
            "
                            initial={{
                                opacity: 0,
                                y: 10,
                                scale: 0.95,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 10,
                                scale: 0.95,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 22,
                            }}
                        >
                            <CoverageTooltip
                                city={pin.city}
                                freelancers={pin.freelancers}
                                skills={pin.skills}
                                rating={pin.rating}
                            />
                        </motion.div>

                    )}

                </AnimatePresence>

            </div>
        </motion.div>
    );
}