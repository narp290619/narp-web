"use client";

interface ValidationResult {

    valid: boolean;

    message?: string;

}

interface Props {

    validation: ValidationResult;

    step: number;

    withinServiceArea: boolean;

}

export default function BookingValidationBanner({

    validation,

    step,

    withinServiceArea,

}: Props) {

    if (!validation.valid) {

        return (

            <div
                className="
                    mt-6
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                "
            >

                {validation.message}

            </div>

        );

    }

    if (

        step === 1 &&
        !withinServiceArea

    ) {

        return (

            <div
                className="
                    mt-6
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                "
            >

                This location is outside the freelancer's service area.
                Please choose a nearer location.

            </div>

        );

    }

    return null;

}