"use client";

import { motion } from "framer-motion";

interface Props {
    progress: number;
}

export default function JourneyProgress({
    progress,
}: Props) {

    return (

        <div className="px-6">

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">

                <motion.div

                    animate={{
                        width: `${progress}%`,
                    }}

                    transition={{
                        duration: .5,
                    }}

                    className="h-full rounded-full bg-orange-500"

                />

            </div>

        </div>

    );

}