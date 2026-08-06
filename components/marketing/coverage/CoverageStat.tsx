"use client";

import CountUp from "react-countup";

interface Props {
  value: number;
  suffix?: string;
  title: string;
  icon: string;
}

export default function CoverageStat({
  value,
  suffix,
  title,
  icon,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="mt-5 text-4xl font-bold text-orange-500">
        <CountUp end={value} duration={2} />
        {suffix}
      </h3>

      <p className="mt-2 text-slate-600">
        {title}
      </p>

    </div>
  );
}