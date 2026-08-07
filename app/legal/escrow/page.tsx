import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import LegalFlow from "@/components/legal/LegalFlow";
import LegalNotice from "@/components/legal/LegalNotice";
import LegalContactBox from "@/components/legal/LegalContactBox";
import RelatedPolicies from "@/components/legal/RelatedPolicies";

export const metadata = {
    title: "Escrow Policy | NARP",
    description:
        "Learn how NARP's escrow system protects both clients and freelancers by securely holding payments until services are completed and approved.",
};

export default function EscrowPolicyPage() {

    return (

        <LegalLayout
            title="Escrow Policy"
            description="NARP uses an escrow system to protect both clients and freelancers by securely holding funds until services are completed and approved."
            effectiveDate="May 9, 2026"
            lastUpdated="May 9, 2026"
            icon="🛡️"
        >

            <LegalSection title="1. Purpose">

                <p>
                    NARP (Nearby App for Reliable Professionals) uses an
                    escrow payment system to provide a secure and fair
                    transaction process between clients and freelancers.
                </p>

                <p className="mt-4">
                    Payments made by clients are temporarily held by NARP
                    and are not immediately released to the freelancer.
                    This helps protect both parties until the agreed
                    service has been completed.
                </p>

            </LegalSection>

            <LegalSection title="2. Payment Flow">

                <p>
                    The escrow process generally follows the workflow below:
                </p>

                <LegalFlow
                    steps={[
                        "Client books a service",
                        "Freelancer accepts the booking",
                        "Client completes payment",
                        "Funds are securely held in escrow",
                        "Freelancer performs the service",
                        "Client confirms completion",
                        "Escrow funds are released",
                        "Funds are credited to the freelancer's NARP Wallet",
                    ]}
                />

            </LegalSection>

            <LegalSection title="3. Release of Escrow Funds">

                <p>
                    Escrow funds may be released when one of the following
                    conditions is met:
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6">

                    <li>
                        The client confirms that the service has been completed.
                    </li>

                    <li>
                        NARP resolves a dispute and authorizes the release of funds.
                    </li>

                    <li>
                        Automatic release conditions defined by the platform are satisfied.
                    </li>

                </ul>

                <LegalNotice
                    type="success"
                    title="Escrow Protection"
                >

                    Escrow protects both clients and freelancers by ensuring
                    that payment is only released after services have been
                    completed and approved under the platform's policies.

                </LegalNotice>

            </LegalSection>

            <LegalSection title="4. Disputes">

                <p>
                    If a disagreement arises regarding service quality,
                    completion status, payment, or booking details,
                    either party may submit a dispute to NARP Support.
                </p>

                <p className="mt-4">
                    During an investigation, NARP may:
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6">

                    <li>Temporarily hold escrow funds.</li>

                    <li>Request additional evidence from either party.</li>

                    <li>Review booking records and platform communications.</li>

                    <li>Determine an appropriate resolution.</li>

                </ul>

                <LegalNotice
                    type="warning"
                    title="Important Notice"
                >

                    Funds associated with an active dispute may remain
                    temporarily frozen until the investigation has been
                    completed.

                </LegalNotice>

            </LegalSection>

            <LegalSection title="5. Platform Fees">

                <p>
                    NARP may deduct applicable platform fees, service fees,
                    payment processing fees, or other disclosed charges
                    before releasing escrow funds to a freelancer's wallet.
                </p>

                <p className="mt-4">
                    Whenever possible, applicable fees will be displayed
                    before payment is completed.
                </p>

            </LegalSection>

            <LegalSection title="6. NARP Wallet">

                <p>
                    Once escrow funds have been released, the approved
                    amount will be credited to the freelancer's
                    NARP Wallet.
                </p>

                <p className="mt-4">
                    Wallet balances may be withdrawn in accordance with
                    the NARP Withdrawal Policy and any applicable
                    verification requirements.
                </p>

            </LegalSection>

            <LegalSection title="7. Changes to this Policy">

                <p>
                    NARP reserves the right to modify or update this
                    Escrow Policy at any time.
                </p>

                <p className="mt-4">
                    Any updates become effective once the revised version
                    is published on the NARP platform or website.
                </p>

            </LegalSection>

            <LegalSection title="8. Contact">

                <p>
                    If you have questions about escrow, payments,
                    disputes, or wallet balances, please contact us.
                </p>

                <LegalContactBox
                    title="Escrow Support"
                    email="narp290619@gmail.com"
                />

            </LegalSection>

            <LegalSection title="Acknowledgement">

                <p>
                    By accessing or using NARP, you acknowledge that
                    you have read, understood, and agree to this
                    Escrow Policy.
                </p>

            </LegalSection>

            <RelatedPolicies
                current="/legal/escrow"
            />

        </LegalLayout>

    );

}