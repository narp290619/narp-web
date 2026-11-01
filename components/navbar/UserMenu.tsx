// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { signOut } from "firebase/auth";
// import { auth } from "@/lib/firebase";

// import { useAuthContext } from "@/providers/AuthProvider";

// import {
//     Avatar,
//     AvatarFallback,
//     AvatarImage,
// } from "@/components/ui/avatar";

// import {
//     DropdownMenu,
//     DropdownMenuTrigger,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";

// import {
//     User,
//     Briefcase,
//     Bell,
//     Settings,
//     LogOut,
// } from "lucide-react";

// export default function UserMenu() {

//     const { user } = useAuthContext();

//     const router = useRouter();

//     if (!user) return null;

//     async function handleLogout() {

//         await signOut(auth);

//         router.push("/");

//     }

//     return (

//         <DropdownMenu>

//             <DropdownMenuTrigger
//                 className="
//                     flex
//                     items-center
//                     gap-2
//                     rounded-full
//                     border
//                     px-2
//                     py-1
//                     hover:bg-slate-100
//                     transition
//                 "
//             >

//                 <Avatar className="h-9 w-9">
//                     <AvatarImage src={user.photoURL ?? ""} />

//                     <AvatarFallback>
//                         {user.displayName?.charAt(0) ??
//                             user.email?.charAt(0).toUpperCase() ??
//                             "U"}
//                     </AvatarFallback>
//                 </Avatar>

//                 <span className="hidden md:block">
//                     {user.displayName ?? user.email}
//                 </span>

//             </DropdownMenuTrigger>

//             <DropdownMenuContent
//                 align="end"
//                 className="w-60"
//             >

//                 <div className="px-3 py-3">

//                     <p className="font-semibold">
//                         {user.displayName ?? "User"}
//                     </p>

//                     <p className="text-sm text-slate-500">
//                         {user.email}
//                     </p>

//                 </div>

//                 <DropdownMenuSeparator />

//                 {/* <Link href="/profile">

//                     <DropdownMenuItem>

//                         <User />

//                         My Profile

//                     </DropdownMenuItem>

//                 </Link> */}

//                 <DropdownMenuItem onClick={() => router.push("/profile")}>
//                     <User />
//                     My Profile
//                 </DropdownMenuItem>

//                 {/* <Link href="/bookings">

//                     <DropdownMenuItem>

//                         <Briefcase />

//                         My Bookings

//                     </DropdownMenuItem>

//                 </Link> */}

//                 <DropdownMenuItem onClick={() => router.push("/bookings")}>
//                     <Briefcase />
//                     My Bookings
//                 </DropdownMenuItem>

//                 {/* <Link href="/job-requests">

//                     <DropdownMenuItem>

//                         <Briefcase />

//                         My Job Requests

//                     </DropdownMenuItem>

//                 </Link> */}

//                 <DropdownMenuItem onClick={() => router.push("/job-requests")}>
//                     <Briefcase />
//                     My Job Requests
//                 </DropdownMenuItem>

//                 {/* <Link href="/notifications">

//                     <DropdownMenuItem>

//                         <Bell />

//                         Notifications

//                     </DropdownMenuItem>

//                 </Link> */}

//                 <DropdownMenuItem onClick={() => router.push("/notifications")}>
//                     <Bell />
//                     Notifications
//                 </DropdownMenuItem>

//                 {/* <Link href="/settings">

//                     <DropdownMenuItem>

//                         <Settings />

//                         Settings

//                     </DropdownMenuItem>

//                 </Link> */}

//                 <DropdownMenuItem onClick={() => router.push("/settings")}>
//                     <Settings />
//                     Settings
//                 </DropdownMenuItem>

//                 <DropdownMenuSeparator />

//                 <DropdownMenuItem
//                     variant="destructive"
//                     onClick={handleLogout}
//                 >

//                     <LogOut />

//                     Logout

//                 </DropdownMenuItem>

//             </DropdownMenuContent>

//         </DropdownMenu>

//     );

// }



"use client";

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

    const avatarInitial =
        user.displayName?.trim().charAt(0) ||
        user.email?.charAt(0) ||
        "U";

    return (
        <DropdownMenu>

            {/* Avatar Trigger */}
            <DropdownMenuTrigger
                aria-label="Open account menu"
                className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white
                    bg-white
                    text-slate-900
                    shadow-lg
                    ring-1
                    ring-black/10
                    transition-all
                    duration-200
                    hover:scale-105
                    hover:border-orange-300
                    hover:bg-orange-50
                    hover:shadow-xl
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-orange-400
                "
            >
                <Avatar className="h-9 w-9">

                    <AvatarImage
                        src={user.photoURL ?? ""}
                        alt={user.displayName ?? "User"}
                    />

                    <AvatarFallback className="bg-orange-100 font-semibold text-orange-600">
                        {avatarInitial.toUpperCase()}
                    </AvatarFallback>

                </Avatar>

            </DropdownMenuTrigger>

            {/* Account Dropdown */}
            <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="
                    z-[100]
                    w-64
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
                    data-[state=open]:animate-in
                    data-[state=closed]:animate-out
                "
            >

                {/* User Information */}
                <div className="px-3 py-3">

                    <p className="truncate font-semibold text-slate-900">
                        {user.displayName || "User"}
                    </p>

                    <p className="truncate text-sm text-slate-500">
                        {user.email}
                    </p>

                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer gap-3 rounded-lg py-2"
                >
                    <User className="h-4 w-4" />
                    My Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/bookings")}
                    className="cursor-pointer gap-3 rounded-lg py-2"
                >
                    <Briefcase className="h-4 w-4" />
                    My Bookings
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/job-requests")}
                    className="cursor-pointer gap-3 rounded-lg py-2"
                >
                    <Briefcase className="h-4 w-4" />
                    My Job Requests
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/notifications")}
                    className="cursor-pointer gap-3 rounded-lg py-2"
                >
                    <Bell className="h-4 w-4" />
                    Notifications
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="cursor-pointer gap-3 rounded-lg py-2"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    className="cursor-pointer gap-3 rounded-lg py-2"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    );
}
