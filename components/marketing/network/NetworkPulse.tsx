"use client";

import { motion } from "framer-motion";

interface Props {

    path: string;

    delay?: number;

    color?: string;

}

export default function NetworkPulse({

    path,

    delay = 0,

    color = "#fb923c",

}: Props) {

    return (

        <motion.circle

            r="4"

            fill={color}

            filter="url(#pulseGlow)"

            animate={{

                offsetDistance: ["0%", "100%"],

            }}

            transition={{

                duration: 4,

                repeat: Infinity,

                ease: "linear",

                delay,

            }}

            style={{

                offsetPath: `path('${path}')`,

            }}

        />

    );

}