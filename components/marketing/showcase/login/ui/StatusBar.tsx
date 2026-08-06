"use client";

import {
  BatteryFull,
  Signal,
  Wifi,
} from "lucide-react";

export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-xs font-semibold text-slate-700">
      <span>9:41</span>

      <div className="flex items-center gap-1">
        <Signal size={14} />
        <Wifi size={14} />
        <BatteryFull size={16} />
      </div>
    </div>
  );
}