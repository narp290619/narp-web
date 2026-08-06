"use client";

import { motion } from "framer-motion";

import { coveragePins } from "../coveragePins";
import { coverageConnections } from "../coverageConnections";

export default function NetworkLines() {

    function getPin(city: string) {
        return coveragePins.find((pin) => pin.city === city);
    }

    return (
        <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            {coverageConnections.map(([from, to]) => {

                const start = getPin(from);
                const end = getPin(to);

                if (!start || !end) return null;

                return (
                    <g key={`${from}-${to}`}>

                        {/* Base line */}

                        <line
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                            stroke="#fdba74"
                            strokeWidth="0.35"
                            opacity="0.35"
                        />

                        {/* Animated line */}

                        <motion.line
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                            stroke="#f97316"
                            strokeWidth="0.1"
                            strokeLinecap="round"
                            strokeDasharray="3 3"
                            initial={{
                                pathLength: 0,
                            }}
                            animate={{
                                pathLength: 1,
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />

                    </g>
                );

            })}
        </svg>
    );
}