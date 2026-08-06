"use client";

import { useAuthContext } from "@/providers/AuthProvider";

export function useAuth() {

    const {

        user,

        loading,

    } = useAuthContext();

    return {

        user,

        loading,

        isAuthenticated: !!user,

    };

}