// "use client";

// import { useRouter } from "next/navigation";

// import { useAuthContext } from "@/providers/AuthProvider";
// import { logout } from "@/lib/services/auth/auth.service";

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
//     ChevronDown,
// } from "lucide-react";

// type UserMenuProps = {
//     variant?: "desktop" | "mobile";
// };

// export default function UserMenu({
//     variant = "desktop",
// }: UserMenuProps) {
//     const { user } = useAuthContext();
//     const router = useRouter();

//     if (!user) return null;

//     const isMobile = variant === "mobile";

//     async function handleLogout() {
//         try {
//             await logout();
//         } catch (error) {
//             console.error("Logout error:", error);
//         } finally {
//             router.replace("/");
//         }
//     }

//     const avatarInitial =
//         user.displayName?.trim().charAt(0) ||
//         user.email?.charAt(0) ||
//         "U";

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger
//                 aria-label="Open account menu"
//                 className={
//                     isMobile
//                         ? "flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
//                         : "flex h-11 w-11 items-center justify-center rounded-full border border-white bg-white text-slate-900 shadow-lg ring-1 ring-black/10 transition-all duration-200 hover:scale-105 hover:border-orange-300 hover:bg-orange-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
//                 }
//             >
//                 <Avatar className="h-9 w-9 shrink-0">
//                     <AvatarImage
//                         src={user.photoURL ?? ""}
//                         alt={user.displayName ?? "User"}
//                     />

//                     <AvatarFallback className="bg-orange-100 font-semibold text-orange-600">
//                         {avatarInitial.toUpperCase()}
//                     </AvatarFallback>
//                 </Avatar>

//                 {isMobile && (
//                     <>
//                         <div className="min-w-0 flex-1">
//                             <p className="truncate text-sm font-semibold text-slate-900">
//                                 {user.displayName || "User"}
//                             </p>

//                             <p className="truncate text-xs text-slate-500">
//                                 {user.email}
//                             </p>
//                         </div>

//                         <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
//                     </>
//                 )}
//             </DropdownMenuTrigger>

//             <DropdownMenuContent
//                 align={isMobile ? "start" : "end"}
//                 side="bottom"
//                 sideOffset={8}
//                 className={`
//                     z-[9999]
//                     rounded-xl
//                     border
//                     border-slate-200
//                     bg-white
//                     p-2
//                     text-slate-900
//                     shadow-2xl
//                     ring-1
//                     ring-black/5
//                     ${isMobile ? "w-[280px] max-w-[calc(100vw-3rem)]" : "w-64"}
//                 `}
//             >
//                 <div className="px-3 py-3">
//                     <p className="truncate font-semibold text-slate-900">
//                         {user.displayName || "User"}
//                     </p>

//                     <p className="truncate text-sm text-slate-500">
//                         {user.email}
//                     </p>
//                 </div>

//                 <DropdownMenuSeparator />

//                 <DropdownMenuItem
//                     onClick={() => router.push("/profile")}
//                     className="cursor-pointer gap-3 rounded-lg py-2"
//                 >
//                     <User className="h-4 w-4" />
//                     My Profile
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                     onClick={() => router.push("/bookings")}
//                     className="cursor-pointer gap-3 rounded-lg py-2"
//                 >
//                     <Briefcase className="h-4 w-4" />
//                     My Bookings
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                     onClick={() => router.push("/job-requests")}
//                     className="cursor-pointer gap-3 rounded-lg py-2"
//                 >
//                     <Briefcase className="h-4 w-4" />
//                     My Job Requests
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                     onClick={() => router.push("/notifications")}
//                     className="cursor-pointer gap-3 rounded-lg py-2"
//                 >
//                     <Bell className="h-4 w-4" />
//                     Notifications
//                 </DropdownMenuItem>

//                 <DropdownMenuItem
//                     onClick={() => router.push("/settings")}
//                     className="cursor-pointer gap-3 rounded-lg py-2"
//                 >
//                     <Settings className="h-4 w-4" />
//                     Settings
//                 </DropdownMenuItem>

//                 <DropdownMenuSeparator />

//                 <DropdownMenuItem
//                     variant="destructive"
//                     onClick={handleLogout}
//                     className="cursor-pointer gap-3 rounded-lg py-2"
//                 >
//                     <LogOut className="h-4 w-4" />
//                     Logout
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// }



"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/providers/AuthProvider";
import { logout } from "@/lib/services/auth/auth.service";

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

type UserMenuProps = {
    variant?: "desktop" | "mobile";
};

const menuItems = [
    {
        label: "My Profile",
        href: "/profile",
        icon: User,
    },
    {
        label: "My Bookings",
        href: "/bookings",
        icon: Briefcase,
    },
    {
        label: "My Job Requests",
        href: "/job-requests",
        icon: Briefcase,
    },
    {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export default function UserMenu({
    variant = "desktop",
}: UserMenuProps) {
    const { user } = useAuthContext();
    const router = useRouter();

    if (!user) return null;

    const isMobile = variant === "mobile";

    const avatarInitial =
        user.displayName?.trim().charAt(0) ||
        user.email?.charAt(0) ||
        "U";

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            router.replace("/");
        }
    }

    // MOBILE VERSION: Always-expanded account menu
    if (isMobile) {
        return (
            <div className="w-full">

                {/* User Information */}

                <div className="mb-5 flex items-center gap-3">
                    <Avatar className="h-11 w-11 shrink-0">
                        <AvatarImage
                            src={user.photoURL ?? ""}
                            alt={user.displayName ?? "User"}
                        />

                        <AvatarFallback className="bg-orange-100 font-semibold text-orange-600">
                            {avatarInitial.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {user.displayName || "User"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-3">

                    {/* Account Navigation */}

                    <div className="flex flex-col gap-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-lg
                                        px-3
                                        py-3
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        transition-colors
                                        hover:bg-orange-50
                                        hover:text-orange-600
                                    "
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Logout */}

                    <div className="mt-3 border-t border-slate-200 pt-3">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-3
                                text-sm
                                font-medium
                                text-red-600
                                transition-colors
                                hover:bg-red-50
                            "
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // DESKTOP VERSION: Dropdown account menu

    return (
        <DropdownMenu>
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

            <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="
                    z-[9999]
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
                "
            >
                <div className="px-3 py-3">
                    <p className="truncate font-semibold text-slate-900">
                        {user.displayName || "User"}
                    </p>

                    <p className="truncate text-sm text-slate-500">
                        {user.email}
                    </p>
                </div>

                <DropdownMenuSeparator />

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <DropdownMenuItem
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className="cursor-pointer gap-3 rounded-lg py-2"
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </DropdownMenuItem>
                    );
                })}

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