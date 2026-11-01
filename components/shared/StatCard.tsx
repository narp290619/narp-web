// "use client"

// import CountUp from "react-countup"
// import { useInView } from "react-intersection-observer"

// interface StatCardProps {
//   value: number
//   suffix?: string
//   title: string
//   icon: string
//   decimals?: number
// }

// export default function StatCard({
//   value,
//   suffix = "",
//   title,
//   icon,
//   decimals = 0,
// }: StatCardProps) {
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.4,
//   })

//   return (
//     <div
//       ref={ref}
//       className="flex items-center gap-4 rounded-2xl bg-white/90 px-6 py-5 shadow-lg backdrop-blur"
//     >
//       <div className="text-4xl">{icon}</div>

//       <div>
//         <h3 className="text-3xl font-bold text-orange-500">
//           {inView ? (
//             <CountUp
//               end={value}
//               duration={2}
//               decimals={decimals}
//             />
//           ) : (
//             0
//           )}
//           {suffix}
//         </h3>

//         <p className="text-slate-600">{title}</p>
//       </div>
//     </div>
//   )
// }



"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface StatCardProps {
    value: number;
    suffix?: string;
    title: string;
    icon: string;
    decimals?: number;
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
    });

    return (
        <div
            ref={ref}
            className="
                flex
                min-w-0
                min-h-[100px]
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-100
                bg-white/90
                px-3
                py-4
                shadow-lg
                backdrop-blur
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                sm:gap-4
                sm:px-5
            "
        >
            {/* Icon */}
            <div className="shrink-0 text-3xl sm:text-4xl">
                {icon}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <h3 className="
                    whitespace-nowrap
                    text-2xl
                    font-bold
                    leading-tight
                    text-orange-500
                    sm:text-3xl
                ">
                    {inView ? (
                        <CountUp
                            end={value}
                            duration={2}
                            decimals={decimals}
                            separator=","
                        />
                    ) : (
                        "0"
                    )}
                    {suffix}
                </h3>

                <p className="
                    mt-1
                    break-words
                    text-sm
                    leading-tight
                    text-slate-600
                    sm:text-base
                ">
                    {title}
                </p>
            </div>
        </div>
    );
}
