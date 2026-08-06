"use client";

import { Star } from "lucide-react";

interface Props {
  rating: number;
}

export default function RatingStars({
  rating,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <Star
        className="fill-yellow-400 text-yellow-400"
        size={14}
      />

      <span className="text-xs font-semibold">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}