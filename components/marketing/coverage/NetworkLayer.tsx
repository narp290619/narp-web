"use client";

import { motion } from "framer-motion";

import NetworkLines from "./effects/NetworkLines";
import CoveragePin from "./CoveragePin";
import { coveragePins } from "./coveragePins";

export default function NetworkLayer() {
    return (
        <motion.div
            className="absolute inset-0"
            animate={{
                y: [0, -3, 0],
                x: [0, 1.5, 0],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <NetworkLines />

            {coveragePins.map((pin) => (
                <CoveragePin
                    key={pin.city}
                    pin={pin}
                />
            ))}
        </motion.div>
    );
}