"use client";

import { useRouter } from "next/navigation";

interface Props {

    bookingId: string;

}

export default function PaymentCancelledClient({

    bookingId,

}: Props) {

    const router = useRouter();

    return (

        <div
            className="
                mx-auto
                max-w-xl
                rounded-3xl
                border
                bg-white
                p-10
                text-center
                shadow-sm
            "
        >

            <div className="text-6xl">
                ⚠️
            </div>

            <h1 className="mt-6 text-3xl font-bold">

                Payment Cancelled

            </h1>

            <p className="mt-4 text-slate-600">

                Your payment was not completed.

            </p>

            <p className="mt-2 text-slate-500">

                You can return to the payment page whenever you're ready.

            </p>

            <div className="mt-10">

                <button
                    onClick={() =>
                        router.replace(
                            `/bookings/${bookingId}/payment`
                        )
                    }
                    className="
                        rounded-xl
                        bg-orange-500
                        px-8
                        py-3
                        font-semibold
                        text-white
                        hover:bg-orange-600
                    "
                >

                    Try Again

                </button>

            </div>

        </div>

    );

}