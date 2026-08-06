"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

interface Props {
    children: React.ReactNode;
}

export default function BookingAuthGuard({
    children,
}: Props) {

    const router = useRouter();

    const {
        user,
        loading,
    } = useAuth();

    useEffect(() => {

        if (loading) {

            return;

        }

        if (!user) {

            router.replace("/login");

        }

    }, [

        loading,
        user,
        router,

    ]);

    if (loading) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    bg-white
                    p-8
                    text-center
                "
            >

                Checking authentication...

            </div>

        );

    }

    if (!user) {

        return null;

    }

    return <>{children}</>;

}