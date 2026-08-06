import { Booking } from "@/lib/models/booking";
import { BOOKING_STATUS } from "@/lib/models/booking-status";

interface Props {
    booking: Booking;
}

export default function FreelancerWorkflowCard({
    booking,
}: Props) {

    const content = getWorkflowContent(booking);

    if (!content) {
        return null;
    }

    return (

        <div
            className="
                rounded-3xl
                border
                bg-white
                p-6
                shadow-sm
                space-y-4
            "
        >

            <div>

                <h2 className="text-xl font-bold">
                    {content.title}
                </h2>

                <p className="mt-2 text-slate-500">
                    {content.description}
                </p>

            </div>

            {content.showAddress && booking.address && (

                <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-sm text-slate-500">
                        Destination
                    </p>

                    <p className="font-semibold">
                        {booking.address}
                    </p>

                </div>

            )}

            {content.showEta && booking.eta && (

                <div className="rounded-xl bg-blue-50 p-4">

                    <p className="text-sm text-slate-500">
                        Estimated Arrival
                    </p>

                    <p className="font-semibold">
                        {booking.eta}
                    </p>

                </div>

            )}

        </div>

    );

}

function getWorkflowContent(booking: Booking) {

    switch (booking.status) {

        case BOOKING_STATUS.ACCEPTED:

            return {
                title: "Ready to Travel",
                description:
                    "The client's payment has been secured in escrow. You can now begin travelling to the service location.",
                showAddress: true,
                showEta: false,
            };

        case BOOKING_STATUS.TRAVELLING:

            return {
                title: "Travelling to Client",
                description:
                    "Navigate to the client's location and mark yourself as arrived once you get there.",
                showAddress: true,
                showEta: true,
            };

        case BOOKING_STATUS.ARRIVED:

            return {
                title: "You've Arrived",
                description:
                    "Meet the client and start the service when you're ready.",
                showAddress: false,
                showEta: false,
            };

        case BOOKING_STATUS.IN_PROGRESS:

            return {
                title: "Service in Progress",
                description:
                    "Complete the requested service before marking the job as finished.",
                showAddress: false,
                showEta: false,
            };

        case BOOKING_STATUS.COMPLETED:

            return {
                title: "Waiting for Client Confirmation",
                description:
                    "The client still needs to confirm completion before the escrow is released.",
                showAddress: false,
                showEta: false,
            };

        default:
            return null;
    }

}