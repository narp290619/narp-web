"use client";

import {

    useEffect,

    useState,

} from "react";

import {

    AppUser,

} from "@/lib/firebase/users.service";

import {

    getUser,

} from "@/repositories/user.repository";

export function useUserById(

    userId: string,

) {

    const [

        user,

        setUser,

    ] = useState<AppUser | null>(null);

    const [

        loading,

        setLoading,

    ] = useState(true);

    useEffect(() => {

        async function load() {

            if (!userId) {

                setLoading(false);

                return;

            }

            try {

                const data = await getUser(

                    userId,

                );

                setUser(data);

            }

            finally {

                setLoading(false);

            }

        }

        load();

    }, [

        userId,

    ]);

    return {

        user,

        loading,

    };

}