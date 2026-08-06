"use client";

import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { ChatMessage } from "@/lib/models/chat/chat-message";

export default function useChatMessages(
    roomId: string,
) {

    const [
        messages,
        setMessages,
    ] = useState<ChatMessage[]>([]);

    useEffect(() => {

        if (!roomId) return;

        const q = query(

            collection(
                db,
                "chat_rooms",
                roomId,
                "messages",
            ),

            orderBy(
                "timestamp",
                "desc",
            ),

        );

        const unsubscribe = onSnapshot(

            q,

            (snapshot) => {

                const data = snapshot.docs.map(
                    (doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }),
                ) as ChatMessage[];

                setMessages(data);

            },

            (error) => {
                console.error(
                    "Failed to load chat messages:",
                    error,
                );
            },

        );

        return unsubscribe;

    }, [roomId]);

    return messages;

}