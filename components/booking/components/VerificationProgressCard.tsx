"use client";

import VerificationStatusBadge from "./VerificationStatusBadge";

interface Props {

    status?: string;

    confidence?: number;

}

export default function VerificationProgressCard({

    status,

    confidence,

}: Props) {

    if (status === "verified") {

        return (

            <section
                className="
                    rounded-2xl
                    border
                    border-green-200
                    bg-green-50
                    p-6
                "
            >

                <h2 className="text-xl font-semibold">

                    Identity Verification

                </h2>

                <div className="mt-5">

                    <VerificationStatusBadge
                        status={status}
                    />

                </div>

                <p className="mt-5 text-slate-700">

                    Your identity has been successfully verified.

                </p>

                {confidence != null && (

                    <p className="mt-2 text-sm text-slate-500">

                        Confidence

                        <span className="ml-2 font-semibold">

                            {(confidence * 100).toFixed(1)}%

                        </span>

                    </p>

                )}

            </section>

        );

    }

    if (status === "pending") {

        return (

            <section
                className="
                    rounded-2xl
                    border
                    border-yellow-200
                    bg-yellow-50
                    p-6
                "
            >

                <h2 className="text-xl font-semibold">

                    Identity Verification

                </h2>

                <div className="mt-5">

                    <VerificationStatusBadge
                        status={status}
                    />

                </div>

                <p className="mt-5 text-slate-700">

                    Your selfie has been submitted.

                </p>

                <p className="mt-2 text-sm text-slate-500">

                    Verification usually finishes within a few
                    seconds.

                </p>

                <div
                    className="
                        mt-6
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-yellow-500
                            border-t-transparent
                        "
                    />

                    <span className="text-sm text-slate-600">

                        Refreshing automatically...

                    </span>

                </div>

            </section>

        );

    }

    if (status === "failed") {

        return (

            <section
                className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-6
                "
            >

                <h2 className="text-xl font-semibold">

                    Identity Verification

                </h2>

                <div className="mt-5">

                    <VerificationStatusBadge
                        status={status}
                    />

                </div>

                <p className="mt-5 text-slate-700">

                    We couldn't verify your identity.

                </p>

                <button
                    className="
                        mt-6
                        rounded-xl
                        bg-orange-500
                        px-5
                        py-3
                        font-semibold
                        text-white
                    "
                >

                    Try Again

                </button>

            </section>

        );

    }

    return null;

}