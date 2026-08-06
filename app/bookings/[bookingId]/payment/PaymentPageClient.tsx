"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PAYMENT_STATUS } from "@/lib/models/payment-status";
import type { Booking } from "@/lib/models/booking";
import type { SkillMember } from "@/lib/models/skill-member";



import {
    getMember,
} from "@/repositories/skill-member.repository";
import { getBooking, updateBooking } from "@/components/maps/features/booking/repositories/booking.repository";
import PaymentFreelancerCard from "@/components/booking/PaymentPageClient/PaymentFreelancerCard";
import PaymentBookingSummary from "@/components/booking/PaymentPageClient/PaymentBookingSummary";
import PaymentBreakdown from "@/components/booking/PaymentPageClient/PaymentBreakdown";
import PaymentMethodSelector from "@/components/booking/PaymentPageClient/PaymentMethodSelector";
import PaymentFooter from "@/components/booking/PaymentPageClient/PaymentFooter";
import { getFunctions, httpsCallable } from "firebase/functions";
import { calculateBookingPrice } from "@/lib/pricing/booking-pricing.service";
import { createCheckoutSession } from "@/repositories/payment.repository";

// These components will be created next
// import PaymentFreelancerCard from "./components/PaymentFreelancerCard";
// import PaymentBookingSummary from "./components/PaymentBookingSummary";
// import PaymentBreakdown from "./components/PaymentBreakdown";
// import PaymentMethodSelector from "./components/PaymentMethodSelector";
// import PaymentFooter from "./components/PaymentFooter";

type PaymentMethod =
    | "gcash"
    | "maya"
    | "card";

interface Props {

    bookingId: string;

}

export default function PaymentPageClient({

    bookingId,

}: Props) {

    const router = useRouter();

    const [

        loading,

        setLoading,

    ] = useState(true);

    const [

        processing,

        setProcessing,

    ] = useState(false);

    const [

        booking,

        setBooking,

    ] = useState<Booking | null>(null);

    const [

        freelancer,

        setFreelancer,

    ] = useState<SkillMember | null>(null);

    const [

        paymentMethod,

        setPaymentMethod,

    ] = useState<PaymentMethod>("gcash");

    async function loadPayment() {

        try {

            setLoading(true);

            const bookingData =
                await getBooking(bookingId);

            if (!bookingData) {

                setBooking(null);

                return;

            }

            setBooking(bookingData);

            const member =
                await getMember(

                    bookingData.freelancerId,

                    bookingData.skillId,

                );

            setFreelancer(member);

        }

        catch (error) {

            console.error(error);

            console.error("Booking error", error);

            console.error("Member error", error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadPayment();

    }, [

        bookingId,

    ]);

    async function handleProceedPayment() {

        if (!booking) return;

        setProcessing(true);

        try {

            const session =
                await createCheckoutSession(
                    booking.id,
                );

            window.location.href =
                session.checkoutUrl;

        }

        finally {

            setProcessing(false);

        }

    }

    if (loading) {

        return (

            <div
                className="
                    rounded-3xl
                    border
                    bg-white
                    p-10
                    text-center
                    text-slate-500
                "
            >

                Loading payment...

            </div>

        );

    }

    if (

        !booking ||

        !freelancer

    ) {

        return (

            <div
                className="
                    rounded-3xl
                    border
                    border-red-200
                    bg-red-50
                    p-10
                    text-center
                    text-red-600
                "
            >

                Unable to load booking.

            </div>

        );

    }

    const pricing = calculateBookingPrice(
        freelancer.startingPrice,
    );

    return (

        <div
            className="
                mx-auto
                max-w-5xl
                space-y-8
            "
        >

            <h1
                className="
                    text-4xl
                    font-bold
                "
            >

                Payment

            </h1>

            <p
                className="
                    text-slate-500
                "
            >

                Review your booking and
                complete payment.

            </p>

            <PaymentFreelancerCard

                freelancer={freelancer}

            />

            <PaymentBookingSummary
                booking={booking}
            />

            <PaymentBreakdown

                pricing={pricing}

            />

            <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
            />

            <PaymentFooter

                total={pricing.total}

                loading={processing}

                onProceed={handleProceedPayment}

            />

        </div>

    );

}