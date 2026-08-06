"use client";

import { markBookingPaymentHeld } from "../repositories/booking.repository";


export async function simulatePayment(
    bookingId: string,
): Promise<void> {
    // Temporary simulation.
    // Later this will redirect to PayMongo.

    await markBookingPaymentHeld(bookingId);
}