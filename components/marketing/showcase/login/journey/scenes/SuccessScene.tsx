"use client";

import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

import StarRating from "../ui/StarRating";
import SuccessChecklist from "../ui/SuccessChecklist";

export default function SuccessScene() {
  return (
    <div className="flex h-full flex-col bg-white p-6">

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto rounded-full bg-green-100 p-5"
      >
        <PartyPopper
          size={48}
          className="text-green-600"
        />
      </motion.div>

      <h2 className="mt-6 text-center text-3xl font-bold">
        Job Completed
      </h2>

      <p className="mt-2 text-center text-slate-500">
        Thank you for choosing NARP.
      </p>

      <div className="mt-6">
        <StarRating />
      </div>

      <div className="mt-8 rounded-3xl bg-orange-50 p-5 text-center">

        <p className="text-lg font-bold">
          Builder
        </p>

        <p className="text-sm text-slate-500">
          Rated 4.9 • Verified Freelancer
        </p>

      </div>

      <SuccessChecklist />

      <div className="mt-auto rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-4 text-center text-white">

        <p className="text-sm font-semibold">
          Find your next trusted freelancer
        </p>

      </div>

    </div>
  );
}