"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface ShowcasePhoneProps {
  image: string;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ShowcasePhone({
  image,
  onNext,
  onPrevious,
}: ShowcasePhoneProps) {
  return (
    <div className="group relative flex justify-center">

      <div className="rounded-[42px] bg-black p-3 shadow-2xl">

        <div className="overflow-hidden rounded-[34px]">

          <AnimatePresence mode="wait">

            <motion.div
              key={image}
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -40,
              }}
              transition={{
                duration: 0.45,
              }}
            >
                
              <Image
                key={image}
                src={image}
                alt="NARP App"
                width={320}
                height={680}
                className="h-auto w-auto"
              />

              <button
                onClick={onPrevious}
                className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white/90
                    p-3
                    shadow-lg
                    transition
                    hover:scale-110

                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-300
                "
                >
                ←
                </button>

                                <button
                onClick={onNext}
                className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white/90
                    p-3
                    shadow-lg
                    transition
                    hover:scale-110

                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-300
                "
                >
                →
                </button>

            </motion.div>

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}