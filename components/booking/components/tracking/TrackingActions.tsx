"use client";

import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

import { getRoomId } from "@/lib/chat/getRoomId";

interface Props {

    freelancerId: string;

}

export default function TrackingActions({

    freelancerId,

}: Props) {

    const router = useRouter();

    const auth = getAuth();

    const currentUser = auth.currentUser;

    const openChat = () => {

        if (!currentUser) return;

        const roomId = getRoomId(

            currentUser.uid,
            freelancerId,

        );

        router.push(

            `/chat/${roomId}`,

        );

    };

    return (

        <div
            className="
                flex
                gap-4
            "
        >

            <button

                onClick={openChat}

                className="
                    flex-1
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-3
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                "

            >

                💬 Chat with Freelancer

            </button>

        </div>

    );

}