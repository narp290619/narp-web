"use client";

import { CheckCircle2 } from "lucide-react";

const items = [
  "AI matched the best freelancer",
  "Face verification completed",
  "Live tracking finished",
  "Secure payment protected",
];

export default function SuccessChecklist() {
  return (
    <div className="mt-6 space-y-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
        >
          <CheckCircle2
            size={18}
            className="text-green-500"
          />

          <span className="text-sm text-slate-700">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}