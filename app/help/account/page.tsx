import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpSection from "@/components/help/HelpSection";
import HelpNotice from "@/components/help/HelpNotice";

export const metadata = {
    title: "Account | NARP Help Center",
    description:
        "Learn how to create, manage, verify, secure, and delete your NARP account.",
};

const tocItems = [
    {
        id: "creating-account",
        title: "Creating an Account",
    },
    {
        id: "profile",
        title: "Managing Your Profile",
    },
    {
        id: "verification",
        title: "Identity Verification",
    },
    {
        id: "security",
        title: "Account Security",
    },
    {
        id: "password",
        title: "Password and Login",
    },
    {
        id: "deletion",
        title: "Deleting Your Account",
    },
];

export default function AccountHelpPage() {
    return (
        <HelpArticleLayout
            title="Account"
            description="Learn how to create and manage your NARP account, complete verification, protect your account, and update your profile."
            currentArticle="account"
            tocItems={tocItems}
        >
            <div className="space-y-10">

                <HelpSection
                    id="creating-account"
                    title="Creating an Account"
                >
                    <p>
                        To use NARP, you may need to create an account using
                        the registration options provided in the application
                        or website.
                    </p>

                    <p>
                        Provide accurate information when creating your
                        account. Some features may require additional
                        verification.
                    </p>
                </HelpSection>

                <HelpSection
                    id="profile"
                    title="Managing Your Profile"
                >
                    <p>
                        Your profile contains information that helps other
                        users understand who you are and, where applicable,
                        what services you provide.
                    </p>

                    <p>
                        Depending on your account type, you may be able to
                        update information such as:
                    </p>

                    <ul>
                        <li>Name and profile information</li>
                        <li>Profile photo</li>
                        <li>Contact information</li>
                        <li>Service-related information</li>
                        <li>Other account preferences</li>
                    </ul>
                </HelpSection>

                <HelpSection
                    id="verification"
                    title="Identity Verification"
                >
                    <p>
                        NARP may require users, particularly freelancers, to
                        complete identity verification before accessing
                        certain features.
                    </p>

                    <p>
                        Verification may involve submitting information or
                        documents necessary to confirm your identity.
                    </p>

                    <HelpNotice type="warning">
                        Never submit identity documents through unofficial
                        NARP channels or directly to another user.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="security"
                    title="Account Security"
                >
                    <p>
                        You are responsible for keeping your account
                        credentials secure.
                    </p>

                    <ul>
                        <li>Use a strong and unique password.</li>
                        <li>Do not share your login credentials.</li>
                        <li>Do not share authentication codes.</li>
                        <li>Be cautious of suspicious messages or links.</li>
                        <li>Contact NARP if you suspect unauthorized access.</li>
                    </ul>
                </HelpSection>

                <HelpSection
                    id="password"
                    title="Password and Login"
                >
                    <p>
                        If you cannot access your account, use the available
                        password recovery or authentication options provided
                        by NARP.
                    </p>

                    <HelpNotice type="info">
                        If you believe someone has accessed your account
                        without authorization, contact NARP Support as soon
                        as possible.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="deletion"
                    title="Deleting Your Account"
                >
                    <p>
                        You may request deletion of your NARP account through
                        the available account settings or support channels.
                    </p>

                    <p>
                        Certain information may need to be retained when
                        required by law, legitimate business requirements,
                        fraud prevention, dispute resolution, or other
                        applicable obligations.
                    </p>
                </HelpSection>

            </div>
        </HelpArticleLayout>
    );
}