// "use client"

// import { motion } from "framer-motion"
// import { ReactNode } from "react"

// interface FadeUpProps {
//   children: ReactNode
//   delay?: number
// }

// export default function FadeUp({
//   children,
//   delay = 0,
// }: FadeUpProps) {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         y: 40,
//       }}
//       whileInView={{
//         opacity: 1,
//         y: 0,
//       }}
//       viewport={{
//         once: true,
//         amount: 0.25,
//       }}
//       transition={{
//         duration: 0.7,
//         delay,
//         ease: "easeOut",
//       }}
//     >
//       {children}
//     </motion.div>
//   )
// }


"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeUpProps {
    children: ReactNode;
    delay?: number;
    distance?: number;
    duration?: number;
}

export default function FadeUp({
    children,
    delay = 0,
    distance = 40,
    duration = 0.7,
}: FadeUpProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: distance,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.25,
            }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1], // smoother than easeOut
            }}
        >
            {children}
        </motion.div>
    );
}