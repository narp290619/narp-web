import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
};

export default function LegalSection({
    title,
    children,
}: Props) {

    return (

        <section className="rounded-3xl bg-white p-8 shadow-lg">

            <h2 className="mb-5 text-2xl font-bold text-green-700">

                {title}

            </h2>

            <div className="space-y-4 text-gray-700 leading-8">

                {children}

            </div>

        </section>

    );

}