import Container from "@/components/shared/Container";
import PageContainer from "@/components/shared/PageContainer";

export default function TermsPage() {
    return (
        <PageContainer>
            <Container className="max-w-5xl py-16">
                {/* Hero */}
                <section className="mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-16 text-center text-white">

                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-5xl font-extrabold">
                            Terms of Use
                        </h1>

                        <p className="mt-6 text-lg text-blue-100 leading-8">
                            These Terms of Use govern your access to and use of the NARP
                            platform, including the mobile application, website, and related
                            services.
                        </p>

                        <div className="mt-6 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
                            Effective Date: August 6, 2026
                        </div>
                    </div>

                </section>

                <div className="space-y-8">

                    <Section title="1. Acceptance of Terms">
                        <p>
                            By accessing or using NARP, you agree to comply with and be bound by these
                            Terms of Use.
                        </p>

                        <p>
                            If you do not agree with any part of these Terms, please discontinue use of
                            the platform.
                        </p>
                    </Section>

                    <Section title="2. Services">
                        <p>
                            NARP provides a digital marketplace platform that allows
                            clients to connect with freelancers and service providers
                            for various professional services.
                        </p>

                        <p>
                            NARP does not directly perform, supervise, or provide the services offered by
                            freelancers and is not a party to agreements between users.
                        </p>
                    </Section>

                    <Section title="3. User Accounts">
                        <p>Users must:</p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Provide accurate and complete information.</li>
                            <li>Maintain account security and confidentiality.</li>
                            <li>Be at least 18 years old.</li>
                            <li>Comply with all applicable laws.</li>
                        </ul>

                        <p>
                            Users are responsible for all activities conducted through their account.
                        </p>
                    </Section>

                    <Section title="4. Freelancer Verification">
                        <p>
                            NARP may require identity verification before allowing freelancers
                            to offer services on the platform.
                        </p>

                        <p>
                            Verification helps improve trust and safety but does not
                            guarantee service quality, reliability, or performance.
                        </p>
                    </Section>

                    <Section title="5. Payments">
                        <p>
                            Clients agree to pay the displayed service amount before
                            confirming a booking.
                        </p>

                        <p>
                            Payments may be processed through approved third-party
                            payment providers.
                        </p>
                    </Section>

                    <Section title="6. Escrow System">
                        <p>
                            To help protect both clients and freelancers, payments may
                            be temporarily held in escrow by NARP.
                        </p>

                        <p>Escrow funds may remain on hold until:</p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Service completion</li>
                            <li>Client confirmation</li>
                            <li>Dispute resolution</li>
                            <li>Refund processing</li>
                        </ul>
                    </Section>

                    <Section title="7. Related Platform Policies">
                        <p>
                            By creating an account and using NARP, you also agree to comply with the following policies, which form
                            part of these Terms of Use:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Escrow Policy</li>
                            <li>Refund Policy</li>
                            <li>Withdrawal Policy</li>
                        </ul>

                        <p>
                            These policies describe the rules and procedures governing escrow services, payments, refunds, wallet
                            balances, withdrawals, verification requirements, and other payment-related features of the NARP
                            platform. These policies are incorporated into and form part of these Terms of Use.
                        </p>

                        <p>
                            The latest versions of these policies are available within the NARP application and on NARP's official
                            policy pages. By continuing to use NARP, you acknowledge that these policies are incorporated into and
                            form part of these Terms of Use.
                        </p>
                    </Section>

                    <Section title="8. Dispute Resolution">
                        <p>
                            If a disagreement arises between a client and freelancer
                            regarding a booking, payment, service quality, completion
                            status, or other transaction-related matter, either party
                            may submit a dispute through NARP support.
                        </p>

                        <p>During a dispute:</p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Escrow funds may remain temporarily on hold</li>
                            <li>NARP may request additional evidence or documentation from either party</li>
                            <li>NARP may review booking records and communications</li>
                            <li>NARP may investigate the circumstances of the dispute</li>
                            <li>NARP may determine an appropriate resolution based on available information</li>
                        </ul>

                        <p>Possible resolutions may include:</p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Release of escrow funds to the freelancer</li>
                            <li>Full refund to the client</li>
                            <li>Partial refund to the client</li>
                            <li>Other actions deemed appropriate by NARP</li>
                        </ul>

                        <p>
                            NARP will make reasonable efforts to review disputes fairly
                            based on available information and platform policies.
                        </p>
                    </Section>

                    <Section title="9. Prohibited Activities">
                        <p>Users may not:</p>

                        <div className="rounded-xl border-l-4 border-orange-500 bg-orange-50 p-5">
                            <h3 className="font-semibold text-orange-700">
                                Important Notice
                            </h3>

                            <ul className="mt-4 list-disc pl-6 space-y-2">
                                <li>Commit fraud or deceptive practices</li>
                                <li>Harass, threaten, or abuse other users</li>
                                <li>Post illegal, harmful, or misleading content</li>
                                <li>Circumvent platform fees or payment systems</li>
                                <li>Attempt unauthorized access to systems or accounts</li>
                            </ul>
                        </div>
                    </Section>

                    <Section title="10. Account Suspension">
                        <p>
                            NARP reserves the right to suspend, restrict, or terminate
                            accounts that violate these Terms, applicable laws, and
                            platform policies or engage in suspicious activities.
                        </p>
                    </Section>

                    <Section title="11. Limitation of Liability">
                        <p>
                            To the fullest extent permitted by law, NARP shall not be
                            liable for indirect, incidental, consequential, special,
                            or punitive damages arising from the use of the platform.
                        </p>

                        <p>
                            NARP provides the platform on an "as available" basis and
                            makes no guarantees regarding uninterrupted availability.
                        </p>

                        <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5">
                            <h3 className="font-semibold text-blue-700">
                                Marketplace Facilitator Notice
                            </h3>

                            <br></br>

                            <p>
                                NARP acts solely as a technology platform and marketplace facilitator
                                that connects clients with independent freelancers and service providers.

                                NARP does not employ freelancers, supervise their work,
                                guarantee service outcomes, or assume responsibility for the actual
                                services performed by freelancers.

                                Any agreement for services is made directly between the client and
                                the freelancer.
                            </p>
                        </div>
                    </Section>

                    <Section title="12. Changes to These Terms">
                        <p>
                            NARP may update these Terms of Use from time to time.
                        </p>

                        <p>
                            Updated versions will be published through the application
                            and official policy pages.
                        </p>

                        <p>
                            Continued use of NARP after updates constitutes acceptance
                            of the revised Terms.
                        </p>
                    </Section>

                    <Section title="13. Ratings and Reviews">
                        <p>
                            Clients may submit ratings and reviews after a service has been completed.
                        </p>

                        <p>
                            Reviews must be truthful, respectful, and based on actual experiences.
                        </p>

                        <p>
                            NARP reserves the right to remove reviews that:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Contain false or misleading information</li>
                            <li>Include offensive, abusive, or discriminatory content</li>
                            <li>Violate applicable laws or platform policies</li>
                            <li>Are determined to be fraudulent or manipulated</li>
                        </ul>

                        <p>
                            Ratings and reviews contribute to a freelancer's reputation but do not constitute endorsements by NARP.
                        </p>
                    </Section>

                    <Section title="14. Fees and Charges">
                        <p>
                            NARP may charge service fees, platform fees, processing fees, withdrawal fees, or other applicable
                            charges for the use of certain platform features.
                        </p>

                        <p>
                            Applicable fees will be displayed before a transaction is completed whenever possible.
                        </p>

                        <p>
                            NARP reserves the right to modify fees at any time, subject to applicable laws and reasonable notice
                            when required.
                        </p>
                    </Section>

                    <Section title="15. Wallet and Withdrawals">
                        <p>
                            Funds released from escrow may be credited to a user's NARP Wallet.
                        </p>

                        <p>
                            Wallet balances do not constitute bank deposits and are not insured by any government agency.
                        </p>

                        <p>
                            Withdrawal requests may be subject to:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Identity verification</li>
                            <li>Fraud prevention reviews</li>
                            <li>Platform compliance checks</li>
                            <li>Minimum withdrawal requirements</li>
                        </ul>

                        <p>
                            NARP reserves the right to delay, suspend, or reject withdrawals when fraudulent activity, policy
                            violations, or security concerns are suspected.
                        </p>
                    </Section>

                    <Section title="16. Intellectual Property">
                        <p>
                            The NARP application, logo, branding, software, content, and related materials are owned by NARP and are
                            protected by applicable intellectual property laws.
                        </p>

                        <p>
                            Users may not:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Copy or reproduce platform content</li>
                            <li>Reverse engineer the application</li>
                            <li>Use NARP trademarks without permission</li>
                            <li>Create derivative works from platform materials</li>
                        </ul>
                    </Section>

                    <Section title="17. Termination">
                        <p>
                            Users may stop using the platform at any time.
                        </p>

                        <p>
                            NARP may suspend, restrict, or permanently terminate access to accounts that:
                        </p>

                        <ul className="list-disc space-y-2 pl-6">
                            <li>Violate these Terms</li>
                            <li>Engage in fraudulent activities</li>
                            <li>Pose security risks</li>
                            <li>Abuse other users or the platform</li>
                        </ul>

                        <p>
                            Certain obligations and rights under these Terms may survive account termination.
                        </p>
                    </Section>

                    <Section title="18. Governing Law">
                        <p>
                            These Terms shall be governed by and interpreted in accordance with the laws of the Republic of the
                            Philippines.
                        </p>

                        <p>
                            Any disputes arising from the use of NARP shall be subject to applicable Philippine laws and
                            regulations.
                        </p>
                    </Section>

                    <Section title="19. Contact Us">
                        <p>
                            If you have questions regarding these Terms of Use, please contact:
                        </p>

                        <div className="mt-6 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5">
                            <p className="font-semibold">NARP Support</p>

                            <a
                                href="mailto:support@narp.app"
                                className="mt-2 inline-block text-blue-600 hover:underline"
                            >
                                support@narp-svc.site
                            </a>
                        </div>
                    </Section>

                    <Section title="Acknowledgement">
                        <p>
                            By accessing or using NARP, you acknowledge that you have read,
                            understood, and agree to be bound by these Terms of Use.
                        </p>
                    </Section>

                    <div className="pt-6 text-center text-sm text-slate-500">

                        © {new Date().getFullYear()} NARP — Nearby App for Reliable Professionals

                    </div>

                </div>
            </Container>
        </PageContainer>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-green-700">
                {title}
            </h2>

            <div className="space-y-4 text-slate-700 leading-8">
                {children}
            </div>
        </section>
    );
}