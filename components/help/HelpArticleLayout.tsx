// import type { ReactNode } from "react";
// import Link from "next/link";
// import { ChevronRight, HelpCircle } from "lucide-react";

// import ContactSupportCard from "./ContactSupportCard";
// import RelatedArticles from "./RelatedArticles";
// import ArticleNavigation from "./ArticleNavigation";

// type HelpArticleLayoutProps = {
//     title: string;
//     description: string;
//     lastUpdated?: string;
//     currentArticle: string;
//     children: ReactNode;
// };

// export default function HelpArticleLayout({
//     title,
//     description,
//     lastUpdated = "August 7, 2026",
//     currentArticle,
//     children,
// }: HelpArticleLayoutProps) {
//     return (
//         <main className="min-h-screen bg-gray-50">

//             {/* Hero */}

//             <section className="py-16">

//                 <div className="pt-24 mx-auto max-w-5xl px-6">

//                     <div
//                         className="
//                             overflow-hidden
//                             rounded-3xl
//                             bg-gradient-to-br
//                             from-blue-700
//                             via-blue-600
//                             to-sky-500
//                             px-8
//                             py-10
//                             text-white
//                             shadow-xl
//                             lg:px-16
//                         "
//                     >

//                         {/* Breadcrumb */}

//                         <nav className="mb-8 flex items-center gap-2 text-sm text-blue-100">

//                             <Link
//                                 href="/"
//                                 className="transition hover:text-white"
//                             >
//                                 Home
//                             </Link>

//                             <ChevronRight className="h-4 w-4" />

//                             <Link
//                                 href="/help"
//                                 className="transition hover:text-white"
//                             >
//                                 Help Center
//                             </Link>

//                             <ChevronRight className="h-4 w-4" />

//                             <span className="text-white">
//                                 {title}
//                             </span>

//                         </nav>

//                         <div className="flex justify-center">

//                             <div
//                                 className="
//                         flex
//                         h-20
//                         w-20
//                         items-center
//                         justify-center
//                         rounded-full
//                         bg-white/15
//                         backdrop-blur
//                     "
//                             >
//                                 <HelpCircle className="h-10 w-10" />
//                             </div>

//                         </div>

//                         <h1 className="mt-8 text-center text-5xl font-extrabold">

//                             {title}

//                         </h1>

//                         <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-blue-100">

//                             {description}

//                         </p>

//                         <div className="mt-8 flex justify-center">

//                             <span
//                                 className="
//                         rounded-full
//                         bg-white/15
//                         px-5
//                         py-2
//                         text-sm
//                         font-semibold
//                     "
//                             >
//                                 Last Updated: {lastUpdated}
//                             </span>

//                         </div>

//                     </div>

//                 </div>

//             </section>

//             {/* Article */}

//             <section className="mx-auto max-w-5xl px-6 py-16">

//                 <article className="space-y-8">

//                     {children}

//                 </article>

//                 <div className="mt-16">

//                     <RelatedArticles
//                         currentArticle={currentArticle}
//                     />

//                 </div>

//                 <div className="mt-12">

//                     <ArticleNavigation
//                         currentArticle={currentArticle}
//                     />

//                 </div>

//             </section>

//             {/* Contact Support */}

//             <section className="mx-auto max-w-6xl px-6 pb-20">

//                 <ContactSupportCard />

//             </section>

//         </main>
//     );
// }


import Link from "next/link";
import { ChevronRight, HelpCircle } from "lucide-react";

import ContactSupportCard from "./ContactSupportCard";
import RelatedArticles from "./RelatedArticles";
import ArticleNavigation from "./ArticleNavigation";
import HelpTableOfContents, {
    HelpTocItem,
} from "./HelpTableOfContents";

type HelpArticleLayoutProps = {
    title: string;
    description: string;
    lastUpdated?: string;
    children: React.ReactNode;
    currentArticle: string;
    tocItems?: HelpTocItem[];
};

export default function HelpArticleLayout({
    title,
    description,
    lastUpdated = "August 8, 2026",
    children,
    currentArticle,
    tocItems = [],
}: HelpArticleLayoutProps) {
    return (
        <main>

            {/* Hero */}

            <section className="py-16">

                <div className="pt-24 mx-auto max-w-5xl px-6">

                    <div
                        className="
                            overflow-hidden
                            rounded-3xl
                            bg-gradient-to-br
                            from-blue-700
                            via-blue-600
                            to-sky-500
                            px-8
                            py-8
                            text-white
                            shadow-xl
                            lg:px-8
                            lg:py-10
                        "
                    >

                        {/* Breadcrumb */}

                        <nav
                            className="
                                mb-8
                                flex
                                flex-wrap
                                items-center
                                gap-2
                                text-sm
                                text-blue-100
                            "
                        >

                            <Link
                                href="/"
                                className="transition hover:text-white"
                            >
                                Home
                            </Link>

                            <ChevronRight className="h-4 w-4" />

                            <Link
                                href="/help"
                                className="transition hover:text-white"
                            >
                                Help Center
                            </Link>

                            <ChevronRight className="h-4 w-4" />

                            <span className="text-white">
                                {title}
                            </span>

                        </nav>

                        {/* Icon */}

                        <div className="flex justify-center">

                            <div
                                className="
                                    flex
                                    h-20
                                    w-20
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white/15
                                    backdrop-blur
                                "
                            >
                                <HelpCircle className="h-10 w-10" />
                            </div>

                        </div>

                        {/* Title */}

                        <h1
                            className="
                                mt-8
                                text-center
                                text-4xl
                                font-extrabold
                                tracking-tight
                                sm:text-5xl
                            "
                        >
                            {title}
                        </h1>

                        {/* Description */}

                        <p
                            className="
                                mx-auto
                                mt-6
                                max-w-3xl
                                text-center
                                text-lg
                                leading-8
                                text-blue-100
                            "
                        >
                            {description}
                        </p>

                        {/* Last Updated */}

                        <div className="mt-8 flex justify-center">

                            <span
                                className="
                                    rounded-full
                                    bg-white/15
                                    px-5
                                    py-2
                                    text-sm
                                    font-semibold
                                    backdrop-blur
                                "
                            >
                                Last Updated: {lastUpdated}
                            </span>

                        </div>

                    </div>

                </div>

            </section>

            {/* Article */}

            <section className="mx-auto max-w-5xl px-6 pb-20">

                <div
                    className="
                        grid
                        gap-10
                        lg:grid-cols-[1fr_240px]
                        lg:items-start
                    "
                >

                    {/* Main Article */}

                    <article
                        className="
                            min-w-0
                            rounded-3xl
                            bg-white
                            p-8
                            shadow-sm
                            lg:p-10
                        "
                    >
                        {children}
                    </article>

                    {/* Table of Contents */}

                    {tocItems.length > 0 && (
                        <HelpTableOfContents
                            items={tocItems}
                        />
                    )}

                </div>

                {/* Related Articles */}

                <div className="mt-12">

                    <RelatedArticles
                        currentArticle={currentArticle}
                    />

                </div>

                {/* Previous / Next */}

                <div className="mt-8">

                    <ArticleNavigation
                        currentArticle={currentArticle}
                    />

                </div>

                {/* Support */}

                <div className="mt-12">

                    <ContactSupportCard />

                </div>

            </section>

        </main>
    );
}