"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface ServiceChipProps {
  image: string
  label: string
  delay?: number
}

export default function ServiceChip({
  image,
  label,
  delay = 0,
}: ServiceChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: {
          duration: 0.6,
          delay,
        },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
      className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-5 py-3 shadow-xl backdrop-blur"
    >
      <Image
        src={image}
        alt={label}
        width={30}
        height={30}
        className="h-auto w-auto rounded-2xl"
      />

      <span className="font-medium text-slate-700">
        {label}
      </span>
    </motion.div>
  )
}