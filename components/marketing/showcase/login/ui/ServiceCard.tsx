"use client";

import RatingStars from "./RatingStars";

interface Props {
  emoji: string;
  title: string;
  members: string;
  rating: number;
}

export default function ServiceCard({
  emoji,
  title,
  members,
  rating,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-100
        bg-white
        p-4
        shadow-sm
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {emoji}
          </div>

          <div>
            <h3 className="font-semibold">
              {title}
            </h3>

            <p className="text-xs text-slate-500">
              {members}
            </p>
          </div>
        </div>

        <RatingStars rating={rating} />
      </div>
    </div>
  );
}