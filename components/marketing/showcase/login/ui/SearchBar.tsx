"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div
      className="
        mt-6
        flex
        items-center
        gap-3
        rounded-2xl
        bg-slate-100
        px-4
        py-4
      "
    >
      <Search
        className="text-slate-400"
        size={18}
      />

      <span className="text-sm text-slate-400">
        Search for a service...
      </span>
    </div>
  );
}