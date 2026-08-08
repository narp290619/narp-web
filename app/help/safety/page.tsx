import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpSection from "@/components/help/HelpSection";
import HelpNotice from "@/components/help/HelpNotice";

export const metadata = {
    title: "Safety | NARP Help Center",
    description:
        "Learn how to stay safe when using NARP, communicate securely, identify suspicious activity, and report problems.",
};

const tocItems = [
    {
        id: "staying-safe",
        title: "Staying Safe",
    },
    {
        id: "communication",
        title: "Safe Communication",
    },
    {
        id: "payments",
        title: "Payment Safety",
    },
    {
        id: "fraud",
        title: "Fraud and Scams",
    },
    {
        id: "reporting",
        title: "Reporting a Problem",
    },
    {
        id: "emergency",
        title: "Emergency Situations",
    },
];

export default function SafetyHelpPage() {
    return (
        <HelpArticleLayout
            title="Safety"
            description="Learn how to protect yourself, your account, and your transactions when using NARP."
            currentArticle="safety"
            tocItems={tocItems}
        >
            <div className="space-y-10">

                <HelpSection
                    id="staying-safe"
                    title="Staying Safe"
                >
                    <p>
                        NARP is designed to help clients and freelancers
                        connect, but users should always take reasonable
                        precautions when interacting with people online and
                        in person.
                    </p>

                    <ul>
                        <li>Review profiles and ratings carefully.</li>
                        <li>Keep communication within NARP when possible.</li>
                        <li>Use the NARP payment process for eligible bookings.</li>
                        <li>Do not share sensitive account information.</li>
                    </ul>
                </HelpSection>

                <HelpSection
                    id="communication"
                    title="Safe Communication"
                >
                    <p>
                        Keep important booking and service-related
                        conversations within the NARP platform.
                    </p>

                    <p>
                        Be cautious if another user asks you to move a
                        transaction outside NARP or requests sensitive
                        information.
                    </p>

                    <HelpNotice type="warning">
                        NARP Support will never ask you for your password or
                        authentication codes.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="payments"
                    title="Payment Safety"
                >
                    <p>
                        Use the supported NARP payment process when completing
                        transactions through the platform.
                    </p>

                    <p>
                        Do not send money directly to another user if the
                        booking is supposed to be processed through NARP.
                    </p>

                    <HelpNotice type="warning">
                        Payments made outside NARP may not receive the same
                        protection provided by NARP's booking, escrow,
                        refund, and dispute processes.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="fraud"
                    title="Fraud and Scams"
                >
                    <p>
                        Contact NARP if you encounter suspicious behavior,
                        fraudulent activity, impersonation, or attempts to
                        bypass platform protections.
                    </p>

                    <p>
                        Examples may include:
                    </p>

                    <ul>
                        <li>Requests for payment outside NARP</li>
                        <li>Fake identity or impersonation</li>
                        <li>Suspicious payment requests</li>
                        <li>Requests for passwords or authentication codes</li>
                        <li>Attempts to obtain sensitive personal information</li>
                    </ul>
                </HelpSection>

                <HelpSection
                    id="reporting"
                    title="Reporting a Problem"
                >
                    <p>
                        If you encounter unsafe, abusive, fraudulent, or
                        suspicious behavior, report it through the available
                        NARP reporting or support channels.
                    </p>

                    <p>
                        Include as much relevant information as possible,
                        such as the account involved, booking information,
                        messages, screenshots, and other evidence.
                    </p>
                </HelpSection>

                <HelpSection
                    id="emergency"
                    title="Emergency Situations"
                >
                    <p>
                        NARP is not an emergency response service.
                    </p>

                    <p>
                        If you are experiencing an immediate threat to your
                        safety or believe a crime is occurring, contact the
                        appropriate local emergency services or law
                        enforcement authorities.
                    </p>
                </HelpSection>

            </div>
        </HelpArticleLayout>
    );
}