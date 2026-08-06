"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useBooking } from "@/hooks/useBookings";


import { auth } from "@/lib/firebase";
import { getUser } from "@/components/maps/features/users/repositories/user.repository";
import { submitReview } from "@/lib/firebase/review-submit.service";

interface Props {
    bookingId: string;
}

export default function LeaveReviewClient({
    bookingId,
}: Props) {

    const router = useRouter();

    const user = auth.currentUser;

    const {
        booking,
        loading,
    } = useBooking(bookingId);

    const [rating, setRating] = useState(5);

    const [comment, setComment] = useState("");

    const [submitting, setSubmitting] =
        useState(false);

    if (loading) {

        return (

            <div className="rounded-2xl border bg-white p-8">

                Loading...

            </div>

        );

    }

    if (!booking) {

        return (

            <div className="rounded-2xl border bg-white p-8">

                Booking not found.

            </div>

        );

    }

    async function handleSubmit() {

        if (!user || !booking) {
            return;
        }

        const client = await getUser(user.uid);

        if (!client) {

            return;

        }

        try {

            setSubmitting(true);

            await submitReview({

                bookingId,

                freelancerId: booking.freelancerId,

                clientId: user.uid,

                clientName: client.name,

                clientProfileImageUrl:
                    client.profileImageUrl,

                clientVerified:
                    client.isVerified,

                skillId: booking.skillId,

                rating,

                comment,

            });

            router.replace(
                `/bookings/${bookingId}`,
            );

        } finally {

            setSubmitting(false);

        }

    }

    return (

        <div
            className="
                mx-auto
                max-w-2xl
                rounded-3xl
                border
                bg-white
                p-8
                shadow-sm
            "
        >

            <h1 className="text-3xl font-bold">

                Leave Review

            </h1>

            <p className="mt-2 text-slate-500">

                Rate your experience with the freelancer.

            </p>

            <div className="mt-8">

                <label className="font-medium">

                    Rating

                </label>

                <input

                    className="mt-2 w-full"

                    type="range"

                    min={1}

                    max={5}

                    step={1}

                    value={rating}

                    onChange={(e) =>
                        setRating(
                            Number(e.target.value),
                        )
                    }

                />

                <p className="mt-2">

                    ⭐ {rating}/5

                </p>

            </div>

            <div className="mt-8">

                <label className="font-medium">

                    Review

                </label>

                <textarea

                    className="
                        mt-2
                        h-40
                        w-full
                        rounded-xl
                        border
                        p-4
                    "

                    placeholder="Tell others about your experience..."

                    value={comment}

                    onChange={(e) =>
                        setComment(
                            e.target.value,
                        )
                    }

                />

            </div>

            <button

                onClick={handleSubmit}

                disabled={submitting}

                className="
                    mt-8
                    w-full
                    rounded-xl
                    bg-orange-500
                    py-4
                    font-semibold
                    text-white
                    disabled:opacity-50
                "

            >

                {

                    submitting

                        ? "Submitting..."

                        : "Submit Review"

                }

            </button>

        </div>

    );

}