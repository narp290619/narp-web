"use client"

import { motion } from "framer-motion"

interface FloatingProps {
  children: React.ReactNode
  delay?: number
}

export default function Floating({
  children,
  delay = 0,
}: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}