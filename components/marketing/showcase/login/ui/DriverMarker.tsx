"use client";

import { motion } from "framer-motion";
import { Navigation } from "lucide-react";

export default function DriverMarker() {

    return (

        <motion.div

            animate={{
                x: [0, 140],
                y: [0, 85],
                rotate: [35, 55, 48],
            }}

            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
            }}

            className="absolute left-14 top-20"

        >

            <div className="rounded-full bg-orange-500 p-2 shadow-xl">

                <Navigation
                    size={18}
                    className="fill-white text-white"
                />

            </div>

        </motion.div>

    );

}