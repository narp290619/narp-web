"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

import Container from "@/components/shared/Container"

import DesktopNav from "./DesktopNav"
import Logo from "./Logo"
import MobileNav from "./MobileNav"
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import UserMenu from "@/components/navbar/UserMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const { user } = useAuthContext();

  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  useEffect(() => {

    const handleScroll = () => {

      setScrolled(window.scrollY > 40);

    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, []);

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        transition-all
        duration-500
        ${scrolled
          ? "py-3"
          : "py-6"
        }
    `}
    >
      <Container>

        <div
          className={`
            mx-auto
            flex
            items-center
            justify-between
            rounded-2xl
            transition-all
            duration-500

            ${scrolled
              ? "h-16 bg-white/70 shadow-[0_10px_40px_rgba(15,23,42,.12)] backdrop-blur-2xl border border-white/60 px-6"
              : "h-20 bg-transparent px-0"
            }
        `}
        >
          <motion.div
            animate={{
              scale: scrolled ? 0.95 : 1,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <Logo />
          </motion.div>

          <DesktopNav />

          <div className="hidden items-center gap-3 lg:flex">

            {user ? (

              <UserMenu />

            ) : (

              <Link href="/login">

                <Button
                  variant="ghost"
                  className="
                      rounded-full
                      px-5
                      hover:bg-slate-100
                  "
                >
                  Login
                </Button>

              </Link>

            )}

            <Button
              className="
                  rounded-full
                  bg-orange-500
                  px-6
              "
            >

              <Download className="mr-2 h-4 w-4" />

              Download App

            </Button>

          </div>

          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  )
}