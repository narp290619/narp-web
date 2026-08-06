"use client";

import { motion } from "framer-motion";

export default function Reflection() {

    return (

        <motion.div

            animate={{

                x: [-220, 240],

            }}

            transition={{

                duration: 5,

                repeat: Infinity,

                ease: "linear",

            }}

            className="absolute inset-0 overflow-hidden rounded-[52px]"

        >

            <div

                className="
                    absolute
                    h-full
                    w-24
                    -rotate-12
                    bg-white/20
                    blur-xl
                "

            />

        </motion.div>

    );

}