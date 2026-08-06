import Container from "@/components/shared/Container";
import PageContainer from "@/components/shared/PageContainer";

export default function PrivacyPage() {
    return (
        <PageContainer>
            <Container className="max-w-5xl py-16">

                {/* Hero */}

                <section className="mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-16 text-center text-white">

                    <div className="mb-4 text-6xl">
                        🔒
                    </div>

                    <h1 className="text-5xl font-extrabold">
                        Privacy Policy
                    </h1>

                    <p className="mt-4 text-lg text-blue-100">
                        NARP (Nearby App for Reliable Professionals)
                    </p>

                    <div className="mt-6 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
                        Effective Date: August 6, 2026
                    </div>

                </section>

                <div className="space-y-8">

                    {/* Introduction */}

                    <section className="rounded-3xl bg-white p-8 shadow-sm">

                        <h2 className="mb-4 text-2xl font-bold text-green-700">
                            1. Introduction
                        </h2>

                        <p className="leading-8 text-slate-600">
                            NARP values your privacy and is committed to protecting
                            your personal information. This Privacy Policy explains
                            how we collect, use, store, disclose, and safeguard
                            your information when you use the NARP mobile
                            application and website.
                        </p>

                        <p className="mt-4 leading-8 text-slate-600">
                            By accessing or using NARP, you agree to the
                            practices described in this Privacy Policy.
                        </p>

                    </section>

                    {/* Information */}

                    <section className="rounded-3xl bg-white p-8 shadow-sm">

                        <h2 className="mb-5 text-2xl font-bold text-green-700">
                            2. Information We Collect
                        </h2>

                        <h3 className="mb-3 text-lg font-semibold">
                            Personal Information
                        </h3>

                        <ul className="list-disc space-y-2 pl-6 text-slate-600">
                            <li>Full name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Profile photo</li>
                            <li>Verification documents</li>
                            <li>Location information</li>
                        </ul>

                        <h3 className="mt-8 mb-3 text-lg font-semibold">
                            Usage Information
                        </h3>

                        <ul className="list-disc space-y-2 pl-6 text-slate-600">
                            <li>Device information</li>
                            <li>Operating system</li>
                            <li>IP address</li>
                            <li>Pages visited</li>
                            <li>Application activity</li>
                        </ul>

                        <h3 className="mt-8 mb-3 text-lg font-semibold">
                            Payment Information
                        </h3>

                        <p className="leading-8 text-slate-600">
                            Payments are processed through trusted third-party
                            payment providers. NARP does not store complete
                            credit or debit card information.
                        </p>

                    </section>

                    {/* How We Use */}

                    <section className="rounded-3xl bg-white p-8 shadow-sm">

                        <h2 className="mb-5 text-2xl font-bold text-green-700">
                            3. How We Use Your Information
                        </h2>

                        <ul className="list-disc space-y-2 pl-6 text-slate-600">

                            <li>Create and manage user accounts</li>

                            <li>Verify user identity</li>

                            <li>Match clients with nearby professionals</li>

                            <li>Process bookings and payments</li>

                            <li>Provide customer support</li>

                            <li>Improve platform performance</li>

                            <li>Detect fraud and abuse</li>

                            <li>Maintain platform security</li>

                        </ul>

                    </section>

                    {/* AI */}

                    <section className="rounded-3xl border border-blue-200 bg-blue-50 p-8">

                        <h2 className="mb-5 text-2xl font-bold text-blue-700">
                            4. AI Features
                        </h2>

                        <p className="leading-8 text-slate-700">

                            NARP may use artificial intelligence (AI) to assist
                            users with service discovery, recommendations,
                            search results, and automated suggestions.

                        </p>

                        <p className="mt-4 leading-8 text-slate-700">

                            AI-generated recommendations are intended to assist
                            users and should not be considered guarantees or
                            professional advice.

                        </p>

                    </section>

                    {/* Firebase */}

                    <section className="rounded-3xl bg-white p-8 shadow-sm">

                        <h2 className="mb-5 text-2xl font-bold text-green-700">
                            5. Third-Party Services
                        </h2>

                        <p className="leading-8 text-slate-600">

                            NARP uses trusted third-party service providers,
                            including cloud infrastructure, authentication,
                            push notifications, analytics, mapping services,
                            and payment processors, to operate the platform.

                        </p>

                        <p className="mt-4 leading-8 text-slate-600">

                            These providers process information only as
                            necessary to provide their services.

                        </p>

                    </section>

                    {/* Security */}

                    <section className="rounded-3xl bg-green-50 border border-green-200 p-8">

                        <h2 className="mb-5 text-2xl font-bold text-green-700">
                            6. Data Security
                        </h2>

                        <p className="leading-8 text-slate-700">

                            NARP uses industry-standard security measures,
                            encrypted communications, secure authentication,
                            and cloud infrastructure to help protect your
                            information.

                        </p>

                        <p className="mt-4 leading-8 text-slate-700">

                            While we strive to protect your information,
                            no method of electronic transmission or storage
                            is completely secure.

                        </p>

                    </section>

                    {/* Rights */}

                    <section className="rounded-3xl bg-white p-8 shadow-sm">

                        <h2 className="mb-5 text-2xl font-bold text-green-700">
                            7. Your Rights
                        </h2>

                        <ul className="list-disc space-y-2 pl-6 text-slate-600">

                            <li>Access your personal information</li>

                            <li>Update your profile</li>

                            <li>Request account deletion</li>

                            <li>Contact us regarding privacy concerns</li>

                        </ul>

                    </section>

                    {/* Children */}

                    <section className="rounded-3xl border border-yellow-200 bg-yellow-50 p-8">

                        <h2 className="mb-5 text-2xl font-bold text-yellow-700">
                            8. Children's Privacy
                        </h2>

                        <p className="leading-8 text-slate-700">

                            NARP is intended for users who meet the minimum age
                            required under applicable laws. We do not knowingly
                            collect personal information from children without
                            appropriate authorization.

                        </p>

                    </section>

                    {/* Contact */}

                    <section className="rounded-3xl bg-blue-50 border border-blue-200 p-8">

                        <h2 className="mb-5 text-2xl font-bold text-blue-700">
                            9. Contact Us
                        </h2>

                        <p className="leading-8 text-slate-700">

                            If you have questions about this Privacy Policy,
                            please contact us.

                        </p>

                        <div className="mt-6 rounded-2xl bg-white p-6">

                            <p className="font-semibold">
                                NARP Support
                            </p>

                            <a
                                href="mailto:support@narp-svc.site"
                                className="mt-2 inline-block text-blue-600 hover:underline"
                            >
                                support@narp-svc.site
                            </a>

                        </div>

                    </section>

                    {/* Acknowledgement */}

                    <section className="rounded-3xl bg-white p-8 shadow-sm">

                        <h2 className="mb-4 text-2xl font-bold text-green-700">
                            Acknowledgement
                        </h2>

                        <p>
                            By accessing or using NARP, you acknowledge that you have read,
                            understood, and agree to be bound by these Terms of Use.
                        </p>
                    </section>

                    {/* Footer */}

                    <div className="pt-6 text-center text-sm text-slate-500">

                        © {new Date().getFullYear()} NARP — Nearby App for Reliable Professionals

                    </div>

                </div>

            </Container>
        </PageContainer>
    );
}