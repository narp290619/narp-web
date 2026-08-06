"use client";

import { motion } from "framer-motion";

export default function PaymentFlow() {
    return (
        <div className="mt-6 flex flex-col items-center">

            {/* Client */}

            <motion.div
                initial={{ scale: .9 }}
                animate={{ scale: 1 }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5,
                }}
                className="rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white"
            >
                Client
            </motion.div>

            <div className="my-3 h-10 w-[3px] bg-orange-300" />

            {/* Escrow */}

            <motion.div
                animate={{
                    boxShadow: [
                        "0 0 0 rgba(249,115,22,0)",
                        "0 0 24px rgba(249,115,22,.45)",
                        "0 0 0 rgba(249,115,22,0)",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                }}
                className="rounded-2xl bg-orange-500 px-6 py-3 text-center text-white"
            >
                <p className="text-xs uppercase tracking-wider">
                    NARP
                </p>

                <p className="font-bold">
                    Secure Escrow
                </p>
            </motion.div>

            <div className="my-3 h-10 w-[3px] bg-orange-300" />

            {/* Freelancer */}

            <motion.div
                initial={{ scale: .9 }}
                animate={{ scale: 1 }}
                transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5,
                    delay: .5,
                }}
                className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white"
            >
                Freelancer
            </motion.div>

        </div>
    );
}