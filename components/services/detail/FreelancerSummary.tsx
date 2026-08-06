interface Props {
    total: number;
    verified: number;
    averageRating: number;
}

export default function FreelancerSummary({
    total,
    verified,
    averageRating,
}: Props) {

    return (

        <div
            className="
                mt-8

                grid
                gap-5

                md:grid-cols-3
            "
        >

            <SummaryCard
                value={total.toString()}
                label="Available Freelancers"
            />

            <SummaryCard
                value={verified.toString()}
                label="Verified Freelancers"
            />

            <SummaryCard
                value={
                    averageRating > 0
                        ? averageRating.toFixed(1)
                        : "New"
                }
                label="Average Rating"
            />

        </div>

    );

}

function SummaryCard({
    value,
    label,
}: {
    value: string;
    label: string;
}) {

    return (

        <div
            className="
                rounded-3xl
                border

                bg-white

                p-6

                text-center

                shadow-sm
            "
        >

            <div
                className="
                    text-4xl
                    font-black
                    text-orange-500
                "
            >

                {value}

            </div>

            <div className="mt-2 text-slate-500">

                {label}

            </div>

        </div>

    );

}