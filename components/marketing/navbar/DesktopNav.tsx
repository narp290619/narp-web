// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"

// import { navigation } from "@/config/navigation"
// import { motion } from "framer-motion"

// export default function DesktopNav() {
//   const pathname = usePathname()

//   return (
//     <nav className="hidden items-center gap-2 lg:flex">
//       {navigation.map((item) => {
//         const active =
//           item.href === "/"
//             ? pathname === "/"
//             : pathname === item.href ||
//             pathname.startsWith(`${item.href}/`);

//         return (
//           // <Link
//           //   key={item.title}
//           //   href={item.href}
//           //   className={`text-sm font-medium transition-colors ${
//           //     active
//           //       ? "text-primary"
//           //       : "text-slate-600 hover:text-primary"
//           //   }`}
//           // >
//           //   {item.title}
//           // </Link>

//           <div
//             key={item.href}
//             className="relative"
//           >
//             {active && (
//               <motion.div
//                 layoutId="active-nav"
//                 className="
//                 absolute
//                 inset-0
//                 rounded-full
//                 bg-orange-100
//             "
//                 transition={{
//                   type: "spring",
//                   stiffness: 350,
//                   damping: 30,
//                 }}
//               />
//             )}

//             <Link
//               href={item.href}
//               className={`
//                   relative
//                   z-10
//                   rounded-full
//                   px-5
//                   py-2
//                   text-sm
//                   font-medium
//                   transition-colors
//                   ${active
//                   ? "text-orange-600"
//                   : "text-slate-600 hover:text-orange-500"
//                 }
//               `}
//             >
//               {item.title}
//             </Link>
//           </div>
//         )
//       })}
//     </nav>
//   )
// }



"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

import { navigation } from "@/config/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DesktopNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Main navigation links
  const primaryNavigation = navigation.slice(0, 4);

  // Secondary navigation links
  const secondaryNavigation = navigation.slice(4);

  const isActive = (href: string) => {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  const isMoreActive = secondaryNavigation.some((item) =>
    isActive(item.href)
  );

  return (
    <nav className="hidden items-center gap-1 lg:flex">

      {/* Primary Navigation */}
      {primaryNavigation.map((item) => {
        const active = isActive(item.href);

        return (
          <div key={item.href} className="relative">

            {active && (
              <motion.div
                layoutId="active-nav"
                className="absolute inset-0 rounded-full bg-orange-100"
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
                                whitespace-nowrap
                                rounded-full
                                px-3
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
        );
      })}

      {/* More Dropdown */}
      {secondaryNavigation.length > 0 && (
        <DropdownMenu>

          <DropdownMenuTrigger
            className={`
                            flex
                            items-center
                            gap-1
                            rounded-full
                            px-3
                            py-2
                            text-sm
                            font-medium
                            outline-none
                            transition-colors
                            ${isMoreActive
                ? "bg-orange-100 text-orange-600"
                : "text-slate-600 hover:bg-slate-100 hover:text-orange-500"
              }
                        `}
          >
            More

            <ChevronDown className="h-4 w-4" />

          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={10}
            className="
                  z-[100]
                  w-48
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-2
                  text-slate-900
                  shadow-2xl
                  ring-1
                  ring-black/5
                  backdrop-blur-none
              "
          >
            {secondaryNavigation.map((item) => (
              <DropdownMenuItem
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`
                    cursor-pointer
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    transition-colors
                    hover:bg-orange-50
                    hover:text-orange-600
                    ${isActive(item.href)
                    ? "bg-orange-50 font-semibold text-orange-600"
                    : "text-slate-700"
                  }
                `}
              >
                {item.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>

        </DropdownMenu>
      )}

    </nav>
  );
}
