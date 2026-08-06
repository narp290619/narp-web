"use client";

interface Props {

    loading: boolean;

    total: number;

    onProceed: () => void | Promise<void>;

}

export default function PaymentFooter({

    loading,

    total,

    onProceed,

}: Props) {

    return (

        <div
            className="
                sticky
                bottom-0
                rounded-2xl
                border
                bg-white
                p-6
                shadow-lg
            "
        >

            <div className="mb-4 flex items-center justify-between">

                <span className="text-lg font-medium">
                    Total
                </span>

                <span className="text-2xl font-bold text-orange-600">
                    ₱{total.toFixed(2)}
                </span>

            </div>

            <button

                type="button"

                disabled={loading}

                onClick={onProceed}

                className="
                    w-full
                    rounded-xl
                    bg-orange-500
                    py-4
                    font-semibold
                    text-white
                    transition

                    hover:bg-orange-600

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "

            >

                {loading
                    ? "Redirecting to PayMongo..."
                    : `Pay $₱${total.toFixed(2)}`}

            </button>

        </div>

    );

}