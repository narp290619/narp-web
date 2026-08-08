"use client";

import Link from "next/link";
import { List } from "lucide-react";

export type HelpTocItem = {
    id: string;
    title: string;
};

type HelpTableOfContentsProps = {
    items: HelpTocItem[];
};

export default function HelpTableOfContents({
    items,
}: HelpTableOfContentsProps) {
    if (!items.length) {
        return null;
    }

    return (
        <aside
            className="
                hidden
                lg:block
                lg:sticky
                lg:top-28
                self-start
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >
            <div className="flex items-center gap-2">

                <List className="h-5 w-5 text-blue-600" />

                <h2 className="font-bold text-slate-900">
                    On this page
                </h2>

            </div>

            <nav className="mt-5">

                <ul className="space-y-2">

                    {items.map((item) => (

                        <li key={item.id}>

                            <Link
                                href={`#${item.id}`}
                                className="
                                    block
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    leading-6
                                    text-slate-600
                                    transition
                                    hover:bg-blue-50
                                    hover:text-blue-700
                                "
                            >
                                {item.title}
                            </Link>

                        </li>

                    ))}

                </ul>

            </nav>
        </aside>
    );
}