"use client";

interface Props {

    image: string;

    loading?: boolean;

    onRetake(): void;

    onContinue(): void | Promise<void>;

}

export default function FaceCapturePreview({

    image,

    loading = false,

    onRetake,

    onContinue,

}: Props) {

    return (

        <div
            className="
                flex
                flex-col
                items-center
                gap-6
            "
        >

            <div
                className="
                    overflow-hidden
                    rounded-3xl
                    border
                    shadow
                "
            >

                <img

                    src={image}

                    alt="Captured selfie"

                    className="
                        max-w-full
                        object-cover
                    "

                />

            </div>

            <div
                className="
                    flex
                    gap-4
                "
            >

                <button

                    type="button"

                    onClick={onRetake}

                    disabled={loading}

                    className="
                        rounded-xl
                        border
                        px-8
                        py-3
                        font-semibold

                        transition

                        hover:bg-slate-100

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "

                >

                    Retake

                </button>

                <button

                    type="button"

                    onClick={onContinue}

                    disabled={loading}

                    className="
                        rounded-xl
                        bg-orange-500
                        px-8
                        py-3
                        font-semibold
                        text-white

                        transition

                        hover:bg-orange-600

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "

                >

                    {loading

                        ? "Uploading..."

                        : "Continue"}

                </button>

            </div>

        </div>

    );

}