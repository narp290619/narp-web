// "use client";

// import { useEffect, useState } from "react";
// import { Download } from "lucide-react";
// import { motion } from "framer-motion";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import Container from "@/components/shared/Container";

// import DesktopNav from "./DesktopNav";
// import Logo from "./Logo";
// import MobileNav from "./MobileNav";

// import { useAuthContext } from "@/providers/AuthProvider";
// import UserMenu from "@/components/navbar/UserMenu";

// export default function Navbar() {
//     const [scrolled, setScrolled] = useState(false);

//     const { user } = useAuthContext();

//     useEffect(() => {
//         const handleScroll = () => {
//             setScrolled(window.scrollY > 40);
//         };

//         window.addEventListener("scroll", handleScroll);

//         handleScroll();

//         return () => {
//             window.removeEventListener("scroll", handleScroll);
//         };
//     }, []);

//     return (
//         <header
//             className={`
//                 fixed
//                 left-0
//                 right-0
//                 top-0
//                 z-50
//                 transition-all
//                 duration-500
//                 ${scrolled ? "py-3" : "py-6"}
//             `}
//         >
//             <Container>

//                 <div
//                     className={`
//                         mx-auto
//                         flex
//                         items-center
//                         justify-between
//                         gap-3
//                         rounded-2xl
//                         transition-all
//                         duration-500
//                         ${
//                             scrolled
//                                 ? "h-16 border border-white/60 bg-white/70 px-5 shadow-[0_10px_40px_rgba(15,23,42,.12)] backdrop-blur-2xl"
//                                 : "h-20 bg-transparent px-0"
//                         }
//                     `}
//                 >

//                     {/* Logo */}
//                     <motion.div
//                         className="shrink-0"
//                         animate={{
//                             scale: scrolled ? 0.95 : 1,
//                         }}
//                         transition={{
//                             duration: 0.3,
//                         }}
//                     >
//                         <Logo />
//                     </motion.div>

//                     {/* Desktop Navigation */}
//                     <div className="flex flex-1 justify-center">
//                         <DesktopNav />
//                     </div>

//                     {/* Desktop Actions */}
//                     <div className="hidden shrink-0 items-center gap-2 lg:flex">

//                         {user ? (
//                             <UserMenu />
//                         ) : (
//                             <Link href="/login">
//                                 <Button
//                                     variant="ghost"
//                                     className="rounded-full px-4 hover:bg-slate-100"
//                                 >
//                                     Login
//                                 </Button>
//                             </Link>
//                         )}

//                         <Button
//                             className="
//                                 whitespace-nowrap
//                                 rounded-full
//                                 bg-orange-500
//                                 px-5
//                                 hover:bg-orange-600
//                             "
//                         >
//                             <Download className="mr-2 h-4 w-4" />
//                             Download App
//                         </Button>

//                     </div>

//                     {/* Mobile Navigation */}
//                     <div className="shrink-0 lg:hidden">
//                         <MobileNav />
//                     </div>

//                 </div>

//             </Container>
//         </header>
//     );
// }



"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";

import DesktopNav from "./DesktopNav";
import Logo from "./Logo";
import MobileNav from "./MobileNav";

import { useAuthContext } from "@/providers/AuthProvider";
import UserMenu from "@/components/navbar/UserMenu";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    const {
        user,
        isAdmin,
        adminLoading,
    } = useAuthContext();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`
                fixed
                left-0
                right-0
                top-0
                z-50
                transition-all
                duration-500
                ${scrolled ? "py-3" : "py-6"}
            `}
        >
            <Container>

                <div
                    className={`
                        mx-auto
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-2xl
                        transition-all
                        duration-500
                        ${scrolled
                            ? "h-16 border border-white/60 bg-white/70 px-5 shadow-[0_10px_40px_rgba(15,23,42,.12)] backdrop-blur-2xl"
                            : "h-20 bg-transparent px-0"
                        }
                    `}
                >

                    {/* Logo */}
                    <motion.div
                        className="shrink-0"
                        animate={{
                            scale: scrolled ? 0.95 : 1,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                    >
                        <Logo />
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="flex flex-1 justify-center">
                        <DesktopNav />
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden shrink-0 items-center gap-2 lg:flex">

                        {user ? (
                            <>
                                {!adminLoading && isAdmin && (
                                    <Link href="/admin">
                                        <Button
                                            variant="ghost"
                                            className="
                                                rounded-full
                                                px-4
                                                font-semibold
                                                text-blue-700
                                                hover:bg-blue-50
                                            "
                                        >
                                            Admin
                                        </Button>
                                    </Link>
                                )}

                                <UserMenu />
                            </>
                        ) : (
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    className="rounded-full px-4 hover:bg-slate-100"
                                >
                                    Login
                                </Button>
                            </Link>
                        )}

                        <Button
                            className="
                                whitespace-nowrap
                                rounded-full
                                bg-orange-500
                                px-5
                                hover:bg-orange-600
                            "
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download App
                        </Button>

                    </div>

                    {/* Mobile Navigation */}
                    <div className="shrink-0 lg:hidden">
                        <MobileNav />
                    </div>

                </div>

            </Container>
        </header>
    );
}

