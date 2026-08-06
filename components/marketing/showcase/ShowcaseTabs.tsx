"use client";

import { motion } from "framer-motion";
import { ShowcaseItem } from "./types";

// interface ShowcaseItem {
//   id: string;
//   title: string;
// }

interface ShowcaseTabsProps {
    items: ShowcaseItem[];
    active: string;
    onChange: (id: string) => void;
}

export default function ShowcaseTabs({
    items,
    active,
    onChange,
}: ShowcaseTabsProps) {
    return (
        <div className="mt-12 flex flex-wrap justify-center gap-3">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    className="relative rounded-full px-6 py-3"
                >

                    {active === item.id && (

                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-full bg-orange-500"
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 28,
                            }}
                        />

                    )}

                    <span
                        className={`relative z-10 ${active === item.id
                                ? "text-white"
                                : "text-slate-700"
                            }`}
                    >
                        {item.title}
                    </span>

                </button>
            ))}
        </div>
    );
}