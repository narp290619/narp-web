"use client";

import { motion } from "framer-motion";

export default function BlinkingCursor() {
    return (
        <motion.span
            animate={{
                opacity: [1, 0, 1],
            }}
            transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className="ml-0.5 inline-block font-normal"
        >
            ▋
        </motion.span>
    );
}