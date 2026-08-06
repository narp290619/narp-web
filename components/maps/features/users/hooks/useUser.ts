"use client";

import {

    useEffect,

    useState,

} from "react";

import { User } from "@/lib/models/user";

import {

    getUser,

} from "../repositories/user.repository";

export function useUser(

    userId: string,

) {

    const [

        user,

        setUser,

    ] = useState<User | null>(null);

    const [

        loading,

        setLoading,

    ] = useState(true);

    useEffect(() => {

        async function load() {

            try {

                const result =

                    await getUser(userId);

                setUser(result);

            }

            finally {

                setLoading(false);

            }

        }

        if (userId) {

            load();

        }

    }, [userId]);

    return {

        user,

        loading,

    };

}