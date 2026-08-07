import { ReactNode } from "react";

type HelpSectionProps = {
    title: string;
    children: ReactNode;
};

export default function HelpSection({
    title,
    children,
}: HelpSectionProps) {
    return (
        <section
            className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm
            "
        >
            <h2
                className="
                    mb-6
                    text-2xl
                    font-bold
                    text-slate-900
                "
            >
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

                    [&>h3]:text-lg
                    [&>h3]:font-semibold
                    [&>h3]:text-slate-900
                    [&>h3]:mt-6

                    [&>strong]:font-semibold
                "
            >
                {children}
            </div>
        </section>
    );
}