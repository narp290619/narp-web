"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface PhoneMockupProps {
  image: string
  rotate?: string
  translate?: string
  animation?: string
  delay?: number
}

export default function PhoneMockup({
  image,
  rotate = "",
  translate = "",
  animation = "",
  delay = 0,
}: PhoneMockupProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 80,
        rotate: -8,
      }}
      animate={{
        opacity: 1,
        y: [0, -12, 0],
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotate: 0,
      }}
      viewport={{ once: true }}
      transition={{
        opacity: {
          duration: 0.8,
          delay,
        },
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
      whileHover={{
        y: -12,
        scale: 1.03,
      }}
      className={`rounded-[42px] bg-black p-3 shadow-2xl transition duration-500 hover:-translate-y-3 ${rotate} ${translate} ${animation}`}
    >
      <div className="overflow-hidden rounded-[34px]">
        <Image
          src={image}
          alt="NARP App"
          width={260}
          height={560}
          className="h-auto w-auto"
        />
      </div>
    </motion.div>
  )
}