"use client";

import { Sparkles } from "lucide-react";

interface Props {
    skill: string;
    match: number;
}

export default function AISuggestionCard({
    skill,
    match,
}: Props) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-orange-200
                bg-orange-50
                p-5
            "
        >
            <div className="flex items-center gap-3">

                <Sparkles className="text-orange-500" />

                <div>

                    <h3 className="font-bold">

                        {skill}

                    </h3>

                    <p className="text-sm text-slate-600">

                        {match}% AI Match

                    </p>

                </div>

            </div>
        </div>
    );
}