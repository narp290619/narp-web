"use client";

import { motion } from "framer-motion";

const item = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    show: {
        opacity: 1,
        y: 0,
    },
};

export default function StaggerItem({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            variants={item}
            transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}