"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import { navigation } from "@/config/navigation"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        }
      />

      <SheetContent side="right" className="h-16 bg-white/70 shadow-[0_10px_40px_rgba(15,23,42,.12)] backdrop-blur-2xl border border-white/60 px-6">
        <SheetHeader>
          <SheetTitle>NARP</SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-6 px-4">
          {navigation.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-lg font-medium"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}