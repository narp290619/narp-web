import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpNotice from "@/components/help/HelpNotice";
import HelpSection from "@/components/help/HelpSection";

export const metadata = {
    title: "Using the Mobile App | Help Center | NARP",
    description:
        "Learn how to install, use, and get the most out of the NARP mobile application.",
};

export default function MobileAppHelpPage() {
    return (
        <HelpArticleLayout
            title="Using the Mobile App"
            description="Everything you need to know about installing, navigating, and using the NARP mobile application."
            currentArticle="/help/mobile-app"
        >
            <HelpSection title="Getting Started">
                <p>
                    The NARP mobile app allows clients and freelancers to
                    connect anytime, anywhere.
                </p>

                <ol>
                    <li>Download the NARP app.</li>
                    <li>Create or sign in to your account.</li>
                    <li>Complete your profile.</li>
                    <li>Enable location services.</li>
                    <li>Start booking services or offering your skills.</li>
                </ol>
            </HelpSection>

            <HelpSection title="Main Features">
                <p>
                    The NARP app is designed to make finding and providing
                    services simple and secure.
                </p>

                <ul>
                    <li>Browse available services.</li>
                    <li>Find nearby freelancers.</li>
                    <li>Book trusted professionals.</li>
                    <li>Secure escrow payments.</li>
                    <li>Real-time messaging.</li>
                    <li>Booking history.</li>
                    <li>Wallet and withdrawals.</li>
                    <li>Ratings and reviews.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="success"
                title="Enable Notifications"
            >
                Push notifications help you stay updated with booking requests,
                payments, messages, cancellations, and important account
                activity.
            </HelpNotice>

            <HelpSection title="Location Services">
                <p>
                    NARP uses your location to help you discover nearby
                    freelancers and improve search results.
                </p>

                <ul>
                    <li>Location access is optional.</li>
                    <li>You can update location permissions anytime.</li>
                    <li>Your location is handled according to our Privacy Policy.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Managing Your Profile">
                <p>
                    You can update your account information from the Profile
                    section of the app.
                </p>

                <ul>
                    <li>Edit your profile photo.</li>
                    <li>Update personal information.</li>
                    <li>Manage skills and services.</li>
                    <li>Configure notification preferences.</li>
                    <li>View verification status.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Keeping the App Updated">
                <p>
                    We recommend installing the latest version of NARP to enjoy
                    new features, security improvements, and bug fixes.
                </p>

                <ul>
                    <li>Enable automatic updates.</li>
                    <li>Download updates from the official app store.</li>
                    <li>Restart the app after major updates if needed.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="info"
                title="Supported Devices"
            >
                NARP supports modern Android and iOS devices. Some features may
                require newer operating system versions or device capabilities.
            </HelpNotice>

            <HelpSection title="Troubleshooting">
                <p>
                    If you encounter issues while using the app, try the
                    following:
                </p>

                <ul>
                    <li>Check your internet connection.</li>
                    <li>Restart the app.</li>
                    <li>Update to the latest version.</li>
                    <li>Restart your device.</li>
                    <li>Ensure required permissions are enabled.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Common Questions">
                <ul>
                    <li>How do I update my profile?</li>
                    <li>How do I change my password?</li>
                    <li>Why can't I receive notifications?</li>
                    <li>Why can't I see nearby freelancers?</li>
                    <li>How do I contact a freelancer?</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="warning"
                title="Download Only from Official Sources"
            >
                For your security, install NARP only from the official Google
                Play Store or Apple App Store. Avoid downloading APK files or
                modified versions from third-party websites.
            </HelpNotice>

            <HelpSection title="Need More Help?">
                <p>
                    If you're experiencing technical issues that aren't resolved
                    by the steps above, please contact NARP Support. Include
                    your device model, operating system version, app version,
                    and screenshots whenever possible to help us diagnose the
                    issue more quickly.
                </p>
            </HelpSection>
        </HelpArticleLayout>
    );
}