import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { helpArticles } from "@/lib/helpArticles";

type ArticleNavigationProps = {
    currentArticle: string;
};

export default function ArticleNavigation({
    currentArticle,
}: ArticleNavigationProps) {
    const currentIndex = helpArticles.findIndex(
        (article) => article.href === currentArticle
    );

    if (currentIndex === -1) return null;

    const previous =
        currentIndex > 0
            ? helpArticles[currentIndex - 1]
            : null;

    const next =
        currentIndex < helpArticles.length - 1
            ? helpArticles[currentIndex + 1]
            : null;

    return (
        <section className="mt-12 grid gap-4 md:grid-cols-2">
            {previous ? (
                <Link
                    href={previous.href}
                    className="
                        group
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                        transition
                        hover:border-blue-500
                        hover:bg-blue-50
                    "
                >
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <ArrowLeft className="h-4 w-4" />
                        Previous Article
                    </div>

                    <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-blue-700">
                        {previous.title}
                    </h3>
                </Link>
            ) : (
                <div />
            )}

            {next ? (
                <Link
                    href={next.href}
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
                        hover:border-blue-500
                        hover:bg-blue-50
                    "
                >
                    <div className="flex items-center justify-end gap-3 text-sm text-slate-500">
                        Next Article
                        <ArrowRight className="h-4 w-4" />
                    </div>

                    <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-blue-700">
                        {next.title}
                    </h3>
                </Link>
            ) : (
                <div />
            )}
        </section>
    );
}