"use client";

import { motion } from "framer-motion";

export default function HoverCard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // <motion.div
        //     whileHover={{
        //         y: -8,
        //         scale: 1.02,
        //     }}
        //     transition={{
        //         type: "spring",
        //         stiffness: 300,
        //         damping: 20,
        //     }}
        // >

        <motion.div
            whileHover={{
                y: -10,
                scale: 1.02,
            }}
            whileTap={{
                scale: 0.99,
            }}
            transition={{
                type: "spring",
                stiffness: 320,
                damping: 22,
            }}
        >

            {children}
        </motion.div>
    );
}