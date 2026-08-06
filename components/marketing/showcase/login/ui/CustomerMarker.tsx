"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function CustomerMarker() {

    return (

        <motion.div

            animate={{
                scale: [1, 1.15, 1],
            }}

            transition={{
                duration: 1.6,
                repeat: Infinity,
            }}

            className="absolute right-12 bottom-14"

        >

            <div className="rounded-full bg-emerald-500 p-2 shadow-xl">

                <Home
                    size={18}
                    className="text-white"
                />

            </div>

        </motion.div>

    );

}