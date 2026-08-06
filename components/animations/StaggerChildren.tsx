// "use client";

// import { motion } from "framer-motion";

// const container = {
//     hidden: {},
//     show: {
//         transition: {
//             staggerChildren: 0.1,
//         },
//     },
// };

// export default function StaggerChildren({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     return (
//         <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="show"
//             viewport={{
//                 once: true,
//                 amount: 0.2,
//             }}
//         >
//             {children}
//         </motion.div>
//     );
// }

"use client";

import { motion } from "framer-motion";

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function StaggerChildren({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
        >
            {children}
        </motion.div>
    );
}