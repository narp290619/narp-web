import Link from "next/link";
import { ChevronRight } from "lucide-react";

type HelpBreadcrumbsProps = {
    title: string;
};

export default function HelpBreadcrumbs({
    title,
}: HelpBreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
            <Link
                href="/"
                className="transition hover:text-blue-600"
            >
                Home
            </Link>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <Link
                href="/help"
                className="transition hover:text-blue-600"
            >
                Help Center
            </Link>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <span className="font-medium text-slate-900">
                {title}
            </span>
        </nav>
    );
}