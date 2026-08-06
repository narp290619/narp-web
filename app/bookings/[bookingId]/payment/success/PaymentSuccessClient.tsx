"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
    subscribeToBooking,
} from "@/components/maps/features/booking/repositories/booking.repository";

import { PAYMENT_STATUS } from "@/lib/models/payment-status";

interface Props {

    bookingId: string;

}

export default function PaymentSuccessClient({

    bookingId,

}: Props) {

    const router = useRouter();

    useEffect(() => {

        const unsubscribe =
            subscribeToBooking(

                bookingId,

                (booking) => {

                    if (!booking) {

                        return;

                    }

                    //
                    // Webhook has finished.
                    //

                    if (
                        booking.paymentStatus === PAYMENT_STATUS.HELD &&
                        booking.status === "accepted"
                    ) {
                        router.replace(`/bookings/${bookingId}`);
                    }

                },

            );

        return unsubscribe;

    }, [

        bookingId,

        router,

    ]);

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
                ✅
            </div>

            <h1
                className="
                    mt-6
                    text-3xl
                    font-bold
                "
            >
                Payment Successful
            </h1>

            <p
                className="
                    mt-4
                    text-slate-600
                "
            >
                Your payment has been received.
            </p>

            <p
                className="
                    mt-2
                    text-slate-500
                "
            >
                We're confirming your booking.
            </p>

            <div
                className="
                    mt-8
                    flex
                    items-center
                    justify-center
                    gap-3
                    text-orange-500
                "
            >

                <div
                    className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-orange-500
                        border-t-transparent
                    "
                />

                <span>

                    Waiting for confirmation...

                </span>

            </div>

            <p
                className="
                    mt-8
                    text-sm
                    text-slate-400
                "
            >
                This usually takes only a few seconds.

            </p>

        </div>

    );

}