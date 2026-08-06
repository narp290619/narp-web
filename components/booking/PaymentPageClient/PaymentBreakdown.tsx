"use client";

import { BookingPricing } from "@/lib/pricing/booking-pricing";
import PaymentSection from "./PaymentSection";
import { formatPHP } from "@/lib/utils/currency";

interface Props {

    pricing: BookingPricing;

    discount?: number;

    tip?: number;

}

export default function PaymentBreakdown({

    pricing,

    discount = 0,

    tip = 0,

}: Props) {

    const total =
        pricing.total -
        discount +
        tip;

    return (

        <PaymentSection
            title="Payment Summary"
        >

            <div className="space-y-4">

                <Row
                    label="Service Fee"
                    value={pricing.serviceFee}
                />

                <Row
                    label="Platform Fee"
                    value={pricing.platformFee}
                />

                {

                    discount > 0 && (

                        <Row
                            label="Discount"
                            value={-discount}
                        />

                    )

                }

                {

                    tip > 0 && (

                        <Row
                            label="Tip"
                            value={tip}
                        />

                    )

                }

                <div className="border-t pt-4">

                    <Row
                        label="Total"
                        value={total}
                        bold
                    />

                </div>

            </div>

        </PaymentSection>

    );

}

interface RowProps {

    label: string;

    value: number;

    bold?: boolean;

}

function Row({

    label,

    value,

    bold = false,

}: RowProps) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
            "
        >

            <span
                className={
                    bold
                        ? "font-bold"
                        : "text-slate-600"
                }
            >

                {label}

            </span>

            <span
                className={
                    bold
                        ? "text-xl font-bold text-orange-600"
                        : "font-semibold"
                }
            >

                {formatPHP(Math.abs(value))}

            </span>

        </div>

    );

}