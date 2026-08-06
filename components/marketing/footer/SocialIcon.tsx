"use client";

import { motion } from "framer-motion";

interface Props {
    icon: React.ElementType;
    href: string;
    label: string;
}

export default function SocialIcon({
    icon: Icon,
    href,
    label,
}: Props) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{
                y: -4,
                scale: 1.15,
            }}
            whileTap={{
                scale: 0.95,
            }}
            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-slate-900
                text-slate-400
                transition-colors
                hover:bg-orange-500
                hover:text-white
            "
        >
            <Icon size={20} />
        </motion.a>
    );
}