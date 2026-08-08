"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    UserCheck,
    CalendarCheck,
    CreditCard,
    ArrowUpRight,
    ShieldCheck,
    AlertTriangle,
    Settings,
    X,
} from "lucide-react";

type AdminSidebarProps = {
    mobileOpen?: boolean;
    onClose?: () => void;
};

const navigation = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        label: "Freelancers",
        href: "/admin/freelancers",
        icon: UserCheck,
    },
    {
        label: "Bookings",
        href: "/admin/bookings",
        icon: CalendarCheck,
    },
    {
        label: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
    },
    {
        label: "Withdrawals",
        href: "/admin/withdrawals",
        icon: ArrowUpRight,
    },
    {
        label: "Verification",
        href: "/admin/verification",
        icon: ShieldCheck,
    },
    {
        label: "Reports",
        href: "/admin/reports",
        icon: AlertTriangle,
    },
];

const secondaryNavigation = [
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function AdminSidebar({
    mobileOpen = false,
    onClose,
}: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close admin menu"
                    onClick={onClose}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/40
                        lg:hidden
                    "
                />
            )}

            {/* Sidebar */}

            <aside
                className={`
                    fixed
                    left-0
                    top-28
                    z-50
                    flex
                    h-[calc(100vh-5rem)]
                    w-72
                    flex-col
                    border-r
                    border-slate-200
                    bg-white
                    transition-transform
                    duration-300
                    lg:translate-x-0
                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                            NARP
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-slate-900">
                            Administration
                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                            lg:hidden
                        "
                        aria-label="Close admin menu"
                    >
                        <X className="h-5 w-5" />
                    </button>

                </div>

                {/* Navigation */}

                <nav className="flex-1 overflow-y-auto px-4 py-6">

                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Management
                    </p>

                    <div className="mt-3 space-y-1">

                        {navigation.map((item) => {
                            const Icon = item.icon;

                            const isActive =
                                item.href === "/admin"
                                    ? pathname === "/admin"
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-3
                                        py-3
                                        text-sm
                                        font-medium
                                        transition
                                        ${
                                            isActive
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }
                                    `}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />

                                    <span>
                                        {item.label}
                                    </span>

                                </Link>
                            );
                        })}

                    </div>

                    <p className="mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        System
                    </p>

                    <div className="mt-3 space-y-1">

                        {secondaryNavigation.map((item) => {
                            const Icon = item.icon;

                            const isActive =
                                pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-3
                                        py-3
                                        text-sm
                                        font-medium
                                        transition
                                        ${
                                            isActive
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }
                                    `}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />

                                    <span>
                                        {item.label}
                                    </span>

                                </Link>
                            );
                        })}

                    </div>

                </nav>

                {/* Footer */}

                <div className="border-t border-slate-200 p-4">

                    <div className="rounded-xl bg-slate-50 px-4 py-3">

                        <p className="text-xs font-medium text-slate-400">
                            Admin Panel
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                            NARP Platform
                        </p>

                    </div>

                </div>

            </aside>
        </>
    );
}