import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpSection from "@/components/help/HelpSection";
import HelpNotice from "@/components/help/HelpNotice";

export const metadata = {
    title: "Mobile App | NARP Help Center",
    description:
        "Learn how to install, update, and troubleshoot the NARP mobile application.",
};

const tocItems = [
    {
        id: "getting-app",
        title: "Getting the NARP App",
    },
    {
        id: "installation",
        title: "Installing the App",
    },
    {
        id: "updates",
        title: "App Updates",
    },
    {
        id: "permissions",
        title: "App Permissions",
    },
    {
        id: "troubleshooting",
        title: "Troubleshooting",
    },
    {
        id: "support",
        title: "Getting Support",
    },
];

export default function MobileAppHelpPage() {
    return (
        <HelpArticleLayout
            title="Mobile App"
            description="Learn how to install and use the NARP mobile application and troubleshoot common app issues."
            currentArticle="mobile-app"
            tocItems={tocItems}
        >
            <div className="space-y-10">

                <HelpSection
                    id="getting-app"
                    title="Getting the NARP App"
                >
                    <p>
                        The NARP mobile application provides access to
                        platform features such as service discovery,
                        bookings, messaging, account management, and other
                        available functionality.
                    </p>

                    <p>
                        Download NARP only through official app distribution
                        channels provided by NARP.
                    </p>
                </HelpSection>

                <HelpSection
                    id="installation"
                    title="Installing the App"
                >
                    <p>
                        To install NARP, open the official app store available
                        on your device and search for NARP.
                    </p>

                    <p>
                        Follow the store's installation instructions and open
                        the application after installation is complete.
                    </p>

                    <HelpNotice type="warning">
                        Avoid downloading NARP from unofficial websites or
                        third-party APK sources.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="updates"
                    title="App Updates"
                >
                    <p>
                        Keeping the NARP application updated helps ensure that
                        you have access to the latest features, security
                        improvements, and bug fixes.
                    </p>

                    <p>
                        Enable automatic updates where supported by your
                        device, or periodically check the applicable app
                        store for updates.
                    </p>
                </HelpSection>

                <HelpSection
                    id="permissions"
                    title="App Permissions"
                >
                    <p>
                        Some NARP features may require access to device
                        permissions such as location, camera, notifications,
                        or other device functionality.
                    </p>

                    <p>
                        Permissions are requested when required by a feature.
                        You can manage application permissions through your
                        device settings.
                    </p>
                </HelpSection>

                <HelpSection
                    id="troubleshooting"
                    title="Troubleshooting"
                >
                    <p>
                        If the NARP app is not working correctly, try the
                        following:
                    </p>

                    <ol>
                        <li>Check your internet connection.</li>
                        <li>Close and reopen the application.</li>
                        <li>Restart your device.</li>
                        <li>Check for available app updates.</li>
                        <li>Make sure your device has sufficient storage.</li>
                    </ol>

                    <HelpNotice type="info">
                        If the problem continues after basic troubleshooting,
                        contact NARP Support with details about the issue and
                        your device.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="support"
                    title="Getting Support"
                >
                    <p>
                        If you continue experiencing problems with the NARP
                        application, contact NARP Support.
                    </p>

                    <p>
                        When contacting support, include the relevant error
                        message, the feature you were using, and any other
                        information that may help us understand the issue.
                    </p>
                </HelpSection>

            </div>
        </HelpArticleLayout>
    );
}