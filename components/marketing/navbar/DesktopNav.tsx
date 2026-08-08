"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navigation } from "@/config/navigation"
import { motion } from "framer-motion"

export default function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden items-center gap-2 lg:flex">
      {navigation.map((item) => {
        const active = pathname === item.href

        return (
          // <Link
          //   key={item.title}
          //   href={item.href}
          //   className={`text-sm font-medium transition-colors ${
          //     active
          //       ? "text-primary"
          //       : "text-slate-600 hover:text-primary"
          //   }`}
          // >
          //   {item.title}
          // </Link>

          <div
            key={item.href}
            className="relative"
          >
            {active && (
              <motion.div
                layoutId="active-nav"
                className="
                absolute
                inset-0
                rounded-full
                bg-orange-100
            "
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
              />
            )}

            <Link
              href={item.href}
              className={`
                  relative
                  z-10
                  rounded-full
                  px-5
                  py-2
                  text-sm
                  font-medium
                  transition-colors
                  ${active
                        ? "text-orange-600"
                        : "text-slate-600 hover:text-orange-500"
                      }
              `}
            >
              {item.title}
            </Link>
          </div>
        )
      })}
    </nav>
  )
}