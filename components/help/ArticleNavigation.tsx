"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type ArticleNavigationProps = {
    currentArticle: string;
};

const articles = [
    {
        slug: "bookings",
        title: "Bookings",
    },
    {
        slug: "payments",
        title: "Payments",
    },
    {
        slug: "account",
        title: "Account",
    },
    {
        slug: "safety",
        title: "Safety",
    },
    {
        slug: "reviews",
        title: "Reviews",
    },
    {
        slug: "mobile-app",
        title: "Mobile App",
    },
];

export default function ArticleNavigation({
    currentArticle,
}: ArticleNavigationProps) {
    const currentIndex = articles.findIndex(
        (article) => article.slug === currentArticle
    );

    if (currentIndex === -1) {
        return null;
    }

    const previousArticle =
        currentIndex > 0
            ? articles[currentIndex - 1]
            : null;

    const nextArticle =
        currentIndex < articles.length - 1
            ? articles[currentIndex + 1]
            : null;

    return (
        <nav
            className="
                grid
                gap-4
                sm:grid-cols-2
            "
            aria-label="Article navigation"
        >

            {/* Previous */}

            {previousArticle ? (
                <Link
                    href={`/help/${previousArticle.slug}`}
                    className="
                        group
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                        transition
                        hover:-translate-y-0.5
                        hover:border-blue-200
                        hover:shadow-md
                    "
                >
                    <div className="flex items-center gap-3">

                        <ArrowLeft
                            className="
                                h-5
                                w-5
                                text-slate-400
                                transition
                                group-hover:-translate-x-1
                                group-hover:text-blue-600
                            "
                        />

                        <span
                            className="
                                text-sm
                                font-medium
                                text-slate-500
                            "
                        >
                            Previous Article
                        </span>

                    </div>

                    <p
                        className="
                            mt-3
                            text-lg
                            font-bold
                            text-slate-900
                            transition
                            group-hover:text-blue-700
                        "
                    >
                        {previousArticle.title}
                    </p>

                </Link>
            ) : (
                <div />
            )}

            {/* Next */}

            {nextArticle ? (
                <Link
                    href={`/help/${nextArticle.slug}`}
                    className="
                        group
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        text-right
                        shadow-sm
                        transition
                        hover:-translate-y-0.5
                        hover:border-blue-200
                        hover:shadow-md
                    "
                >
                    <div className="flex items-center justify-end gap-3">

                        <span
                            className="
                                text-sm
                                font-medium
                                text-slate-500
                            "
                        >
                            Next Article
                        </span>

                        <ArrowRight
                            className="
                                h-5
                                w-5
                                text-slate-400
                                transition
                                group-hover:translate-x-1
                                group-hover:text-blue-600
                            "
                        />

                    </div>

                    <p
                        className="
                            mt-3
                            text-lg
                            font-bold
                            text-slate-900
                            transition
                            group-hover:text-blue-700
                        "
                    >
                        {nextArticle.title}
                    </p>

                </Link>
            ) : (
                <div />
            )}

        </nav>
    );
}