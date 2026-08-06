"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Props {
    title: string;
    time: string;
    active?: boolean;
    completed?: boolean;
}

export default function TimelineStep({
    title,
    time,
    active = false,
    completed = false,
}: Props) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                x: -20,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.4,
            }}
            className="flex gap-4"
        >
            <div className="flex flex-col items-center">

                <div
                    className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        transition-all

                        ${
                            completed
                                ? "bg-green-500 text-white"
                                : active
                                ? "bg-orange-500 text-white"
                                : "bg-slate-200 text-slate-400"
                        }
                    `}
                >
                    {completed ? (
                        <Check size={18} />
                    ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-current" />
                    )}
                </div>

                <div className="mt-2 h-12 w-[2px] bg-slate-200" />

            </div>

            <div className="pt-1">

                <h3 className="font-semibold">
                    {title}
                </h3>

                <p className="text-xs text-slate-500">
                    {time}
                </p>

            </div>

        </motion.div>
    );
}