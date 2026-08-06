"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({
  children,
}: PhoneFrameProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        rotate: -4,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: 0,
      }}
      transition={{
        duration: 0.8,
      }}
      className="relative"
    >
      {/* Glow */}

      <div className="absolute inset-0 rounded-[48px] bg-orange-400/20 blur-3xl" />

      {/* Phone */}

      <div
        className="
          relative
          h-[720px]
          w-[360px]
          rounded-[48px]
          border-[10px]
          border-neutral-900
          bg-neutral-900
          shadow-2xl
        "
      >
        {/* Speaker */}

        <div
          className="
            absolute
            left-1/2
            top-3
            z-30
            h-6
            w-36
            -translate-x-1/2
            rounded-full
            bg-neutral-800
          "
        />

        {/* Camera */}

        <div
          className="
            absolute
            left-1/2
            top-5
            z-40
            h-2.5
            w-2.5
            -translate-x-1/2
            rounded-full
            bg-neutral-600
          "
        />

        {/* Screen */}

        <div
          className="
            absolute
            inset-2
            overflow-hidden
            rounded-[38px]
            bg-white
          "
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}