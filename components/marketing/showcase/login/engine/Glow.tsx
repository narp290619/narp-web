"use client";

import { motion } from "framer-motion";

export default function Glow() {

    return (

        <motion.div

            animate={{

                scale: [1, 1.15, 1],

                opacity: [0.35, 0.6, 0.35],

            }}

            transition={{

                duration: 4,

                repeat: Infinity,

            }}

            className="absolute inset-0"

        >

            <div

                className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[520px]
                    w-[320px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-orange-400/30
                    blur-[120px]
                "

            />

        </motion.div>

    );

}