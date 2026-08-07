// import Container from "@/components/shared/Container";
// import PageContainer from "@/components/shared/PageContainer";

// export default function PrivacyPage() {
//     return (
//         <PageContainer>
//             <Container className="max-w-5xl py-16">

//                 {/* Hero */}

//                 <section className="mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-16 text-center text-white">

//                     <div className="mb-4 text-6xl">
//                         🔒
//                     </div>

//                     <h1 className="text-5xl font-extrabold">
//                         Privacy Policy
//                     </h1>

//                     <p className="mt-4 text-lg text-blue-100">
//                         NARP (Nearby App for Reliable Professionals)
//                     </p>

//                     <div className="mt-6 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
//                         Effective Date: August 6, 2026
//                     </div>

//                 </section>

//                 <div className="space-y-8">

//                     {/* Introduction */}

//                     <section className="rounded-3xl bg-white p-8 shadow-sm">

//                         <h2 className="mb-4 text-2xl font-bold text-green-700">
//                             1. Introduction
//                         </h2>

//                         <p className="leading-8 text-slate-600">
//                             NARP values your privacy and is committed to protecting
//                             your personal information. This Privacy Policy explains
//                             how we collect, use, store, disclose, and safeguard
//                             your information when you use the NARP mobile
//                             application and website.
//                         </p>

//                         <p className="mt-4 leading-8 text-slate-600">
//                             By accessing or using NARP, you agree to the
//                             practices described in this Privacy Policy.
//                         </p>

//                     </section>

//                     {/* Information */}

//                     <section className="rounded-3xl bg-white p-8 shadow-sm">

//                         <h2 className="mb-5 text-2xl font-bold text-green-700">
//                             2. Information We Collect
//                         </h2>

//                         <h3 className="mb-3 text-lg font-semibold">
//                             Personal Information
//                         </h3>

//                         <ul className="list-disc space-y-2 pl-6 text-slate-600">
//                             <li>Full name</li>
//                             <li>Email address</li>
//                             <li>Phone number</li>
//                             <li>Profile photo</li>
//                             <li>Verification documents</li>
//                             <li>Location information</li>
//                         </ul>

//                         <h3 className="mt-8 mb-3 text-lg font-semibold">
//                             Usage Information
//                         </h3>

//                         <ul className="list-disc space-y-2 pl-6 text-slate-600">
//                             <li>Device information</li>
//                             <li>Operating system</li>
//                             <li>IP address</li>
//                             <li>Pages visited</li>
//                             <li>Application activity</li>
//                         </ul>

//                         <h3 className="mt-8 mb-3 text-lg font-semibold">
//                             Payment Information
//                         </h3>

//                         <p className="leading-8 text-slate-600">
//                             Payments are processed through trusted third-party
//                             payment providers. NARP does not store complete
//                             credit or debit card information.
//                         </p>

//                     </section>

//                     {/* How We Use */}

//                     <section className="rounded-3xl bg-white p-8 shadow-sm">

//                         <h2 className="mb-5 text-2xl font-bold text-green-700">
//                             3. How We Use Your Information
//                         </h2>

//                         <ul className="list-disc space-y-2 pl-6 text-slate-600">

//                             <li>Create and manage user accounts</li>

//                             <li>Verify user identity</li>

//                             <li>Match clients with nearby professionals</li>

//                             <li>Process bookings and payments</li>

//                             <li>Provide customer support</li>

//                             <li>Improve platform performance</li>

//                             <li>Detect fraud and abuse</li>

//                             <li>Maintain platform security</li>

//                         </ul>

//                     </section>

//                     {/* AI */}

//                     <section className="rounded-3xl border border-blue-200 bg-blue-50 p-8">

//                         <h2 className="mb-5 text-2xl font-bold text-blue-700">
//                             4. AI Features
//                         </h2>

//                         <p className="leading-8 text-slate-700">

//                             NARP may use artificial intelligence (AI) to assist
//                             users with service discovery, recommendations,
//                             search results, and automated suggestions.

//                         </p>

//                         <p className="mt-4 leading-8 text-slate-700">

//                             AI-generated recommendations are intended to assist
//                             users and should not be considered guarantees or
//                             professional advice.

//                         </p>

//                     </section>

//                     {/* Firebase */}

//                     <section className="rounded-3xl bg-white p-8 shadow-sm">

//                         <h2 className="mb-5 text-2xl font-bold text-green-700">
//                             5. Third-Party Services
//                         </h2>

