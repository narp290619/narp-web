"use client"

import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"

interface StatCardProps {
  value: number
  suffix?: string
  title: string
  icon: string
  decimals?: number
}

export default function StatCard({
  value,
  suffix = "",
  title,
  icon,
  decimals = 0,
}: StatCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  })

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 rounded-2xl bg-white/90 px-6 py-5 shadow-lg backdrop-blur"
    >
      <div className="text-4xl">{icon}</div>

      <div>
        <h3 className="text-3xl font-bold text-orange-500">
          {inView ? (
            <CountUp
              end={value}
              duration={2}
              decimals={decimals}
            />
          ) : (
            0
          )}
          {suffix}
        </h3>

        <p className="text-slate-600">{title}</p>
      </div>
    </div>
  )
}