"use client";

import { motion } from "framer-motion";

const particles = [...Array(18)];

export default function FloatingParticles() {
    return (
        <>
            {particles.map((_, index) => {
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                const size = 4 + Math.random() * 8;
                const duration = 5 + Math.random() * 5;
                const delay = Math.random() * 5;

                return (
                    <motion.div
                        key={index}
                        className="absolute rounded-full bg-white/25"
                        style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: size,
                            height: size,
                        }}
                        animate={{
                            y: [-12, 12, -12],
                            opacity: [0.15, 0.7, 0.15],
                            scale: [1, 1.4, 1],
                        }}
                        transition={{
                            duration,
                            repeat: Infinity,
                            delay,
                        }}
                    />
                );
            })}
        </>
    );
}