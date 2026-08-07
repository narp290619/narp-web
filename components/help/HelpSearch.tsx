"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { helpArticles } from "@/lib/helpArticles";

export default function HelpSearch() {
    const [query, setQuery] = useState("");

    const results = useMemo(() => {
        if (!query.trim()) return helpArticles;

        const search = query.toLowerCase();

        return helpArticles.filter((article) =>
            article.title.toLowerCase().includes(search) ||
            article.description.toLowerCase().includes(search)
        );
    }, [query]);

    return (
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-slate-500" />

                <h2 className="text-xl font-bold text-slate-900">
                    Search Help
                </h2>
            </div>

            <p className="mt-2 text-slate-600">
                Search our help articles to quickly find answers.
            </p>

            <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                    type="text"
                    placeholder="Search help articles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        py-3
                        pl-12
                        pr-4
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-100
                    "
                />
            </div>

            <div className="mt-6 space-y-3">
                {results.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-4 text-slate-500">
                        No help articles found.
                    </div>
                ) : (
                    results.map((article) => (
                        <Link
                            key={article.href}
                            href={article.href}
                            className="
                                block
                                rounded-xl
                                border
                                border-slate-200
                                p-4
                                transition
                                hover:border-blue-500
                                hover:bg-blue-50
                            "
                        >
                            <h3 className="font-semibold text-slate-900">
                                {article.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-600">
                                {article.description}
                            </p>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}