import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpNotice from "@/components/help/HelpNotice";
import HelpSection from "@/components/help/HelpSection";

export const metadata = {
    title: "Payments & Escrow | Help Center | NARP",
    description:
        "Learn how payments, escrow, refunds, and withdrawals work on NARP.",
};

export default function PaymentsHelpPage() {
    return (
        <HelpArticleLayout
            title="Payments & Escrow"
            description="Everything you need to know about payments, escrow protection, refunds, and freelancer payouts."
            currentArticle="/help/payments"
        >
            <HelpSection title="How Payments Work">
                <p>
                    NARP provides a secure payment process designed to protect
                    both clients and freelancers.
                </p>

                <ol>
                    <li>Book a service.</li>
                    <li>The freelancer accepts your request.</li>
                    <li>The client completes the payment.</li>
                    <li>Funds are securely held in escrow.</li>
                    <li>The freelancer completes the service.</li>
                    <li>The client confirms completion.</li>
                    <li>The payment is released to the freelancer's wallet.</li>
                </ol>
            </HelpSection>

            <HelpNotice
                type="success"
                title="Your Payment Is Protected"
            >
                Client payments are not immediately released to freelancers.
                Funds remain securely held in escrow until the service has been
                completed and approved or otherwise resolved under NARP's
                policies.
            </HelpNotice>

            <HelpSection title="What Is Escrow?">
                <p>
                    Escrow is a secure holding system that protects both parties
                    during a transaction.
                </p>

                <ul>
                    <li>Clients know their payment is protected.</li>
                    <li>Freelancers know funds have been secured.</li>
                    <li>Payments are released only after service completion.</li>
                    <li>Disputed funds remain protected while under review.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Supported Payment Methods">
                <p>
                    Payment options may change as NARP continues to expand.
                    Available payment methods are displayed during checkout.
                </p>

                <ul>
                    <li>Supported digital payment providers.</li>
                    <li>Additional payment methods may be added in future updates.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Refunds">
                <p>
                    Refund eligibility depends on the booking status and the
                    circumstances surrounding the request.
                </p>

                <ul>
                    <li>Cancelled bookings may qualify for a refund.</li>
                    <li>Disputed bookings are reviewed individually.</li>
                    <li>Approved refunds are processed according to the Refund Policy.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="warning"
                title="Refund Requests"
            >
                Not every cancellation automatically qualifies for a refund.
                Eligibility depends on the timing of the cancellation, service
                status, and the outcome of any investigation.
            </HelpNotice>

            <HelpSection title="Freelancer Wallet">
                <p>
                    Once escrow funds are released, the approved amount is
                    credited to the freelancer's NARP Wallet.
                </p>

                <ul>
                    <li>View your available wallet balance.</li>
                    <li>Track completed payouts.</li>
                    <li>Submit withdrawal requests.</li>
                    <li>Review your transaction history.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Withdrawals">
                <p>
                    Freelancers may withdraw available wallet balances once they
                    meet the requirements outlined in the Withdrawal Policy.
                </p>

                <ul>
                    <li>Only available wallet balances can be withdrawn.</li>
                    <li>Funds still in escrow cannot be withdrawn.</li>
                    <li>Identity verification may be required.</li>
                    <li>Processing times vary depending on the payment provider.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="info"
                title="Security Reviews"
            >
                To protect the platform and its users, NARP may temporarily
                delay payouts or request additional verification if suspicious
                activity is detected.
            </HelpNotice>

            <HelpSection title="Need More Help?">
                <p>
                    If you're experiencing payment issues, refund concerns, or
                    withdrawal problems, please contact NARP Support. Be sure to
                    include your booking reference and any relevant screenshots
                    to help us investigate more quickly.
                </p>
            </HelpSection>
        </HelpArticleLayout>
    );
}