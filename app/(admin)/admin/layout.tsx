"use client";

import type { ReactNode } from "react";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import {
    onAuthStateChanged,
} from "firebase/auth";

import {
    db,
    auth,
} from "@/lib/firebase";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {

    const router =
        useRouter();

    const [
        sidebarOpen,
        setSidebarOpen,
    ] = useState(false);

    const [
        checkingAdmin,
        setCheckingAdmin,
    ] = useState(true);

    const [
        isAdmin,
        setIsAdmin,
    ] = useState(false);

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (currentUser) => {

                    /*
                     * =====================================================
                     * USER NOT LOGGED IN
                     * =====================================================
                     */

                    if (!currentUser) {

                        setIsAdmin(false);

                        setCheckingAdmin(false);

                        router.replace("/");

                        return;
                    }

                    try {

                        /*
                         * =================================================
                         * LOAD USER DOCUMENT
                         * =================================================
                         */

                        const userRef =
                            doc(
                                db,
                                "Users",
                                currentUser.uid
                            );

                        const userSnapshot =
                            await getDoc(
                                userRef
                            );

                        /*
                         * =================================================
                         * USER DOCUMENT DOES NOT EXIST
                         * =================================================
                         */

                        if (
                            !userSnapshot.exists()
                        ) {

                            setIsAdmin(false);

                            setCheckingAdmin(false);

                            router.replace("/");

                            return;
                        }

                        const userData =
                            userSnapshot.data();

                        /*
                         * =================================================
                         * CHECK ADMIN FLAG
                         * =================================================
                         */

                        const admin =
                            userData.isAdmin === true;

                        setIsAdmin(admin);

                        /*
                         * =================================================
                         * NOT AN ADMIN
                         * =================================================
                         */

                        if (!admin) {

                            setCheckingAdmin(false);

                            router.replace("/");

                            return;
                        }

                        /*
                         * =================================================
                         * ADMIN
                         * =================================================
                         */

                        setCheckingAdmin(false);

                    } catch (error) {

                        console.error(
                            "Failed to verify admin access:",
                            error
                        );

                        setIsAdmin(false);

                        setCheckingAdmin(false);

                        router.replace("/");
                    }
                }
            );

        return () => {
            unsubscribe();
        };

    }, [
        router,
    ]);

    /*
     * =====================================================
     * CHECKING ADMIN ACCESS
     * =====================================================
     */

    if (checkingAdmin) {

        return (
            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50
                    pt-28
                "
            >

                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-blue-600
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            font-medium
                            text-slate-500
                        "
                    >
                        Checking administrator access...
                    </p>

                </div>

            </main>
        );
    }

    /*
     * =====================================================
     * NOT ADMIN
     * =====================================================
     *
     * The redirect is already being performed above.
     * Do not render the admin interface while redirecting.
     */

    if (!isAdmin) {
        return null;
    }

    /*
     * =====================================================
     * ADMIN LAYOUT
     * =====================================================
     */

    return (
        <main
            className="
                min-h-screen
                pt-28
            "
        >

            {/* =====================================================
                MOBILE ADMIN HEADER
            ====================================================== */}

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
                    onClick={() =>
                        setSidebarOpen(true)
                    }
                    className="
                        rounded-lg
                        p-2
                        text-slate-600
                        transition
                        hover:bg-slate-100
                    "
                    aria-label="Open admin menu"
                >

                    <Menu
                        className="h-5 w-5"
                    />

                </button>

                <span
                    className="
                        ml-3
                        text-sm
                        font-semibold
                        text-slate-900
                    "
                >
                    NARP Administration
                </span>

            </div>

            {/* =====================================================
                ADMIN SIDEBAR
            ====================================================== */}

            <AdminSidebar
                mobileOpen={
                    sidebarOpen
                }
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div
                className="
                    lg:pl-72
                "
            >
                {children}
            </div>

        </main>
    );
}