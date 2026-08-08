"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { useState } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <main className="min-h-screen pt-28">

            {/* Mobile Admin Header */}

            <div
                className="
                    sticky
                    top-28
                    z-30
                    flex
                    h-14
                    items-center
                    border-b
                    border-slate-200
                    bg-white
                    px-4
                    lg:hidden
                "
            >
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="
                        rounded-lg
                        p-2
                        text-slate-600
                        transition
                        hover:bg-slate-100
                    "
                    aria-label="Open admin menu"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <span className="ml-3 text-sm font-semibold text-slate-900">
                    NARP Administration
                </span>
            </div>

            {/* Sidebar */}

            <AdminSidebar
                mobileOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}

            <div className="lg:pl-72">
                {children}
            </div>

        </main>
    );
}