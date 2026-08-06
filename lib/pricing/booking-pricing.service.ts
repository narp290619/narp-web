import { BookingPricing } from "./booking-pricing";
import { BookingSettings } from "@/lib/config/booking-settings";

export function calculateBookingPrice(

    startingPrice: number,

): BookingPricing {

    const serviceFee = Number(startingPrice);

    const platformFee =
        BookingSettings.PLATFORM_FEE;

    const total =
        serviceFee + platformFee;

    return {

        serviceFee,

        platformFee,

        total,

    };

}