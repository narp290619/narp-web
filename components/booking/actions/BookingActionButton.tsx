"use client";

import { useState } from "react";

interface Props {

    label: string;

    loadingLabel?: string;

    onClick: () => Promise<void>;

    className?: string;

}

export default function BookingActionButton({

    label,

    loadingLabel = "Please wait...",

    onClick,

    className = "",

}: Props) {

    const [loading, setLoading] =
        useState(false);

    async function handleClick() {

        if (loading) return;

        try {

            setLoading(true);

            await onClick();

        } finally {

            setLoading(false);

        }

    }

    return (

        <button

            onClick={handleClick}

            disabled={loading}

            className={`

                w-full
                rounded-xl
                bg-orange-500
                py-3

                font-semibold
                text-white

                transition

                hover:bg-orange-600

                disabled:opacity-50

                ${className}

            `}
        >

            {

                loading

                    ? loadingLabel

                    : label

            }

        </button>

    );

}