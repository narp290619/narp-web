import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpNotice from "@/components/help/HelpNotice";
import HelpSection from "@/components/help/HelpSection";

export const metadata = {
    title: "Account & Profile | Help Center | NARP",
    description:
        "Learn how to create, manage, verify, and secure your NARP account.",
};

export default function AccountHelpPage() {
    return (
        <HelpArticleLayout
            title="Account & Profile"
            description="Everything you need to know about creating, managing, and securing your NARP account."
            currentArticle="/help/account"
        >
            <HelpSection title="Creating an Account">
                <p>
                    Creating a NARP account only takes a few minutes.
                </p>

                <ol>
                    <li>Download the NARP app.</li>
                    <li>Create a new account.</li>
                    <li>Verify your email address.</li>
                    <li>Complete your profile information.</li>
                    <li>Start booking services or offering your skills.</li>
                </ol>
            </HelpSection>

            <HelpSection title="Keeping Your Profile Updated">
                <p>
                    Keeping your profile accurate helps improve trust and makes
                    it easier for other users to interact with you.
                </p>

                <ul>
                    <li>Update your profile photo.</li>
                    <li>Edit your contact information.</li>
                    <li>Change your address or service location.</li>
                    <li>Manage your notification preferences.</li>
                    <li>Keep your personal details current.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="info"
                title="Verified Profiles"
            >
                Verified freelancers are generally more trusted by clients.
                Completing identity verification may unlock additional platform
                features and improve credibility.
            </HelpNotice>

            <HelpSection title="Identity Verification">
                <p>
                    Some features require identity verification to help keep
                    the NARP community safe.
                </p>

                <ul>
                    <li>Government-issued ID.</li>
                    <li>Profile photo verification.</li>
                    <li>Additional verification when required.</li>
                </ul>

                <p>
                    Verification requests are reviewed by the NARP team before
                    approval.
                </p>
            </HelpSection>

            <HelpSection title="Changing Your Password">
                <p>
                    If you know your current password, you can change it from
                    your account settings.
                </p>

                <p>
                    If you've forgotten your password, use the "Forgot Password"
                    option on the sign-in screen to receive a password reset
                    email.
                </p>
            </HelpSection>

            <HelpSection title="Managing Notifications">
                <p>
                    You can control which notifications you receive from NARP.
                </p>

                <ul>
                    <li>Booking updates.</li>
                    <li>Messages.</li>
                    <li>Payment notifications.</li>
                    <li>Promotions and announcements.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="success"
                title="Protect Your Account"
            >
                Always use a strong password and never share your login
                credentials with anyone. NARP Support will never ask for your
                password.
            </HelpNotice>

            <HelpSection title="Deleting Your Account">
                <p>
                    If you no longer wish to use NARP, you may request account
                    deletion through your account settings or by contacting
                    NARP Support.
                </p>

                <ul>
                    <li>Your account may be permanently deleted.</li>
                    <li>Certain information may be retained as required by law.</li>
                    <li>Completed transaction records may remain for compliance purposes.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="warning"
                title="Before Deleting Your Account"
            >
                Please ensure you have completed all active bookings,
                withdrawals, and ongoing disputes before requesting account
                deletion. Requests may be delayed until outstanding
                transactions are resolved.
            </HelpNotice>

            <HelpSection title="Need More Help?">
                <p>
                    If you're unable to sign in, verify your account, or update
                    your profile, please contact NARP Support. Include your
                    registered email address and any relevant screenshots to
                    help us assist you more quickly.
                </p>
            </HelpSection>
        </HelpArticleLayout>
    );
}