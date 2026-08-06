"use client";

import { motion } from "framer-motion";

export default function ScanFrame() {

    return (

        <div className="relative">

            <div
                className="
                h-60
                rounded-3xl
                border-4
                border-orange-400
                overflow-hidden
                bg-slate-900
            "
            >

                <motion.div

                    animate={{
                        y:[0,210,0]
                    }}

                    transition={{
                        repeat:Infinity,
                        duration:2
                    }}

                    className="
                        absolute
                        left-0
                        right-0
                        h-1
                        bg-orange-400
                        shadow-lg
                        shadow-orange-400
                    "
                />

                <div
                    className="
                        flex
                        h-full
                        items-center
                        justify-center
                        text-8xl
                    "
                >

                    😊

                </div>

            </div>

        </div>

    );

}