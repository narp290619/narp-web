import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpNotice from "@/components/help/HelpNotice";
import HelpSection from "@/components/help/HelpSection";

export const metadata = {
    title: "Safety & Security | Help Center | NARP",
    description:
        "Learn how NARP helps keep clients and freelancers safe before, during, and after every booking.",
};

export default function SafetyHelpPage() {
    return (
        <HelpArticleLayout
            title="Safety & Security"
            description="Learn how to protect yourself and make every booking on NARP as safe and secure as possible."
            currentArticle="/help/safety"
        >
            <HelpSection title="Our Commitment to Safety">
                <p>
                    NARP is committed to providing a safe and trusted marketplace
                    where clients and freelancers can confidently connect.
                </p>

                <p>
                    While no online platform can eliminate every risk, we use
                    verification, secure payments, and reporting tools to help
                    protect our community.
                </p>
            </HelpSection>

            <HelpSection title="Choose Verified Freelancers">
                <p>
                    Whenever possible, book freelancers who have completed
                    identity verification and have a strong history of
                    successful bookings.
                </p>

                <ul>
                    <li>Review ratings and reviews.</li>
                    <li>Check completed jobs.</li>
                    <li>Read profile information carefully.</li>
                    <li>Verify skills and experience.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="success"
                title="Use NARP Payments"
            >
                Always pay through the NARP platform. Payments made outside
                NARP are not protected by our escrow system and may not qualify
                for refunds or dispute assistance.
            </HelpNotice>

            <HelpSection title="Protect Your Personal Information">
                <p>
                    Be careful when sharing personal or financial information.
                </p>

                <ul>
                    <li>Never share your password.</li>
                    <li>Do not send OTP or verification codes.</li>
                    <li>Avoid sharing unnecessary personal documents.</li>
                    <li>Keep conversations within the NARP platform whenever possible.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Recognizing Suspicious Activity">
                <p>
                    Stop communicating and report the user if you notice any of
                    the following:
                </p>

                <ul>
                    <li>Requests to pay outside NARP.</li>
                    <li>Fake payment confirmations.</li>
                    <li>Pressure to act immediately.</li>
                    <li>Requests for passwords or verification codes.</li>
                    <li>Suspicious links or downloads.</li>
                    <li>Impersonation of NARP staff.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="warning"
                title="Never Leave the Platform"
            >
                Fraudsters often encourage users to continue conversations
                through other messaging apps or request direct payments.
                Staying within NARP provides better protection for everyone.
            </HelpNotice>

            <HelpSection title="Meeting for In-Person Services">
                <p>
                    If your booking requires meeting in person, consider the
                    following safety practices:
                </p>

                <ul>
                    <li>Meet at the agreed location.</li>
                    <li>Inform a trusted friend or family member.</li>
                    <li>Keep your phone charged.</li>
                    <li>Trust your instincts if something feels unsafe.</li>
                    <li>Cancel the booking if you feel uncomfortable.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Reporting a User">
                <p>
                    If another user violates NARP policies or behaves
                    inappropriately, report them immediately.
                </p>

                <ul>
                    <li>Open the user's profile.</li>
                    <li>Select the Report option.</li>
                    <li>Choose the appropriate reason.</li>
                    <li>Include supporting details or screenshots.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Account Security">
                <p>
                    Protect your account by following these best practices:
                </p>

                <ul>
                    <li>Create a strong password.</li>
                    <li>Use a unique password for NARP.</li>
                    <li>Keep your email account secure.</li>
                    <li>Sign out from shared devices.</li>
                    <li>Update your password if you suspect unauthorized access.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="info"
                title="Our Safety Team"
            >
                Reports submitted through NARP are reviewed by our moderation
                team. Depending on the situation, we may investigate, request
                additional information, restrict accounts, or take appropriate
                enforcement action in accordance with our Community Guidelines
                and Acceptable Use Policy.
            </HelpNotice>

            <HelpSection title="Emergency Situations">
                <p>
                    NARP is not an emergency service.
                </p>

                <p>
                    If you are in immediate danger or require urgent assistance,
                    contact your local emergency services before contacting
                    NARP Support.
                </p>
            </HelpSection>

            <HelpSection title="Need More Help?">
                <p>
                    If you believe your account has been compromised or you've
                    encountered suspicious activity, please contact NARP Support
                    as soon as possible. The sooner we receive your report, the
                    faster we can investigate and help protect your account.
                </p>
            </HelpSection>
        </HelpArticleLayout>
    );
}