"use client";

import { useState } from "react";

interface Props {
    onPay(): Promise<void>;
}

export default function PayNowButton({
    onPay,
}: Props) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (loading) return;

        try {
            setLoading(true);
            await onPay();
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
            {loading
                ? "Processing..."
                : "Pay Now"}
        </button>
    );
}