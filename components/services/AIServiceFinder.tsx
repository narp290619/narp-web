"use client";

import { useState } from "react";
import { mockSuggestions } from "./mockSuggestions";
import AISuggestionCard from "./AISuggestionCard";
import AIInput from "./AIInput";





export default function AIServiceFinder() {

    const [text, setText] = useState("");

    const suggestion = mockSuggestions.find((item) =>
        item.keywords.some((k) =>
            text.toLowerCase().includes(k)
        )
    );

    return (
        <section className="mb-24">

            <div className="rounded-[40px] bg-gradient-to-r from-orange-500 to-amber-400 p-10 text-white">

                <h2 className="text-4xl font-bold">

                    🤖 AI Service Finder

                </h2>

                <p className="mt-3 max-w-2xl text-lg text-orange-100">

                    Describe your problem in your own words.
                    NARP AI will recommend the right professional.

                </p>

                <div className="mt-8">

                    <AIInput
                        value={text}
                        onChange={setText}
                    />

                </div>

            </div>

            {suggestion && (

                <div className="mt-8">

                    <AISuggestionCard
                        skill={suggestion.recommendations[0].skill}
                        match={suggestion.recommendations[0].match}
                    />

                </div>

            )}

        </section>
    );
}