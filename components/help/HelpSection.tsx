import { ReactNode } from "react";

type HelpSectionProps = {
    id?: string;
    title: string;
    children: ReactNode;
};

export default function HelpSection({
    id,
    title,
    children,
}: HelpSectionProps) {
    return (
        <section
            id={id}
            className="
                scroll-mt-32
                rounded-3xl
                bg-white
                p-8
                shadow-sm
            "
        >
            <h2 className="mb-5 text-2xl font-bold text-green-700">
                {title}
            </h2>

            <div
                className="
                    space-y-5
                    leading-8
                    text-slate-700

                    [&>ul]:list-disc
                    [&>ul]:space-y-2
                    [&>ul]:pl-6

                    [&>ol]:list-decimal
                    [&>ol]:space-y-2
                    [&>ol]:pl-6

                    [&>h3]:mt-6
                    [&>h3]:text-lg
                    [&>h3]:font-semibold
                    [&>h3]:text-slate-900

                    [&>strong]:font-semibold
                "
            >
                {children}
            </div>
        </section>
    );
}