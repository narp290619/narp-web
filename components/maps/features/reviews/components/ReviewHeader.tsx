"use client";

interface Props {

    clientName: string;

    clientProfileImageUrl?: string;

    clientVerified?: boolean;

    rating: number;

    createdAt?: Date | null;

}

export default function ReviewHeader({

    clientName,

    clientProfileImageUrl,

    clientVerified,

    rating,

    createdAt,

}: Props) {

    return (

        <div
            className="
                flex
                items-start
                justify-between
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >

                <div
                    className="
                        h-12
                        w-12
                        overflow-hidden
                        rounded-full
                        bg-slate-200
                    "
                >

                    {

                        clientProfileImageUrl ? (

                            <img
                                src={clientProfileImageUrl}
                                alt={clientName}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />

                        ) : (

                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                    font-semibold
                                    text-slate-600
                                "
                            >

                                {clientName.charAt(0).toUpperCase()}

                            </div>

                        )

                    }

                </div>

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <h3
                            className="
                                text-lg
                                font-semibold
                            "
                        >

                            {clientName}

                        </h3>

                        {

                            clientVerified && (

                                <span
                                    className="
                                        rounded-full
                                        bg-blue-100
                                        px-2
                                        py-0.5
                                        text-xs
                                        text-blue-600
                                    "
                                >

                                    ✓ Verified

                                </span>

                            )

                        }

                    </div>

                    <p className="text-yellow-500">

                        {"★".repeat(rating)}

                        {"☆".repeat(5 - rating)}

                    </p>

                </div>

            </div>

            {

                createdAt && (

                    <span
                        className="
                            text-sm
                            text-slate-500
                        "
                    >

                        {createdAt.toLocaleDateString()}

                    </span>

                )

            }

        </div>

    );

}