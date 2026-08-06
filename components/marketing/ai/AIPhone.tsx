"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import ThinkingBubble from "./ThinkingBubble";
import ChecklistItem from "./ChecklistItem";
import RecommendationCard from "./RecommendationCard";

export default function AIPhone() {

    const [step, setStep] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);

    const analysisSteps = [
        "Understanding your request",
        "Matching required skills",
        "Verifying freelancer ratings",
        "Finding nearby freelancers",
        "Checking availability",
    ];

    useEffect(() => {
        if (!scrollRef.current) return;

        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [step]);

    useEffect(() => {

        const sequence = [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
        ];

        const timers = sequence.map((_, index) =>
            setTimeout(() => {
                setStep(index);
            }, index * 900)
        );

        const restart = setInterval(() => {

            setStep(0);

            sequence.forEach((_, index) => {

                setTimeout(() => {

                    setStep(index);

                }, index * 900);

            });

        }, 8500);

        return () => {

            timers.forEach(clearTimeout);

            clearInterval(restart);

        };

    }, []);

    return (

        <motion.div

            animate={{
                y: [0, -8, 0],
            }}

            transition={{
                duration: 5,
                repeat: Infinity,
            }}

            className="
                w-[400px]
                max-w-[360px]
                overflow-hidden
                rounded-[42px]
                border-[10px]
                border-slate-900
                bg-white
                shadow-2xl
            "
        >

            <div className="bg-slate-900 py-4 text-center font-semibold text-white">

                🤖 NARP AI

            </div>

            <div
                ref={scrollRef}
                className="
                    h-[720px]
                    space-y-5
                    overflow-y-auto
                    p-5
                    hide-scrollbar
                "
            >

                <div className="flex justify-end">

                    <div className="max-w-[240px] rounded-3xl rounded-br-lg bg-orange-500 px-5 py-4 text-white">

                        I need an electrician tomorrow morning.

                    </div>

                </div>

                {step >= 1 && (
                    <ThinkingBubble progress={step} />
                )}

                {step >= 2 && (

                    <ChecklistItem
                        text="Understanding your request"
                    />

                )}

                {step >= 3 && (

                    <ChecklistItem
                        text="Matching required skills"
                    />

                )}

                {step >= 4 && (

                    <ChecklistItem
                        text="Verifying freelancer ratings"
                    />

                )}

                {step >= 5 && (

                    <ChecklistItem
                        text="Finding nearby freelancers"
                    />

                )}

                {step >= 6 && (

                    <ChecklistItem
                        text="Checking availability"
                    />

                )}

                {step >= 7 && (

                    <ChecklistItem
                        text="Selecting the best match"
                    />

                )}

                {/* {step >= 2 && step <= 5 && (
                    <ChecklistItem
                        text={analysisSteps[step - 2]}
                    />
                )}

                {step >= 6 && (
                    <ChecklistItem
                        text="AI Analysis Complete"
                    />
                )} */}

                {step >= 8 && <RecommendationCard />}

            </div>

        </motion.div>

    );

}