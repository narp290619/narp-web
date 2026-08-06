"use client";

import { motion } from "framer-motion";

interface Props {

    x: number;

    y: number;

}

export default function NetworkNode({

    x,

    y,

}: Props) {

    return (

        <motion.div

            style={{

                left: `${x}%`,

                top: `${y}%`,

            }}

            animate={{

                scale: [1, 1.5, 1],

                opacity: [.7, 1, .7],

            }}

            transition={{

                duration: 3,

                repeat: Infinity,

            }}

            className="absolute"

        >

            <div className="absolute h-5 w-5 rounded-full bg-orange-400 blur-md" />

            <div className="relative h-3 w-3 rounded-full bg-white" />

        </motion.div>

    );

}