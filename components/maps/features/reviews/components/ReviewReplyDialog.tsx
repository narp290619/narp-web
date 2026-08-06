"use client";

import { useState } from "react";

import { replyToReview } from "../repositories/review-reply.repository";

interface Props {

    open: boolean;

    reviewId: string;

    onClose: () => void;

    onSuccess?: () => void;

}

export default function ReviewReplyDialog({

    open,

    reviewId,

    onClose,

    onSuccess,

}: Props) {

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    if (!open) {

        return null;

    }

    async function submit() {

        if (!message.trim()) {

            return;

        }

        try {

            setLoading(true);

            await replyToReview(

                reviewId,

                message,

            );

            onSuccess?.();

            onClose();

        } finally {

            setLoading(false);

        }

    }

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
            "
        >

            <div
                className="
                    w-full
                    max-w-lg
                    rounded-3xl
                    bg-white
                    p-8
                "
            >

                <h2 className="text-2xl font-bold">

                    Reply to Review

                </h2>

                <textarea

                    className="
                        mt-6
                        h-40
                        w-full
                        rounded-xl
                        border
                        p-4
                    "

                    value={message}

                    onChange={(e) =>

                        setMessage(e.target.value)

                    }

                    placeholder="Write your reply..."

                />

                <div
                    className="
                        mt-6
                        flex
                        justify-end
                        gap-4
                    "
                >

                    <button

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="
                            rounded-xl
                            bg-orange-500
                            px-6
                            py-3
                            text-white
                        "

                        disabled={loading}

                        onClick={submit}

                    >

                        {

                            loading

                                ? "Sending..."

                                : "Send Reply"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}