//                         <p className="leading-8 text-slate-600">

//                             NARP uses trusted third-party service providers,
//                             including cloud infrastructure, authentication,
//                             push notifications, analytics, mapping services,
//                             and payment processors, to operate the platform.

//                         </p>

//                         <p className="mt-4 leading-8 text-slate-600">

//                             These providers process information only as
//                             necessary to provide their services.

//                         </p>

//                     </section>

//                     {/* Security */}

//                     <section className="rounded-3xl bg-green-50 border border-green-200 p-8">

//                         <h2 className="mb-5 text-2xl font-bold text-green-700">
//                             6. Data Security
//                         </h2>

//                         <p className="leading-8 text-slate-700">

//                             NARP uses industry-standard security measures,
//                             encrypted communications, secure authentication,
//                             and cloud infrastructure to help protect your
//                             information.

//                         </p>

//                         <p className="mt-4 leading-8 text-slate-700">

//                             While we strive to protect your information,
//                             no method of electronic transmission or storage
//                             is completely secure.

//                         </p>

//                     </section>

//                     {/* Rights */}

//                     <section className="rounded-3xl bg-white p-8 shadow-sm">

//                         <h2 className="mb-5 text-2xl font-bold text-green-700">
//                             7. Your Rights
//                         </h2>

//                         <ul className="list-disc space-y-2 pl-6 text-slate-600">

//                             <li>Access your personal information</li>

//                             <li>Update your profile</li>

//                             <li>Request account deletion</li>

//                             <li>Contact us regarding privacy concerns</li>

//                         </ul>

//                     </section>

//                     {/* Children */}

//                     <section className="rounded-3xl border border-yellow-200 bg-yellow-50 p-8">

//                         <h2 className="mb-5 text-2xl font-bold text-yellow-700">
//                             8. Children's Privacy
//                         </h2>

//                         <p className="leading-8 text-slate-700">

//                             NARP is intended for users who meet the minimum age
//                             required under applicable laws. We do not knowingly
//                             collect personal information from children without
//                             appropriate authorization.

//                         </p>

//                     </section>

//                     {/* Contact */}

//                     <section className="rounded-3xl bg-blue-50 border border-blue-200 p-8">

//                         <h2 className="mb-5 text-2xl font-bold text-blue-700">
//                             9. Contact Us
//                         </h2>

//                         <p className="leading-8 text-slate-700">

//                             If you have questions about this Privacy Policy,
//                             please contact us.

//                         </p>

//                         <div className="mt-6 rounded-2xl bg-white p-6">

//                             <p className="font-semibold">
//                                 NARP Support
//                             </p>

//                             <a
//                                 href="mailto:support@narp-svc.site"
//                                 className="mt-2 inline-block text-blue-600 hover:underline"
//                             >
//                                 support@narp-svc.site
//                             </a>

//                         </div>

//                     </section>

//                     {/* Acknowledgement */}

//                     <section className="rounded-3xl bg-white p-8 shadow-sm">

//                         <h2 className="mb-4 text-2xl font-bold text-green-700">
//                             Acknowledgement
//                         </h2>

//                         <p>
//                             By accessing or using NARP, you acknowledge that you have read,
//                             understood, and agree to be bound by these Terms of Use.
//                         </p>
//                     </section>

//                     {/* Footer */}

//                     <div className="pt-6 text-center text-sm text-slate-500">

//                         © {new Date().getFullYear()} NARP — Nearby App for Reliable Professionals

//                     </div>

//                 </div>

//             </Container>
//         </PageContainer>
//     );
// }


import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import LegalList from "@/components/legal/LegalList";
import LegalNotice from "@/components/legal/LegalNotice";
import LegalContactBox from "@/components/legal/LegalContactBox";
import RelatedPolicies from "@/components/legal/RelatedPolicies";

