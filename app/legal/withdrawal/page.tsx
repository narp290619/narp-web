import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import LegalNotice from "@/components/legal/LegalNotice";
import LegalContactBox from "@/components/legal/LegalContactBox";
import RelatedPolicies from "@/components/legal/RelatedPolicies";

export const metadata = {
    title: "Withdrawal Policy | NARP",
    description:
        "Learn how freelancers can withdraw earnings from their NARP Wallet, including eligibility, processing times, verification requirements, and withdrawal limitations.",
};

export default function WithdrawalPolicyPage() {

    return (

        <LegalLayout
            title="Withdrawal Policy"
            description="This Withdrawal Policy explains how freelancers can withdraw earnings from their NARP Wallet, including eligibility, processing requirements, and security measures."
            effectiveDate="May 9, 2026"
            lastUpdated="May 9, 2026"
        >

            <LegalSection title="1. Eligibility">

                <p>
                    Freelancers may withdraw available wallet balances earned
                    through successfully completed services on the NARP platform.
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6">

                    <li>
                        Only available wallet balances may be withdrawn.
                    </li>

                    <li>
                        Funds currently held in escrow cannot be withdrawn.
                    </li>

                    <li>
                        Withdrawal requests must comply with all applicable
                        NARP policies.
                    </li>

                </ul>

            </LegalSection>

            <LegalSection title="2. Withdrawal Methods">

                <p>
                    NARP currently supports the following withdrawal method:
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6">

                    <li>GCash</li>

                </ul>

                <p className="mt-4">
                    Additional withdrawal methods may become available as the
                    platform expands.
                </p>

            </LegalSection>

            <LegalSection title="3. Minimum Withdrawal">

                <p>
                    The current minimum withdrawal amount is:
                </p>

                <LegalNotice
                    type="success"
                    title="Minimum Withdrawal"
                >

                    ₱100.00

                </LegalNotice>

                <p className="mt-4">
                    Withdrawal requests below the minimum amount may not
                    be processed.
                </p>

            </LegalSection>

            <LegalSection title="4. Withdrawal Review">

                <p>
                    All withdrawal requests are reviewed by NARP before approval.
                </p>

                <p className="mt-4">
                    During the review process, NARP may:
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6">

                    <li>Verify account information.</li>

                    <li>Confirm available wallet balances.</li>

                    <li>Review transactions for suspicious activity.</li>

                </ul>

            </LegalSection>

            <LegalSection title="5. Processing Time">

                <p>
                    Most approved withdrawal requests are processed within:
                </p>

                <LegalNotice
                    type="warning"
                    title="Typical Processing Time"
                >

                    <ul className="list-disc pl-6">

                        <li>1–3 business days</li>

                        <li>
                            Processing times may vary depending on payment
                            provider availability, weekends, public holidays,
                            or additional verification requirements.
                        </li>

                    </ul>

                </LegalNotice>

            </LegalSection>

            <LegalSection title="6. Identity Verification">

                <p>
                    To help protect users and reduce fraud, NARP may require
                    identity verification before approving a withdrawal.
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6">

                    <li>Government-issued identification.</li>

                    <li>Account ownership verification.</li>

                    <li>Additional supporting documents when necessary.</li>

                </ul>

            </LegalSection>

            <LegalSection title="7. Fraud Prevention">

                <p>
                    NARP reserves the right to protect the platform and its
                    users from fraudulent or suspicious activities.
                </p>

                <p className="mt-4">
                    Depending on the circumstances, NARP may:
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6">

                    <li>Delay withdrawal requests for security review.</li>

                    <li>Request additional verification documents.</li>

                    <li>Reject suspicious withdrawal requests.</li>

                    <li>
                        Suspend or restrict accounts involved in fraudulent
                        activity.
                    </li>

                </ul>

            </LegalSection>

            <LegalSection title="8. Withdrawal Limitations">

                <p>
                    Withdrawal requests may be delayed, restricted, or denied
                    under the following circumstances:
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6">

                    <li>An active dispute is under investigation.</li>

                    <li>Escrow funds have not yet been released.</li>

                    <li>Required identity verification is incomplete.</li>

                    <li>The account violates NARP policies.</li>

                </ul>

            </LegalSection>

            <LegalSection title="9. Changes to this Policy">

                <p>
                    NARP reserves the right to modify or update this
                    Withdrawal Policy at any time.
                </p>

                <p className="mt-4">
                    Updated versions become effective once published on the
                    NARP website or platform.
                </p>

            </LegalSection>

            <LegalSection title="10. Contact">

                <p>
                    If you have questions regarding withdrawals,
                    wallet balances, verification, or payment processing,
                    please contact our support team.
                </p>

                <LegalContactBox
                    title="Withdrawal Support"
                    email="narp290619@gmail.com"
                />

            </LegalSection>

            <LegalSection title="Acknowledgement">

                <p>
                    By accessing or using NARP, you acknowledge that you
                    have read, understood, and agree to this Withdrawal
                    Policy.
                </p>

            </LegalSection>

            <RelatedPolicies
                current="/legal/withdrawal"
            />

        </LegalLayout>

    );

}