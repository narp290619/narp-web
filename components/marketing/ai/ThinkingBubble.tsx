"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

interface Props {
    progress: number;
}

export default function ThinkingBubble({
    progress,
}: Props) {

    const percent = Math.min(100, Math.max(10, progress * 20));

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 12,
                scale: 0.96,
            }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
            }}
            transition={{
                duration: 0.35,
            }}
            className="flex justify-start"
        >
            <div
                className="
                    max-w-[270px]
                    rounded-3xl
                    rounded-bl-lg
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-4
                    shadow-md
                "
            >
                {/* Header */}

                <div className="mb-4 flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-orange-100
                        "
                    >
                        <BrainCircuit
                            size={20}
                            className="text-orange-500"
                        />
                    </div>

                    <div>

                        <p className="font-semibold text-slate-900">
                            NARP AI
                        </p>

                        <p className="text-xs text-emerald-600">
                            Analyzing your request...
                        </p>

                    </div>

                </div>

                {/* Typing dots */}

                <div className="mb-4 flex gap-2">

                    {[0, 0.2, 0.4].map((delay) => (
                        <motion.span
                            key={delay}
                            animate={{
                                y: [0, -4, 0],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 0.9,
                                repeat: Infinity,
                                delay,
                            }}
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-orange-500
                            "
                        />
                    ))}

                </div>

                {/* Progress */}

                <div>

                    <div className="mb-2 flex justify-between text-xs text-slate-500">

                        <span>AI Processing</span>

                        <span>{percent}%</span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                        <motion.div
                            animate={{
                                width: `${percent}%`,
                            }}
                            transition={{
                                duration: 0.5,
                            }}
                            className="
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                from-orange-400
                                via-orange-500
                                to-orange-600
                            "
                        />

                    </div>

                </div>

            </div>

        </motion.div>
    );
}