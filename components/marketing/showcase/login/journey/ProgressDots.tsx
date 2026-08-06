"use client";

interface Props {
  total: number;
  current: number;
}

export default function ProgressDots({
  total,
  current,
}: Props) {
  return (
    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all ${
            current === index
              ? "w-8 bg-orange-500"
              : "w-2 bg-slate-300"
          }`}
        />
      ))}
    </div>
  );
}