// "use client"

// import Link from "next/link"
// import { Menu } from "lucide-react"

// import { navigation } from "@/config/navigation"

// import { Button } from "@/components/ui/button"
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"

// export default function MobileNav() {
//   return (
//     <Sheet>
//       <SheetTrigger
//         render={
//           <Button variant="ghost" size="icon">
//             <Menu />
//           </Button>
//         }
//       />

//       <SheetContent side="right" className="h-16 bg-white/70 shadow-[0_10px_40px_rgba(15,23,42,.12)] backdrop-blur-2xl border border-white/60 px-6">
//         <SheetHeader>
//           <SheetTitle>NARP</SheetTitle>
//         </SheetHeader>

//         <nav className="mt-8 flex flex-col gap-6 px-4">
//           {navigation.map((item) => (
//             <Link
//               key={item.title}
//               href={item.href}
//               className="text-lg font-medium"
//             >
//               {item.title}
//             </Link>
//           ))}
//         </nav>
//       </SheetContent>
//     </Sheet>
//   )
// }




"use client";

import Link from "next/link";
import { Menu, ShieldCheck } from "lucide-react";

import { navigation } from "@/config/navigation";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { useAuthContext } from "@/providers/AuthProvider";
import UserMenu from "@/components/navbar/UserMenu";

export default function MobileNav() {
    const {
        user,
        isAdmin,
        adminLoading,
    } = useAuthContext();

    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button variant="ghost" size="icon">
                        <Menu />
                    </Button>
                }
            />

            <SheetContent
                side="right"
                className="
                    h-full
                    border
                    border-white/60
                    bg-white/90
                    px-6
                    shadow-[0_10px_40px_rgba(15,23,42,.12)]
                    backdrop-blur-2xl
                "
            >
                <SheetHeader>
                    <SheetTitle>NARP</SheetTitle>
                </SheetHeader>

                <nav className="mt-8 flex flex-col gap-6 px-4">

                    {/* Main Navigation */}

                    {navigation.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="text-lg font-medium"
                        >
                            {item.title}
                        </Link>
                    ))}

                    {/* Admin Navigation */}

                    {user && !adminLoading && isAdmin && (
                        <Link
                            href="/admin"
                            className="
                                flex
                                items-center
                                gap-2
                                text-lg
                                font-semibold
                                text-blue-700
                            "
                        >
                            <ShieldCheck className="h-5 w-5" />
                            Admin
                        </Link>
                    )}

                    {/* Authentication */}

                    <div className="border-t border-slate-200 pt-6">

                        {user ? (
                            <UserMenu />
                        ) : (
                            <Link href="/login">
                                <Button
                                    variant="default"
                                    className="
                                        w-full
                                        rounded-full
                                        bg-blue-600
                                        hover:bg-blue-700
                                    "
                                >
                                    Login
                                </Button>
                            </Link>
                        )}

                    </div>

                </nav>
            </SheetContent>
        </Sheet>
    );
}
