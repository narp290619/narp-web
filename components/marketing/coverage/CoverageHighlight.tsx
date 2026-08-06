"use client";

import { motion } from "framer-motion";

interface Props {
  city: string;
  professionals: number;
  online: number;
  x: number;
  y: number;
  delay?: number;
}

export default function CoverageHighlight({
  city,
  professionals,
  online,
  x,
  y,
  delay = 0,
}: Props) {
  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}

      initial={{
        opacity: 0,
        y: 20,
      }}

      animate={{
        opacity: 1,
        y: [0, -8, 0],
      }}

      transition={{
        opacity: {
          duration: 0.6,
        },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
    >
      <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md">

        <div className="flex items-center justify-between gap-6">

          <div>
            <p className="font-bold text-slate-800">
              {city}
            </p>

            <p className="text-xs text-slate-500">
              {professionals.toLocaleString()} Professionals
            </p>
          </div>

          <div className="flex items-center gap-2">

            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />

            <span className="text-xs font-semibold text-green-700">
              {online} Online
            </span>

          </div>

        </div>

      </div>
    </motion.div>
  );
}