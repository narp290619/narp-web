import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpSection from "@/components/help/HelpSection";
import HelpNotice from "@/components/help/HelpNotice";

export const metadata = {
    title: "Bookings | NARP Help Center",
    description:
        "Learn how to find a service, book a freelancer, manage your booking, and complete a service on NARP.",
};

const tocItems = [
    {
        id: "finding-service",
        title: "Finding a Service",
    },
    {
        id: "creating-booking",
        title: "Creating a Booking",
    },
    {
        id: "booking-status",
        title: "Booking Status",
    },
    {
        id: "managing-booking",
        title: "Managing Your Booking",
    },
    {
        id: "service-completion",
        title: "Completing a Service",
    },
    {
        id: "cancellations",
        title: "Cancellations",
    },
    {
        id: "booking-problems",
        title: "Booking Problems",
    },
];

export default function BookingsHelpPage() {
    return (
        <HelpArticleLayout
            title="Bookings"
            description="Learn how to find freelancers, create bookings, manage your service requests, and complete bookings on NARP."
            currentArticle="bookings"
            tocItems={tocItems}
        >
            <div className="space-y-10">

                <HelpSection
                    id="finding-service"
                    title="Finding a Service"
                >
                    <p>
                        NARP helps clients find freelancers and service
                        providers based on the services they offer and,
                        where applicable, their location.
                    </p>

                    <p>
                        You can browse available services, review freelancer
                        profiles, compare ratings, and review service
                        information before creating a booking.
                    </p>
                </HelpSection>

                <HelpSection
                    id="creating-booking"
                    title="Creating a Booking"
                >
                    <p>
                        To create a booking:
                    </p>

                    <ol>
                        <li>Choose the service you need.</li>
                        <li>Select a freelancer.</li>
                        <li>Review the service details and pricing.</li>
                        <li>Choose the appropriate booking details.</li>
                        <li>Confirm the booking request.</li>
                        <li>Complete the required payment.</li>
                    </ol>

                    <HelpNotice type="info">
                        Review the booking details carefully before confirming
                        your request. Make sure the service, price, schedule,
                        and other important information are correct.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="booking-status"
                    title="Booking Status"
                >
                    <p>
                        Your booking may display different statuses depending
                        on its current stage.
                    </p>

                    <div className="space-y-4">

                        <div>
                            <h3>Pending</h3>
                            <p>
                                The booking has been created and is waiting
                                for the next required action.
                            </p>
                        </div>

                        <div>
                            <h3>Confirmed</h3>
                            <p>
                                The booking has been accepted and confirmed.
                            </p>
                        </div>

                        <div>
                            <h3>In Progress</h3>
                            <p>
                                The service is currently being performed.
                            </p>
                        </div>

                        <div>
                            <h3>Completed</h3>
                            <p>
                                The service has been completed.
                            </p>
                        </div>

                        <div>
                            <h3>Cancelled</h3>
                            <p>
                                The booking has been cancelled.
                            </p>
                        </div>

                    </div>
                </HelpSection>

                <HelpSection
                    id="managing-booking"
                    title="Managing Your Booking"
                >
                    <p>
                        Depending on the booking status, you may be able to
                        review booking details, communicate with the other
                        party, update certain information, or cancel the
                        booking.
                    </p>

                    <p>
                        Keep all important booking-related communication
                        within the NARP platform whenever possible.
                    </p>
                </HelpSection>

                <HelpSection
                    id="service-completion"
                    title="Completing a Service"
                >
                    <p>
                        Once the freelancer has completed the agreed service,
                        the booking can proceed through the applicable
                        completion process.
                    </p>

                    <p>
                        Clients should review the completed service before
                        confirming completion.
                    </p>

                    <HelpNotice type="info">
                        For eligible bookings, payment funds may be released
                        according to the applicable escrow and payment
                        policies after the service is completed.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="cancellations"
                    title="Cancellations"
                >
                    <p>
                        A booking may be cancelled when permitted under
                        NARP's applicable cancellation rules.
                    </p>

                    <p>
                        Cancellation outcomes may depend on:
                    </p>

                    <ul>
                        <li>When the cancellation is requested.</li>
                        <li>The current booking status.</li>
                        <li>Whether the service has already started.</li>
                        <li>Applicable refund rules.</li>
                        <li>The circumstances surrounding the cancellation.</li>
                    </ul>

                    <HelpNotice type="warning">
                        Cancelling a booking does not automatically guarantee
                        a full refund. Refund eligibility is determined by the
                        applicable NARP policies.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="booking-problems"
                    title="Booking Problems"
                >
                    <p>
                        If you experience a problem with a booking, first
                        review the booking details and current status.
                    </p>

                    <p>
                        If the issue cannot be resolved, contact NARP Support
                        and provide the relevant booking information.
                    </p>

                    <HelpNotice type="info">
                        Keep screenshots, messages, receipts, and other
                        relevant information when reporting a booking issue.
                    </HelpNotice>
                </HelpSection>

            </div>
        </HelpArticleLayout>
    );
}