"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function SceneContainer({
  sceneKey,
  children,
}: {
  sceneKey: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneKey}
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 1.04,
        }}
        transition={{
          duration: 0.45,
        }}
        className="h-full w-auto"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}