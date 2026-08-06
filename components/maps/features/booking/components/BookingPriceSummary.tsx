"use client";

interface Props {

    serviceFee: number;

    platformFee: number;

    currency?: string;

}

export default function BookingPriceSummary({

    serviceFee,

    platformFee,

    currency = "₱",

}: Props) {

    const total = serviceFee + platformFee;

    const formatCurrency = (value: number) => {

        return `${currency}${value.toLocaleString("en-PH", {

            minimumFractionDigits: 2,

            maximumFractionDigits: 2,

        })}`;

    };

    return (

        <section
            className="
                rounded-2xl
                border
                bg-white
                p-6
            "
        >

            <h2
                className="
                    text-xl
                    font-bold
                "
            >

                Price Summary

            </h2>

            <div
                className="
                    mt-6
                    space-y-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >

                    <span className="text-slate-600">

                        Service Fee

                    </span>

                    <span className="font-medium">

                        {formatCurrency(serviceFee)}

                    </span>

                </div>

                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >

                    <span className="text-slate-600">

                        Platform Fee

                    </span>

                    <span className="font-medium">

                        {formatCurrency(platformFee)}

                    </span>

                </div>

                <div className="border-t pt-4">

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            text-lg
                            font-bold
                        "
                    >

                        <span>Total</span>

                        <span className="text-orange-600">

                            {formatCurrency(total)}

                        </span>

                    </div>

                </div>

            </div>

        </section>

    );

}