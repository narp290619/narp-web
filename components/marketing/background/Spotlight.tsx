"use client";

import { motion } from "framer-motion";

export default function Spotlight() {
    return (
        <motion.div
            animate={{
                scale: [1, 1.08, 1],
                opacity: [0.55, 0.8, 0.55],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className="
                pointer-events-none
                absolute
                right-10
                top-1/2
                h-[650px]
                w-[650px]
                -translate-y-1/2
                rounded-full
                bg-white/15
                blur-[140px]
            "
        />
    );
}