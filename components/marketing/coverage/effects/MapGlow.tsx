"use client";

import { motion } from "framer-motion";

export default function MapGlow() {
    return (
        <motion.div
            animate={{
                scale: [1, 1.08, 1],
                opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            // className="
            //     absolute
            //     -left-24
            //     -right-24
            //     -top-24
            //     -bottom-24

            //     blur-[90px]
            //     rounded-full
            //     bg-[radial-gradient(circle_at_center,rgba(249,115,22,.25),transparent_70%)]
            //     blur-3xl
            // "
            className="
        absolute
        inset-0
        bg-red-500
        opacity-40
    "
            style={{
                background:
                    "radial-gradient(circle, rgba(249,115,22,.30) 0%, rgba(249,115,22,.12) 35%, transparent 75%)",
            }}
        />
    );
}