import RatingBar from "./RatingBar";

interface Props {

    rating: number;

    reviewCount: number;

    rating1?: number;

    rating2?: number;

    rating3?: number;

    rating4?: number;

    rating5?: number;

}

export default function ReviewSummaryCard({

    rating,

    reviewCount,

    rating1,

    rating2,

    rating3,

    rating4,

    rating5,

}: Props) {

    return (

        <section
            className="
                rounded-3xl
                border
                bg-white
                p-8
                shadow-sm
            "
        >

            <h2
                className="
                    text-2xl
                    font-bold
                "
            >

                Reviews

            </h2>

            <div
                className="
                    mt-8
                    flex
                    items-center
                    gap-6
                "
            >

                <div>

                    <div
                        className="
                            text-5xl
                            font-bold
                        "
                    >

                        {rating.toFixed(1)}

                    </div>

                    <div
                        className="
                            mt-2
                            text-yellow-500
                            text-xl
                        "
                    >

                        ★★★★★

                    </div>

                    <div
                        className="
                            mt-1
                            text-slate-500
                        "
                    >

                        {reviewCount} reviews

                    </div>

                </div>

                <div
                    className="
                        flex-1
                        space-y-3
                    "
                >

                    <RatingBar
                        stars={5}
                        count={rating5!}
                        total={reviewCount}
                    />

                    <RatingBar
                        stars={4}
                        count={rating4!}
                        total={reviewCount}
                    />

                    <RatingBar
                        stars={3}
                        count={rating3!}
                        total={reviewCount}
                    />

                    <RatingBar
                        stars={2}
                        count={rating2!}
                        total={reviewCount}
                    />

                    <RatingBar
                        stars={1}
                        count={rating1!}
                        total={reviewCount}
                    />

                </div>

            </div>

        </section>

    );

}