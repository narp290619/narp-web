"use client";

import { motion } from "framer-motion";

export default function FloatingPhone({

    children,

}: {

    children: React.ReactNode;

}) {

    return (

        <motion.div

            animate={{

                y: [0, -14, 0],

                rotateZ: [-1.2, 1.2, -1.2],

                rotateX: [3, 0, 3],

                rotateY: [-5, 5, -5],

            }}

            transition={{

                duration: 8,

                repeat: Infinity,

                ease: "easeInOut",

            }}

            style={{

                transformStyle:
                    "preserve-3d",

                perspective: 1600,

            }}

        >

            {children}

        </motion.div>

    );

}