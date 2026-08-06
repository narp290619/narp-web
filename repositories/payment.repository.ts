import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export async function createCheckoutSession(
    bookingId: string,
) {
    const callable = httpsCallable(
        functions,
        "createCheckoutSession",
    );

    const result = await callable({
        bookingId,
    });

    return result.data as {
        checkoutUrl: string;
    };
}