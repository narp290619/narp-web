"use client";

import { motion } from "framer-motion";

export default function ThinkingDots() {
    return (
        <div className="flex gap-2">

            {[0,1,2].map((i)=>(

                <motion.div

                    key={i}

                    animate={{
                        y:[0,-6,0],
                        opacity:[0.4,1,0.4]
                    }}

                    transition={{
                        repeat:Infinity,
                        delay:i*.18,
                        duration:.9
                    }}

                    className="h-2 w-2 rounded-full bg-orange-500"

                />

            ))}

        </div>
    );
}