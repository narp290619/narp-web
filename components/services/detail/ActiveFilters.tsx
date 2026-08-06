interface Props {
    verifiedOnly: boolean;
    sort: string;

    maxPrice: number;

    minimumRating: number;
}

export default function ActiveFilters({
    verifiedOnly,
    sort,
    maxPrice,
    minimumRating,
}: Props) {

    return (

        <div className="mt-5 flex flex-wrap gap-3">

            {verifiedOnly && (

                <Chip text="Verified Only" />

            )}

            <Chip
                text={
                    {
                        rating: "Highest Rated",
                        price: "Lowest Price",
                        jobs: "Most Jobs",
                        reviews: "Most Reviews",
                    }[sort]
                }
            />

            {minimumRating > 0 && (

                <Chip
                    text={`${minimumRating}★ & Up`}
                />

            )}

            {maxPrice < 20000 && (

                <Chip
                    text={`Under ₱${maxPrice.toLocaleString()}`}
                />

            )}

        </div>

    );

}

function Chip({
    text,
}: {
    text?: string;
}) {

    if (!text) return null;

    return (

        <div
            className="
                rounded-full
                bg-orange-100

                px-4
                py-2

                text-sm
                font-semibold

                text-orange-700
            "
        >

            {text}

        </div>

    );

}