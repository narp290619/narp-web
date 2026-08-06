"use client";

import PaymentSection from "./PaymentSection";

export type PaymentMethod =

    | "gcash"

    | "maya"

    | "card";

interface Props {

    value: PaymentMethod;

    onChange: (
        value: PaymentMethod,
    ) => void;

}

export default function PaymentMethodSelector({

    value,

    onChange,

}: Props) {

    return (

        <PaymentSection
            title="Payment Method"
        >

            <div className="space-y-4">

                <Method

                    title="GCash"

                    selected={
                        value === "gcash"
                    }

                    onClick={() =>
                        onChange("gcash")
                    }

                />

                <Method

                    title="Maya"

                    selected={
                        value === "maya"
                    }

                    onClick={() =>
                        onChange("maya")
                    }

                />

                <Method

                    title="Credit / Debit Card"

                    selected={
                        value === "card"
                    }

                    onClick={() =>
                        onChange("card")
                    }

                />

            </div>

        </PaymentSection>

    );

}

interface MethodProps {

    title: string;

    selected: boolean;

    onClick: () => void;

}

function Method({

    title,

    selected,

    onClick,

}: MethodProps) {

    return (

        <button

            type="button"

            onClick={onClick}

            className={`
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border
                p-5
                transition

                ${
                    selected

                        ? "border-orange-500 bg-orange-50"

                        : "hover:bg-slate-50"
                }
            `}

        >

            <span
                className="font-medium"
            >

                {title}

            </span>

            <input

                type="radio"

                checked={selected}

                readOnly

            />

        </button>

    );

}