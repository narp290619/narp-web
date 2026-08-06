"use client";

import { motion } from "framer-motion";

interface Props {
    progress: number;
}

export default function ProgressBar({
    progress,
}: Props) {

    return (

        <div className="mt-4">

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                <motion.div

                    className="h-full rounded-full bg-orange-500"

                    initial={{
                        width: 0,
                    }}

                    animate={{
                        width: `${progress}%`,
                    }}

                    transition={{
                        duration: .5,
                    }}

                />

            </div>

            <p className="mt-2 text-right text-xs text-slate-500">

                {progress}%

            </p>

        </div>

    );

}