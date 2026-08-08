import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpSection from "@/components/help/HelpSection";
import HelpNotice from "@/components/help/HelpNotice";

export const metadata = {
    title: "Payments | NARP Help Center",
    description:
        "Learn how payments work on NARP, including payment methods, booking payments, payment status, refunds, and common payment issues.",
};

const tocItems = [
    {
        id: "how-payments-work",
        title: "How Payments Work",
    },
    {
        id: "payment-methods",
        title: "Payment Methods",
    },
    {
        id: "making-payment",
        title: "Making a Payment",
    },
    {
        id: "payment-status",
        title: "Payment Status",
    },
    {
        id: "escrow",
        title: "Escrow and Payment Release",
    },
    {
        id: "refunds",
        title: "Refunds",
    },
    {
        id: "payment-problems",
        title: "Payment Problems",
    },
    {
        id: "payment-security",
        title: "Payment Security",
    },
];

export default function PaymentsHelpPage() {
    return (
        <HelpArticleLayout
            title="Payments"
            description="Learn how payments work on NARP, from booking a service to payment release, refunds, and resolving payment issues."
            currentArticle="payments"
            tocItems={tocItems}
        >
            <div className="space-y-10">

                {/* How Payments Work */}

                <HelpSection
                    id="how-payments-work"
                    title="How Payments Work"
                >
                    <p>
                        NARP allows clients to pay for services through
                        supported payment methods available on the platform.
                        Payments are associated with a specific booking and
                        are processed through approved payment providers.
                    </p>

                    <p>
                        Depending on the transaction, funds may be temporarily
                        held while the service is being completed. This helps
                        provide protection for both clients and freelancers.
                    </p>

                    <p>
                        Once the applicable conditions are satisfied, funds
                        may be released to the freelancer according to NARP's
                        payment and escrow policies.
                    </p>
                </HelpSection>

                {/* Payment Methods */}

                <HelpSection
                    id="payment-methods"
                    title="Payment Methods"
                >
                    <p>
                        NARP may support one or more payment methods depending
                        on availability, location, and the payment providers
                        integrated with the platform.
                    </p>

                    <ul className="list-disc space-y-2 pl-6">
                        <li>Online card payments</li>
                        <li>Supported digital payment methods</li>
                        <li>Other payment methods made available by NARP</li>
                    </ul>

                    <p>
                        Available payment methods are displayed during the
                        booking or checkout process.
                    </p>

                    <HelpNotice type="info">
                        Payment methods may change over time as NARP adds,
                        removes, or updates payment providers.
                    </HelpNotice>
                </HelpSection>

                {/* Making a Payment */}

                <HelpSection
                    id="making-payment"
                    title="Making a Payment"
                >
                    <p>
                        To pay for a booking:
                    </p>

                    <ol className="list-decimal space-y-3 pl-6">
                        <li>Select the service you want to book.</li>
                        <li>Review the freelancer and booking details.</li>
                        <li>Confirm the service amount and applicable fees.</li>
                        <li>Select an available payment method.</li>
                        <li>Complete the payment through the secure checkout process.</li>
                        <li>Wait for the payment confirmation.</li>
                    </ol>

                    <p>
                        Do not send payment directly to a freelancer when the
                        transaction is intended to be completed through NARP.
                    </p>

                    <HelpNotice type="warning">
                        Payments made outside the NARP platform may not be
                        protected by NARP's booking, escrow, dispute, or refund
                        processes.
                    </HelpNotice>
                </HelpSection>

                {/* Payment Status */}

                <HelpSection
                    id="payment-status"
                    title="Payment Status"
                >
                    <p>
                        Your booking may display different payment statuses
                        depending on the current stage of the transaction.
                    </p>

                    <div className="space-y-4">

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Pending
                            </h3>

                            <p>
                                The payment has been initiated but has not yet
                                been fully confirmed.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Paid
                            </h3>

                            <p>
                                The payment has been successfully confirmed by
                                the payment provider.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Refunded
                            </h3>

                            <p>
                                The applicable amount has been returned to the
                                client according to the refund process.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Failed
                            </h3>

                            <p>
                                The payment could not be completed. You may
                                need to try again using an available payment
                                method.
                            </p>
                        </div>

                    </div>
                </HelpSection>

                {/* Escrow */}

                <HelpSection
                    id="escrow"
                    title="Escrow and Payment Release"
                >
                    <p>
                        For eligible bookings, NARP may temporarily hold
                        payment funds while the agreed service is being
                        completed.
                    </p>

                    <p>
                        This arrangement is intended to help protect both
                        parties and provide a mechanism for handling disputes
                        before funds are released.
                    </p>

                    <p>
                        Depending on the applicable booking and platform
                        policies, funds may be released after:
                    </p>

                    <ul className="list-disc space-y-2 pl-6">
                        <li>The freelancer completes the service.</li>
                        <li>The client confirms completion.</li>
                        <li>The applicable release period expires.</li>
                        <li>A dispute is resolved.</li>
                    </ul>

                    <HelpNotice type="info">
                        Escrow availability, release conditions, and processing
                        times are subject to NARP's current Escrow Policy.
                    </HelpNotice>
                </HelpSection>

                {/* Refunds */}

                <HelpSection
                    id="refunds"
                    title="Refunds"
                >
                    <p>
                        A client may be eligible for a full or partial refund
                        depending on the circumstances of the booking and the
                        applicable NARP policies.
                    </p>

                    <p>
                        Refunds may be considered when, for example:
                    </p>

                    <ul className="list-disc space-y-2 pl-6">
                        <li>A booking is cancelled under eligible conditions.</li>
                        <li>A service is not provided as agreed.</li>
                        <li>A payment was incorrectly processed.</li>
                        <li>A dispute results in a refund decision.</li>
                    </ul>

                    <p>
                        Refund processing times may depend on the payment
                        provider and the payment method originally used.
                    </p>

                    <HelpNotice type="info">
                        For detailed refund rules, please review the NARP
                        Refund Policy.
                    </HelpNotice>
                </HelpSection>

                {/* Payment Problems */}

                <HelpSection
                    id="payment-problems"
                    title="Payment Problems"
                >
                    <p>
                        If your payment does not appear to have completed,
                        first check the payment status associated with your
                        booking.
                    </p>

                    <p>
                        You can also try:
                    </p>

                    <ul className="list-disc space-y-2 pl-6">
                        <li>Checking your internet connection.</li>
                        <li>Confirming that your payment details are correct.</li>
                        <li>Trying another supported payment method.</li>
                        <li>Checking whether your bank or payment provider declined the transaction.</li>
                        <li>Waiting a short time if the payment is still processing.</li>
                    </ul>

                    <p>
                        If your account was charged but the NARP booking does
                        not show the expected payment status, contact NARP
                        Support and provide the relevant booking information.
                    </p>

                    <HelpNotice type="warning">
                        Do not repeatedly submit a payment if your bank or
                        payment provider already shows a successful charge.
                        This may result in duplicate charges.
                    </HelpNotice>
                </HelpSection>

                {/* Payment Security */}

                <HelpSection
                    id="payment-security"
                    title="Payment Security"
                >
                    <p>
                        NARP uses third-party payment providers and security
                        measures designed to help protect payment transactions.
                    </p>

                    <p>
                        NARP does not intentionally store complete credit or
                        debit card details when those details are handled
                        directly by the payment provider.
                    </p>

                    <p>
                        Never share your password, authentication codes, card
                        details, or other sensitive payment information with
                        another user through NARP messaging.
                    </p>

                    <HelpNotice type="warning">
                        NARP Support will not ask you to provide your password
                        or authentication codes through a freelancer or another
                        user.
                    </HelpNotice>
                </HelpSection>

            </div>
        </HelpArticleLayout>
    );
}