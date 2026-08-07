import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import LegalNotice from "@/components/legal/LegalNotice";
import LegalContactBox from "@/components/legal/LegalContactBox";
import RelatedPolicies from "@/components/legal/RelatedPolicies";
import LegalList from "@/components/legal/LegalList";

export const metadata = {
    title: "Cancellation Policy | NARP",
    description:
        "Learn how cancellations are handled for bookings made through NARP.",
};

export default function CancellationPolicyPage() {
    return (
        <LegalLayout
            title="Cancellation Policy"
            description="This Cancellation Policy explains how booking cancellations are handled for clients and freelancers using NARP."
            effectiveDate="May 9, 2026"
            lastUpdated="May 9, 2026"
            icon="❌"
        >
            <LegalSection title="1. Purpose">
                <p>
                    This Cancellation Policy establishes fair cancellation rules for
                    clients and freelancers using NARP (Nearby App for Reliable
                    Professionals). It aims to balance flexibility for users while
                    respecting the time and commitments of both parties.
                </p>
            </LegalSection>

            <LegalSection title="2. Before Freelancer Acceptance">
                <p>
                    Clients may cancel a booking at any time before a freelancer accepts
                    the request.
                </p>

                <LegalList
                    items={[
                        "No cancellation penalties apply.",
                        "Any authorized payment will be cancelled or refunded according to the Refund Policy.",
                    ]}
                />
            </LegalSection>

            <LegalSection title="3. After Freelancer Acceptance">
                <p>
                    Once a freelancer has accepted a booking, cancellation requests may
                    require review by NARP.
                </p>

                <LegalList
                    items={[
                        "The stage of the service.",
                        "Time already spent by the freelancer.",
                        "Communication between both parties.",
                        "Applicable Refund Policy.",
                    ]}
                />

                <LegalNotice type="warning" title="Important">
                    Cancelling after a freelancer has begun preparing or performing the
                    service may affect refund eligibility.
                </LegalNotice>
            </LegalSection>

            <LegalSection title="4. Freelancer Cancellation">
                <p>
                    Freelancers should only accept bookings they intend to complete.
                </p>

                <LegalList
                    items={[
                        "Freelancers should notify clients as soon as possible if they cannot fulfill a booking.",
                        "Repeated cancellations may affect account standing.",
                        "NARP may investigate excessive cancellation behavior.",
                    ]}
                />
            </LegalSection>

            <LegalSection title="5. Client Cancellation">
                <p>
                    Clients are encouraged to cancel bookings promptly if the service is
                    no longer required.
                </p>

                <LegalList
                    items={[
                        "Late cancellations may affect refund eligibility.",
                        "Frequent abuse of cancellations may result in account restrictions.",
                    ]}
                />
            </LegalSection>

            <LegalSection title="6. Force Majeure">
                <p>
                    Neither clients nor freelancers may be held responsible for
                    cancellations caused by circumstances beyond reasonable control,
                    including:
                </p>

                <LegalList
                    items={[
                        "Natural disasters",
                        "Government restrictions",
                        "Severe weather",
                        "Medical emergencies",
                        "Other unforeseen events",
                    ]}
                />
            </LegalSection>

            <LegalSection title="7. Related Policies">
                <p>
                    Cancellation requests may also be subject to the following policies:
                </p>

                <LegalList
                    items={[
                        "Refund Policy",
                        "Escrow Policy",
                        "Dispute Resolution Policy",
                    ]}
                />
            </LegalSection>

            <LegalSection title="8. Changes to this Policy">
                <p>
                    NARP may update this Cancellation Policy from time to time. Changes
                    become effective upon publication on the platform.
                </p>
            </LegalSection>

            <LegalSection title="9. Contact Us">
                <LegalContactBox
                    title="Cancellation Support"
                    email="narp290619@gmail.com"
                    website="https://www.narp-svc.site"
                    contactPage="/contact"
                    responseTime="We typically respond within 1–2 business days."
                />
            </LegalSection>

            <LegalSection title="Acknowledgement">
                <p>
                    By using NARP, you acknowledge that you have read, understood, and
                    agree to this Cancellation Policy.
                </p>
            </LegalSection>

            <RelatedPolicies current="/legal/cancellation" />
        </LegalLayout>
    );
}