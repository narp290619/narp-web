"use client";

interface Props {

    step: number;

    canContinue: boolean;

    onBack: () => void;

    onContinue: () => void;

    onFinish: () => void;

}

export default function BookingFooter({

    step,

    canContinue,

    onBack,

    onContinue,

    onFinish,

}: Props) {

    return (

        <div
            className="
                mt-12
                flex
                items-center
                justify-between
            "
        >

            <button

                type="button"

                onClick={onBack}

                disabled={step === 0}

                className="
                    rounded-xl
                    border
                    px-6
                    py-3
                    font-semibold
                    transition

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    hover:bg-slate-100
                "

            >

                Back

            </button>

            {

                step < 3 ? (

                    <button

                        type="button"

                        onClick={onContinue}

                        disabled={!canContinue}

                        className="
                            rounded-xl
                            bg-orange-500
                            px-8
                            py-3
                            font-semibold
                            text-white
                            transition

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            hover:bg-orange-600
                        "

                    >

                        Continue

                    </button>

                ) : (

                    <button

                        type="button"

                        onClick={onFinish}

                        className="
                            rounded-xl
                            bg-green-600
                            px-8
                            py-3
                            font-semibold
                            text-white
                            transition

                            hover:bg-green-700
                        "

                    >

                        Continue to Face Verification

                    </button>

                )

            }

        </div>

    );

}