"use client";

import { motion } from "framer-motion";

export default function ThinkingIndicator() {

    return (

        <div className="flex items-center gap-2">

            <span className="text-slate-500">

                Thinking

            </span>

            {[0,1,2].map((i)=>(

                <motion.div

                    key={i}

                    animate={{

                        opacity:[0.3,1,0.3],

                        scale:[0.8,1.2,0.8],

                    }}

                    transition={{

                        repeat:Infinity,

                        duration:.9,

                        delay:i*.2,

                    }}

                    className="
                        h-2
                        w-2
                        rounded-full
                        bg-orange-500
                    "

                />

            ))}

        </div>

    );

}