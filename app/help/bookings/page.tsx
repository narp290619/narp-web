import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpNotice from "@/components/help/HelpNotice";
import HelpSection from "@/components/help/HelpSection";

export const metadata = {
    title: "Booking Services | Help Center | NARP",
    description:
        "Learn how to find freelancers, submit booking requests, and manage your bookings on NARP.",
};

export default function BookingServicesPage() {
    return (
        <HelpArticleLayout
            title="Booking Services"
            description="Learn how to find freelancers, send booking requests, and manage your service bookings on NARP."
            currentArticle="/help/bookings"
        >
            <HelpSection title="Finding a Freelancer">
                <p>
                    Browse the available service categories or use the search
                    feature to find freelancers that match your needs.
                </p>

                <ul>
                    <li>Browse services by category.</li>
                    <li>Search using keywords.</li>
                    <li>View freelancer profiles.</li>
                    <li>Compare ratings and reviews.</li>
                    <li>Check service availability.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Submitting a Booking Request">
                <p>
                    Once you've selected a freelancer, you can submit a booking
                    request by providing the required details.
                </p>

                <ol>
                    <li>Select your preferred service.</li>
                    <li>Choose a date and time.</li>
                    <li>Add any notes or special instructions.</li>
                    <li>Review the booking details.</li>
                    <li>Submit your request.</li>
                </ol>
            </HelpSection>

            <HelpNotice
                type="info"
                title="Booking Requests"
            >
                A booking request is not confirmed immediately. The freelancer
                must review and accept your request before the booking becomes
                confirmed.
            </HelpNotice>

            <HelpSection title="Booking Statuses">
                <p>Your booking may move through several stages:</p>

                <ul>
                    <li><strong>Pending</strong> – Waiting for freelancer response.</li>
                    <li><strong>Accepted</strong> – Freelancer accepted the booking.</li>
                    <li><strong>In Progress</strong> – Service is currently being performed.</li>
                    <li><strong>Completed</strong> – Service has been completed.</li>
                    <li><strong>Cancelled</strong> – Booking has been cancelled.</li>
                    <li><strong>Disputed</strong> – Booking is under investigation.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Managing Your Booking">
                <p>
                    You can monitor your bookings directly from the Bookings
                    section of the NARP app.
                </p>

                <ul>
                    <li>View booking details.</li>
                    <li>Chat with your freelancer.</li>
                    <li>Track booking progress.</li>
                    <li>Cancel eligible bookings.</li>
                    <li>Confirm service completion.</li>
                    <li>Leave a rating and review.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="warning"
                title="Cancellation Policy"
            >
                Cancelling a booking after it has been accepted or after work
                has started may affect your eligibility for a refund. Please
                review the Cancellation Policy for complete details.
            </HelpNotice>

            <HelpSection title="Need More Help?">
                <p>
                    If you're experiencing problems with a booking, payment, or
                    freelancer, please contact NARP Support through the Contact
                    page or submit a support request from within the app.
                </p>
            </HelpSection>
        </HelpArticleLayout>
    );
}