import { Metadata } from "next";

import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import LegalNotice from "@/components/legal/LegalNotice";
import LegalContactBox from "@/components/legal/LegalContactBox";
import LegalList from "@/components/legal/LegalList";
import RelatedPolicies from "@/components/legal/RelatedPolicies";

export const metadata: Metadata = {
    title: "Refund Policy | NARP",
    description:
        "Learn how refunds, cancellations, disputes, and escrow payments are handled on NARP.",
};

export default function RefundPolicyPage() {

    return (

        <LegalLayout
            icon="💰"
            title="Refund Policy"
            description="
                This Refund Policy explains how refunds are
                processed for transactions conducted through
                NARP (Nearby App for Reliable Professionals).
            "
            effectiveDate="May 9, 2026"
            lastUpdated="August 2026"
        >

            <LegalSection title="1. Purpose">

                <p>

                    NARP aims to provide a fair and transparent
                    refund process for both clients and freelancers
                    while protecting users through its escrow system.

                </p>

            </LegalSection>

            <LegalSection title="2. Client Cancellation">

                <p>

                    Refund eligibility depends on the booking status
                    and the stage of service completion at the time
                    the cancellation request is made.

                </p>

            </LegalSection>

            <LegalSection title="3. After Freelancer Acceptance">

                <p>

                    Once a freelancer has accepted a booking,
                    refund requests may require review by NARP.

                </p>

                <p>

                    Factors considered may include:

                </p>

                <LegalList
                    items={[
                        "Work already performed",
                        "Time spent by the freelancer",
                        "Booking details",
                        "Messages exchanged between client and freelancer",
                        "Photos or other submitted evidence",
                    ]}
                />

            </LegalSection>

            <LegalSection title="4. Completed Services">

                <p>

                    Payments are generally non-refundable once
                    the client has confirmed that the service
                    has been completed.

                </p>

                <LegalNotice title="Important">

                    <p>

                        Client confirmation may immediately release
                        escrow funds to the freelancer.

                    </p>

                    <p className="mt-4">

                        Once escrow funds have been released,
                        refunds may no longer be available except
                        where required by applicable law or after
                        investigation by NARP.

                    </p>

                </LegalNotice>

            </LegalSection>

            <LegalSection title="5. Disputes">

                <p>

                    If a client believes the agreed service
                    was not delivered correctly, a dispute
                    may be submitted through NARP Support.

                </p>

                <p>

                    During the investigation, NARP may:

                </p>

                <LegalList
                    items={[
                        "Temporarily hold escrow funds",
                        "Request additional evidence",
                        "Review booking records",
                        "Review communications between both parties",
                        "Determine an appropriate resolution",
                    ]}
                />

                <p className="mt-6">

                    Possible outcomes include:

                </p>

                <LegalList
                    items={[
                        "Full refund",
                        "Partial refund",
                        "Release of escrow funds to the freelancer",
                        "Any other action deemed appropriate by NARP",
                    ]}
                />

            </LegalSection>

            <LegalSection title="6. Non-Refundable Situations">

                <p>

                    Refund requests may be declined in situations
                    including, but not limited to:

                </p>

                <LegalList
                    items={[
                        "Services successfully completed and confirmed by the client",
                        "Change of mind after service completion",
                        "Failure to review booking details before confirming",
                        "Violations of the NARP Terms of Service",
                        "Fraudulent or abusive refund requests",
                    ]}
                />

            </LegalSection>

            <LegalSection title="7. Refund Processing Time">

                <p>

                    Approved refunds are generally processed within:

                </p>

                <LegalList
                    items={[
                        "5–15 business days",
                        "Depending on the payment provider",
                        "Subject to banking and payment network processing times",
                    ]}
                />

            </LegalSection>

            <LegalSection title="8. Third-Party Payment Providers">

                <p>

                    Refund processing may involve third-party
                    payment providers.

                </p>

                <p>

                    NARP is not responsible for delays caused
                    by banks, payment gateways, e-wallet providers,
                    or other financial institutions.

                </p>

            </LegalSection>

            <LegalSection title="9. Changes to this Policy">

                <p>

                    We may update this Refund Policy from time
                    to time.

                </p>

                <p>

                    Updated versions become effective immediately
                    after publication unless otherwise stated.

                </p>

            </LegalSection>

            <LegalSection title="10. Contact">

                <p>

                    For refund requests, escrow concerns,
                    or payment-related questions, please
                    contact our support team.

                </p>

                <LegalContactBox
                    title="Refund Support"
                    email="support@narp-svc.site"
                />

            </LegalSection>

            <RelatedPolicies
                current="/legal/refund"
            />

            <LegalSection title="Acknowledgement">

                <p>

                    By accessing or using NARP, you acknowledge
                    that you have read, understood, and agree
                    to this Refund Policy.

                </p>

            </LegalSection>

        </LegalLayout>

    );

}