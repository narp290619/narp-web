"use client";

import { motion } from "framer-motion";
import { ShowcaseItem } from "./types";

interface Props {
  items: ShowcaseItem[];
  active: string;
  onSelect: (id: string) => void;
}

export default function ShowcaseProgress({
  items,
  active,
  onSelect,
}: Props) {
  return (
    <div className="mx-auto mt-10 flex max-w-3xl gap-3">

      {items.map((item) => {

        const isActive = item.id === active;

        return (

          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="group flex-1 transition-transform hover:scale-105"
          >

            <div className="h-1 overflow-hidden rounded-full bg-slate-200 group-hover:bg-slate-300">

              {isActive && (

                <motion.div
                  key={item.id}
                  className="h-full rounded-full bg-orange-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 5,
                    ease: "linear",
                  }}
                />

              )}

            </div>

          </button>

        );

      })}

    </div>
  );
}