export const metadata = {
    title: "Privacy Policy | NARP",
    description:
        "Learn how NARP collects, uses, stores, protects, and shares your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <LegalLayout
            title="Privacy Policy"
            description="This Privacy Policy explains how NARP (Nearby App for Reliable Professionals) collects, uses, stores, protects, and shares your personal information when you use our mobile application, website, and related services."
            effectiveDate="May 9, 2026"
            lastUpdated="May 9, 2026"
            icon="🔒"
        >
            <LegalSection title="1. Introduction">
                <p>
                    NARP ("Nearby App for Reliable Professionals") values your privacy
                    and is committed to protecting your personal information.
                </p>

                <p className="mt-4">
                    This Privacy Policy explains what information we collect, how we use
                    it, when we share it, and the choices available to you regarding your
                    information.
                </p>

                <p className="mt-4">
                    By creating an account or using NARP, you acknowledge that you have
                    read and understood this Privacy Policy.
                </p>
            </LegalSection>

            <LegalSection title="2. Information We Collect">
                <p>
                    Depending on how you use NARP, we may collect the following types of
                    information.
                </p>

                <h3 className="mt-6 font-semibold text-lg">
                    Personal Information
                </h3>

                <LegalList
                    items={[
                        "Full name",
                        "Email address",
                        "Mobile phone number",
                        "Date of birth (where required)",
                        "Profile photograph",
                        "Account credentials",
                    ]}
                />

                <h3 className="mt-8 font-semibold text-lg">
                    Identity Verification
                </h3>

                <p className="mt-3">
                    To help maintain a trusted marketplace, we may collect identity
                    verification information including:
                </p>

                <LegalList
                    items={[
                        "Government-issued identification",
                        "Selfie or facial verification images",
                        "Verification status",
                        "Supporting verification documents",
                    ]}
                />

                <LegalNotice
                    type="info"
                    title="Identity Verification"
                >
                    Verification information is collected solely to verify identity,
                    prevent fraud, improve platform safety, and comply with applicable
                    legal or regulatory requirements.
                </LegalNotice>

                <h3 className="mt-8 font-semibold text-lg">
                    Location Information
                </h3>

                <p className="mt-3">
                    NARP may collect your approximate or precise location to:
                </p>

                <LegalList
                    items={[
                        "Match clients with nearby freelancers",
                        "Display nearby services",
                        "Improve search accuracy",
                        "Estimate travel distances",
                        "Support booking functionality",
                    ]}
                />

                <p className="mt-4">
                    You may disable location permissions through your device settings,
                    although some features may no longer function properly.
                </p>

                <h3 className="mt-8 font-semibold text-lg">
                    Device & Technical Information
                </h3>

                <LegalList
                    items={[
                        "IP address",
                        "Device model",
                        "Operating system",
                        "App version",
                        "Browser information",
                        "Language preferences",
                        "Crash reports and diagnostics",
                    ]}
                />

                <h3 className="mt-8 font-semibold text-lg">
                    Usage Information
                </h3>

                <LegalList
                    items={[
                        "Pages and screens visited",
                        "Search activity",
                        "Booking activity",
                        "Messages exchanged through the platform",
                        "Feature usage",
                        "Session duration",
                        "Interaction with notifications",
                    ]}
                />

                <h3 className="mt-8 font-semibold text-lg">
                    Payment Information
                </h3>

                <p className="mt-3">
                    Payments made through NARP are processed by trusted third-party
                    payment providers.
                </p>

                <p className="mt-4">
                    NARP does not store complete credit card numbers, debit card numbers,
                    bank account credentials, or other sensitive payment credentials.
                </p>

                <p className="mt-4">
                    We may retain limited payment-related information such as:
                </p>

                <LegalList
                    items={[
                        "Transaction IDs",
                        "Payment status",
                        "Wallet balances",
                        "Escrow records",
                        "Withdrawal history",
                    ]}
                />
            </LegalSection>

            <LegalSection title="3. How We Use Your Information">
                <p>
                    We use your information to operate, maintain, and improve the NARP
                    platform.
                </p>

                <LegalList
                    items={[
                        "Create and manage user accounts",
                        "Verify user identities",
                        "Match clients with nearby freelancers",
                        "Process bookings and payments",
                        "Manage escrow transactions",
                        "Process withdrawals",
                        "Provide customer support",
                        "Send service-related notifications",
                        "Detect fraud and suspicious activity",
                        "Improve platform performance",
                        "Enhance user experience",
                        "Comply with legal obligations",
                    ]}
                />
            </LegalSection>

            <LegalSection title="4. AI Features">
                <p>
                    NARP may use artificial intelligence (AI) to improve user experience,
                    including recommendations, search results, language translation,
                    automated suggestions, and future AI-powered assistance.
                </p>

                <p className="mt-4">
                    AI features are intended to assist users and should not be considered
                    professional advice or guarantees.
                </p>

                <LegalNotice
                    type="info"
                    title="AI Transparency"
                >
                    AI-generated content may occasionally be inaccurate or incomplete.
                    Users should independently verify important information before making
                    decisions.
                </LegalNotice>
            </LegalSection>

            <LegalSection title="5. Cookies and Similar Technologies">
                <p>
                    Our website may use cookies, local storage, and similar technologies
                    to improve functionality, maintain secure sessions, remember user
                    preferences, and analyze website performance.
                </p>

                <p className="mt-4">
                    For more information, please review our Cookie Policy.
                </p>
            </LegalSection>

            <LegalSection title="6. Third-Party Services">
                <p>
                    NARP relies on trusted third-party service providers to operate the
                    platform.
                </p>

                <LegalList
                    items={[
                        "Firebase Authentication",
                        "Cloud Firestore",
                        "Firebase Cloud Messaging",
                        "Firebase Storage",
                        "Google Maps Platform",
                        "Cloudflare",
                        "Resend (contact emails)",
                        "Payment providers",
                        "Analytics services (when enabled)",
                    ]}
                />

                <p className="mt-4">
                    These providers process information only as necessary to provide
                    their services and are responsible for protecting the information
                    they process.
                </p>
            </LegalSection>

            <LegalSection title="7. Sharing Your Information">
                <p>
                    We do not sell your personal information.
                </p>

                <p className="mt-4">
                    We may share information only when necessary:
                </p>

                <LegalList
                    items={[
                        "With service providers that help operate NARP",
                        "When required by law",
                        "To protect users and the platform",
                        "During fraud investigations",
                        "With your consent",
                    ]}
                />
            </LegalSection>

            <LegalSection title="8. Data Retention">
                <p>
                    We retain information only for as long as reasonably necessary to
                    provide our services, comply with legal obligations, resolve disputes,
                    and enforce our agreements.
                </p>

                <p className="mt-4">
                    Some information may remain in backups or archived records where
                    required by law or for legitimate business purposes.
                </p>
            </LegalSection>

            <LegalSection title="9. Data Security">
                <p>
                    We implement administrative, technical, and organizational safeguards
                    designed to protect personal information from unauthorized access,
                    disclosure, alteration, or destruction.
                </p>

                <LegalList
                    items={[
                        "Encrypted communications",
                        "Secure authentication",
                        "Role-based access controls",
                        "Cloud infrastructure security",
                        "Fraud detection mechanisms",
                    ]}
                />

                <LegalNotice
                    type="warning"
                    title="Security Notice"
                >
                    Although we strive to protect your information, no method of
                    electronic transmission or storage can be guaranteed to be completely
                    secure.
                </LegalNotice>
            </LegalSection>

            <LegalSection title="10. Your Rights">
                <p>
                    Depending on applicable laws, you may have the right to:
                </p>

                <LegalList
                    items={[
                        "Access your personal information",
                        "Correct inaccurate information",
                        "Request deletion of your account",
                        "Withdraw consent where applicable",
                        "Request clarification regarding our privacy practices",
                    ]}
                />
            </LegalSection>

            <LegalSection title="11. Children's Privacy">
                <p>
                    NARP is intended for individuals who meet the minimum age required
                    under applicable laws.
                </p>

                <p className="mt-4">
                    We do not knowingly collect personal information from children
                    without appropriate authorization.
                </p>
            </LegalSection>

            <LegalSection title="12. International Data Transfers">
                <p>
                    Your information may be processed or stored in countries where our
                    service providers operate. We take reasonable steps to ensure your
                    information remains protected in accordance with applicable privacy
                    laws.
                </p>
            </LegalSection>

            <LegalSection title="13. Changes to this Privacy Policy">
                <p>
                    We may update this Privacy Policy from time to time to reflect
                    changes in our services, applicable laws, or business practices.
                </p>

                <p className="mt-4">
                    Updated versions become effective upon publication on this page.
                </p>
            </LegalSection>

            <LegalSection title="14. Contact Us">
                <LegalContactBox
                    title="Privacy Support"
                    email="narp290619@gmail.com"
                    website="https://www.narp-svc.site"
                    responseTime="We typically respond within 1–2 business days."
                    contactPage="/contact"
                />
            </LegalSection>

            <LegalSection title="Acknowledgement">
                <p>
                    By accessing or using NARP, you acknowledge that you have read,
                    understood, and agree to this Privacy Policy.
                </p>
            </LegalSection>

            <RelatedPolicies current="/legal/privacy" />
        </LegalLayout>
    );
}