"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Props {
    text: string;
}

export default function ChecklistItem({
    text,
}: Props) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                x: -24,
                scale: 0.96,
            }}
            animate={{
                opacity: 1,
                x: 0,
                scale: 1,
            }}
            transition={{
                duration: 0.35,
            }}
            className="
                flex
                items-center
                justify-between

                rounded-2xl

                border
                border-slate-200

                bg-white

                px-4
                py-3

                shadow-sm
            "
        >
            <div className="flex items-center gap-3">

                <motion.div
                    initial={{
                        scale: 0,
                        rotate: -90,
                    }}
                    animate={{
                        scale: 1,
                        rotate: 0,
                    }}
                    transition={{
                        delay: 0.15,
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                    }}
                >
                    <CheckCircle2
                        className="
                            h-6
                            w-6
                            text-emerald-500
                        "
                    />
                </motion.div>

                <span
                    className="
                        text-sm
                        font-medium
                        text-slate-800
                    "
                >
                    {text}
                </span>

            </div>

            <span
                className="
                    rounded-full

                    bg-emerald-50

                    px-3
                    py-1

                    text-xs
                    font-semibold

                    text-emerald-600
                "
            >
                Complete
            </span>

        </motion.div>
    );
}