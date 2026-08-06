"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { useAuthContext } from "@/providers/AuthProvider";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
    User,
    Briefcase,
    Bell,
    Settings,
    LogOut,
} from "lucide-react";

export default function UserMenu() {

    const { user } = useAuthContext();

    const router = useRouter();

    if (!user) return null;

    async function handleLogout() {

        await signOut(auth);

        router.push("/");

    }

    return (

        <DropdownMenu>

            <DropdownMenuTrigger
                className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-2
                    py-1
                    hover:bg-slate-100
                    transition
                "
            >

                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL ?? ""} />

                    <AvatarFallback>
                        {user.displayName?.charAt(0) ??
                            user.email?.charAt(0).toUpperCase() ??
                            "U"}
                    </AvatarFallback>
                </Avatar>

                <span className="hidden md:block">
                    {user.displayName ?? user.email}
                </span>

            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-60"
            >

                <div className="px-3 py-3">

                    <p className="font-semibold">
                        {user.displayName ?? "User"}
                    </p>

                    <p className="text-sm text-slate-500">
                        {user.email}
                    </p>

                </div>

                <DropdownMenuSeparator />

                {/* <Link href="/profile">

                    <DropdownMenuItem>

                        <User />

                        My Profile

                    </DropdownMenuItem>

                </Link> */}

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User />
                    My Profile
                </DropdownMenuItem>

                {/* <Link href="/bookings">

                    <DropdownMenuItem>

                        <Briefcase />

                        My Bookings

                    </DropdownMenuItem>

                </Link> */}

                <DropdownMenuItem onClick={() => router.push("/bookings")}>
                    <Briefcase />
                    My Bookings
                </DropdownMenuItem>

                {/* <Link href="/job-requests">

                    <DropdownMenuItem>

                        <Briefcase />

                        My Job Requests

                    </DropdownMenuItem>

                </Link> */}

                <DropdownMenuItem onClick={() => router.push("/job-requests")}>
                    <Briefcase />
                    My Job Requests
                </DropdownMenuItem>

                {/* <Link href="/notifications">

                    <DropdownMenuItem>

                        <Bell />

                        Notifications

                    </DropdownMenuItem>

                </Link> */}

                <DropdownMenuItem onClick={() => router.push("/notifications")}>
                    <Bell />
                    Notifications
                </DropdownMenuItem>

                {/* <Link href="/settings">

                    <DropdownMenuItem>

                        <Settings />

                        Settings

                    </DropdownMenuItem>

                </Link> */}

                <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                >

                    <LogOut />

                    Logout

                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>

    );

}