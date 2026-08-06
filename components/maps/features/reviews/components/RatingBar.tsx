interface Props {

    stars: number;

    count: number;

    total: number;

}

export default function RatingBar({

    stars,

    count,

    total,

}: Props) {

    const percentage =

        total === 0

            ? 0

            : (count / total) * 100;

    return (

        <div
            className="
                flex
                items-center
                gap-3
            "
        >

            <div
                className="
                    w-12
                    text-sm
                    font-medium
                "
            >

                {stars}★

            </div>

            <div
                className="
                    h-3
                    flex-1
                    overflow-hidden
                    rounded-full
                    bg-slate-200
                "
            >

                <div
                    className="
                        h-full
                        bg-orange-500
                    "
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

            <div
                className="
                    w-10
                    text-right
                    text-sm
                    text-slate-500
                "
            >

                {count}

            </div>

        </div>

    );

}