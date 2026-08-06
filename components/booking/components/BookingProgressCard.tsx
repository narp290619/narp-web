"use client";

interface Props {
    title: string;
    description: string;
}

export default function BookingProgressCard({
    title,
    description,
}: Props) {

    return (

        <section
            className="
                rounded-2xl
                border
                bg-orange-50
                border-orange-200
                p-6
            "
        >

            <h2 className="text-xl font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-slate-600">
                {description}
            </p>

        </section>

    );

}