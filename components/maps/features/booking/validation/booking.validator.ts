import { BookingDraft } from "../types/JobRequestDraft";

export interface ValidationResult {

    valid: boolean;

    message?: string;

}

export function validateSchedule(
    booking: BookingDraft,
): ValidationResult {

    if (!booking.schedule.date) {

        return {

            valid: false,

            message: "Please select a booking date.",

        };

    }

    if (!booking.schedule.time) {

        return {

            valid: false,

            message: "Please select a booking time.",

        };

    }

    return {

        valid: true,

    };

}

export function validateLocation(
    booking: BookingDraft,
): ValidationResult {

    if (!booking.location.address?.trim()) {

        return {

            valid: false,

            message: "Please select a service location.",

        };

    }

    return {

        valid: true,

    };

}

export function validateDescription(
    booking: BookingDraft,
): ValidationResult {

    if (
        booking.description.trim().length < 10
    ) {

        return {

            valid: false,

            message:
                "Please enter at least 10 characters describing the job.",

        };

    }

    return {

        valid: true,

    };

}

export function validateStep(
    step: number,
    booking: BookingDraft,
): ValidationResult {

    switch (step) {

        case 0:

            return validateSchedule(
                booking,
            );

        case 1:

            return validateLocation(
                booking,
            );

        case 2:

            return validateDescription(
                booking,
            );

        default:

            return {

                valid: true,

            };

    }

}