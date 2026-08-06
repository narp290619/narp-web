"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function StarRating() {
  return (
    <div className="flex justify-center gap-2">
      {[0, 1, 2, 3, 4].map((star) => (
        <motion.div
          key={star}
          initial={{
            scale: 0,
            rotate: -90,
          }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{
            delay: star * 0.15,
            duration: 0.4,
          }}
        >
          <Star
            size={28}
            className="fill-yellow-400 text-yellow-400"
          />
        </motion.div>
      ))}
    </div>
  );
}