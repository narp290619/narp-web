"use client";

import { useState } from "react";

import {
    collection,
    doc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { db } from "@/lib/firebase";

import { useParams } from "next/navigation";

import useChatMessages
    from "@/hooks/useChatMessages";

export default function ChatPage() {

    const params = useParams();

    const roomId =
        params.roomId as string;

    const messages =
        useChatMessages(roomId);

    const auth = getAuth();

    const [text, setText] = useState("");

    async function sendMessage() {

        if (!text.trim()) return;

        const user = auth.currentUser;

        if (!user) return;

        // Match Flutter's message ID format:
        // userUid_uuid
        const messageId =
            `${user.uid}_${crypto.randomUUID()}`;

        const now =
            serverTimestamp();

        const message = {

            id: messageId,

            senderId: user.uid,

            receiverId: "",

            senderName:
                user.displayName ??
                "Web User",

            message: text,

            imageUrl: "",

            audioUrl: "",

            readStatus: "sent",

            timestamp: now,

        };

        //
        // 1. Create the message
        //

        await setDoc(

            doc(
                db,
                "chat_rooms",
                roomId,
                "messages",
                messageId,
            ),

            message,

        );

        //
        // 2. Update chat room
        //

        await setDoc(

            doc(
                db,
                "chat_rooms",
                roomId,
            ),

            {

                lastMessage: text,

                lastMessageImageUrl: "",

                lastMessageSenderId:
                    user.uid,

                lastMessageSenderName:
                    user.displayName ??
                    "Web User",

                lastMessageTimestamp:
                    now,

            },

            {

                merge: true,

            },

        );

        setText("");

    }

    return (

        <div className="pt-30 p-8">

            <h1 className="text-3xl font-bold">

                Chat

            </h1>

            <p className="mb-6">

                Room ID:

                {roomId}

            </p>

            <div className="space-y-3">

                {messages.length === 0 && (

                    <p className="text-gray-500">

                        No messages yet.

                    </p>

                )}

                {messages.map((message) => (

                    <div
                        key={message.id}
                        className="
                            rounded-lg
                            border
                            p-3
                        "
                    >

                        <div className="text-xs text-gray-500">

                            {message.senderName}

                        </div>

                        <div>

                            {message.message}

                        </div>

                    </div>

                ))}

            </div>

            <div className="mt-8 flex gap-3">

                <input

                    value={text}

                    onChange={(e) =>
                        setText(e.target.value)
                    }

                    placeholder="Type a message..."

                    className="
                        flex-1
                        rounded-lg
                        border
                        px-4
                        py-3
                    "

                />

                <button

                    onClick={sendMessage}

                    className="
                        rounded-lg
                        bg-blue-600
                        px-6
                        py-3
                        text-white
                    "

                >

                    Send

                </button>

            </div>

        </div>

    );

}