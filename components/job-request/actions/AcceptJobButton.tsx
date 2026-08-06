"use client";

import { useState } from "react";

interface AcceptJobButtonProps {
    requestId: string;
    onAccept: () => Promise<void>;
}

export default function AcceptJobButton({
    requestId,
    onAccept,
}: AcceptJobButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (loading) return;

        try {
            setLoading(true);
            await onAccept();
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
        >
            {loading ? "Accepting..." : "Accept Job"}
        </button>
    );
}