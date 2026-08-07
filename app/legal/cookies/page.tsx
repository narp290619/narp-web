import Container from "@/components/shared/Container";
import PageContainer from "@/components/shared/PageContainer";

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold text-green-700">
                {title}
            </h2>

            <div className="space-y-4 leading-8 text-slate-700">
                {children}
            </div>
        </section>
    );
}

export default function CookiePolicyPage() {
    return (
        <PageContainer>

            <Container className="max-w-5xl py-16">

                {/* Hero */}

                <section className="mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-16 text-center text-white">

                    <div className="mx-auto max-w-4xl text-center">

                        <div className="mb-5 text-6xl">
                            🍪
                        </div>

                        <h1 className="text-5xl font-extrabold">
                            Cookie Policy
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-blue-100">
                            This Cookie Policy explains how NARP (Nearby App for
                            Reliable Professionals) uses cookies and similar
                            technologies when you visit our website.
                        </p>

                        <div className="mt-6 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
                            Effective Date: August 6, 2026
                        </div>

                    </div>

                </section>

                <div className="mx-auto max-w-5xl space-y-6">

                    <Section title="1. What Are Cookies?">

                        <p>
                            Cookies are small text files stored on your device
                            when you visit a website. They help websites
                            remember information about your visit, improve
                            functionality, and provide a better browsing
                            experience.
                        </p>

                        <p>
                            Similar technologies such as local storage,
                            session storage, and browser storage may also
                            be used for similar purposes.
                        </p>

                    </Section>

                    <Section title="2. How NARP Uses Cookies">

                        <p>
                            NARP uses cookies and similar technologies to
                            improve website performance, maintain security,
                            and enhance your browsing experience.
                        </p>

                        <p>
                            Cookies may be used to:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Keep users securely signed in.</li>
                            <li>Remember website preferences and settings.</li>
                            <li>Improve website performance and reliability.</li>
                            <li>Protect against fraudulent activity.</li>
                            <li>Analyze website usage and visitor trends.</li>
                        </ul>

                    </Section>

                    <Section title="3. Types of Cookies We Use">

                        <div>

                            <h3 className="font-semibold text-slate-900">
                                Essential Cookies
                            </h3>

                            <p>
                                These cookies are necessary for the website to
                                function correctly. They support authentication,
                                security, navigation, and other core features.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-slate-900">
                                Preference Cookies
                            </h3>

                            <p>
                                These cookies remember your preferences,
                                such as language selection and other
                                personalized settings.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-slate-900">
                                Analytics Cookies
                            </h3>

                            <p>
                                These cookies help us understand how visitors
                                interact with the website so we can improve
                                usability, performance, and user experience.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-semibold text-slate-900">
                                Functional Cookies
                            </h3>

                            <p>
                                Functional cookies enable enhanced website
                                features such as remembering previously entered
                                information and improving navigation.
                            </p>

                        </div>

                    </Section>

                    <Section title="4. Third-Party Cookies">

                        <p>
                            Certain features of the NARP website rely on
                            trusted third-party services that may use their
                            own cookies or similar technologies.
                        </p>

                        <p>
                            These services may include:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Firebase Authentication</li>
                            <li>Google Maps</li>
                            <li>Google Analytics (if enabled)</li>
                            <li>Embedded videos or social media integrations</li>
                            <li>Payment providers used during transactions</li>
                        </ul>

                        <p>
                            These third parties manage their own cookies
                            according to their respective privacy policies.
                        </p>

                    </Section>

                    <Section title="5. Managing Cookies">

                        <p>
                            Most web browsers allow you to manage, block,
                            or delete cookies through your browser settings.
                        </p>

                        <p>
                            You may choose to disable cookies at any time.
                            However, doing so may affect certain website
                            features and functionality.
                        </p>

                        <div className="rounded-xl border-l-4 border-orange-500 bg-orange-50 p-5">

                            <h3 className="font-semibold text-orange-700">
                                Important Notice
                            </h3>

                            <p className="mt-3">
                                Disabling essential cookies may prevent
                                certain parts of the NARP website from
                                functioning correctly, including user login,
                                account management, and secure features.
                            </p>

                        </div>

                    </Section>

                    <Section title="6. Changes to This Cookie Policy">

                        <p>
                            We may update this Cookie Policy from time to
                            time to reflect changes in technology,
                            applicable laws, or improvements to our
                            services.
                        </p>

                        <p>
                            Updated versions will be published on this page
                            together with the revised Effective Date.
                        </p>

                    </Section>

                    <Section title="7. Contact Us">

                        <p>
                            If you have any questions regarding this Cookie
                            Policy or our use of cookies, please contact us.
                        </p>

                        <div className="mt-6 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5">

                            <h3 className="font-semibold text-blue-700">
                                NARP Support
                            </h3>

                            <p className="mt-3">
                                📧 support@narp-svc.site
                            </p>

                        </div>

                    </Section>

                    <Section title="Acknowledgement">

                        <p>
                            By continuing to use the NARP website, you
                            acknowledge that you have read and understood
                            this Cookie Policy and consent to the use of
                            cookies and similar technologies as described
                            herein, subject to your browser settings and
                            applicable laws.
                        </p>

                    </Section>

                    <div className="pt-6 text-center text-sm text-slate-500">

                        © 2026 NARP — Nearby App for Reliable Professionals

                    </div>

                </div>

            </Container>

        </PageContainer>
    );
}