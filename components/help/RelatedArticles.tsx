import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
    helpArticles,
    relatedHelpArticles,
} from "@/lib/helpArticles";

type RelatedArticlesProps = {
    currentArticle: string;
};

export default function RelatedArticles({
    currentArticle,
}: RelatedArticlesProps) {
    const related =
        relatedHelpArticles[currentArticle] ??
        helpArticles
            .filter((article) => article.href !== currentArticle)
            .map((article) => article.href);

    if (related.length === 0) return null;

    return (
        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
                Related Articles
            </h2>

            <p className="mt-2 text-slate-600">
                You may also find these help articles useful.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {related.map((href) => {
                    const article = helpArticles.find(
                        (item) => item.href === href
                    );

                    if (!article) return null;

                    return (
                        <Link
                            key={article.href}
                            href={article.href}
                            className="
                                group
                                rounded-2xl
                                border
                                border-slate-200
                                p-5
                                transition
                                hover:border-blue-500
                                hover:bg-blue-50
                            "
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {article.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600">
                                        {article.description}
                                    </p>
                                </div>

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
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}