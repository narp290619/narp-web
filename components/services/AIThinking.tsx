"use client";

import { motion } from "framer-motion";

const steps = [

    "Understanding your request",

    "Identifying required skills",

    "Checking similar jobs",

    "Ranking professionals",

];

export default function AIThinking() {

    return (

        <div className="space-y-3 rounded-3xl bg-white p-6 shadow-lg">

            <h3 className="font-bold text-orange-500">

                🤖 NARP AI

            </h3>

            {steps.map((step, index) => (

                <motion.div

                    key={step}

                    initial={{
                        opacity: 0,
                        x: -20,
                    }}

                    animate={{
                        opacity: 1,
                        x: 0,
                    }}

                    transition={{
                        delay: index * .4,
                    }}

                    className="flex items-center gap-3"

                >

                    <div className="h-2 w-2 rounded-full bg-green-500" />

                    {step}

                </motion.div>

            ))}

        </div>

    );

}