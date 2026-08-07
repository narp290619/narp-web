import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import LegalNotice from "@/components/legal/LegalNotice";
import LegalContactBox from "@/components/legal/LegalContactBox";
import RelatedPolicies from "@/components/legal/RelatedPolicies";
import LegalList from "@/components/legal/LegalList";

export const metadata = {
  title: "Cookie Policy | NARP",
  description:
    "Learn how NARP uses cookies and similar technologies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="This Cookie Policy explains how NARP (Nearby App for Reliable Professionals) uses cookies and similar technologies when you visit our website."
      effectiveDate="May 9, 2026"
      lastUpdated="August 6, 2026"
      icon="🍪"
    >
      <LegalSection title="1. What Are Cookies?">
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help websites remember information about your visit,
          improve functionality, and provide a better browsing experience.
        </p>

        <p className="mt-4">
          Similar technologies such as local storage, session storage, and
          browser storage may also be used for similar purposes.
        </p>
      </LegalSection>

      <LegalSection title="2. How NARP Uses Cookies">
        <p>
          NARP uses cookies and similar technologies to improve website
          performance, maintain security, and enhance your browsing experience.
        </p>

        <LegalList
          items={[
            "Keep users securely signed in.",
            "Remember website preferences and settings.",
            "Improve website performance and reliability.",
            "Protect against fraudulent activity.",
            "Analyze website usage and visitor trends.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Types of Cookies We Use">
        <h3 className="font-semibold">Essential Cookies</h3>
        <p>
          Necessary for authentication, security, navigation, and core website
          functionality.
        </p>

        <h3 className="mt-6 font-semibold">Preference Cookies</h3>
        <p>
          Remember user preferences such as language and personalized settings.
        </p>

        <h3 className="mt-6 font-semibold">Analytics Cookies</h3>
        <p>
          Help us understand how visitors use the website so we can improve the
          user experience.
        </p>

        <h3 className="mt-6 font-semibold">Functional Cookies</h3>
        <p>
          Enable enhanced features such as remembering previously entered
          information and improving navigation.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-Party Cookies">
        <p>
          Certain features of the NARP website rely on trusted third-party
          services that may use their own cookies.
        </p>

        <LegalList
          items={[
            "Firebase Authentication",
            "Google Maps",
            "Google Analytics (if enabled)",
            "Embedded videos or social media integrations",
            "Payment providers used during transactions",
          ]}
        />

        <p className="mt-4">
          These third parties manage their own cookies according to their
          respective privacy policies.
        </p>
      </LegalSection>

      <LegalSection title="5. Managing Cookies">
        <p>
          Most web browsers allow you to manage, block, or delete cookies
          through your browser settings.
        </p>

        <p className="mt-4">
          Disabling cookies may affect certain website features and
          functionality.
        </p>

        <LegalNotice
          type="warning"
          title="Important Notice"
        >
          Disabling essential cookies may prevent parts of the NARP website
          from functioning correctly, including user login, account management,
          and other secure features.
        </LegalNotice>
      </LegalSection>

      <LegalSection title="6. Changes to This Cookie Policy">
        <p>
          We may update this Cookie Policy from time to time to reflect changes
          in technology, applicable laws, or improvements to our services.
        </p>

        <p className="mt-4">
          Updated versions will be published on this page together with the
          revised Last Updated date.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact Us">
        <LegalContactBox
          title="Cookie Policy Support"
          email="support@narp-svc.site"
          website="https://www.narp-svc.site"
          responseTime="We typically respond within 1–2 business days."
          contactPage="/contact"
        />
      </LegalSection>

      <LegalSection title="Acknowledgement">
        <p>
          By continuing to use the NARP website, you acknowledge that you have
          read and understood this Cookie Policy and consent to the use of
          cookies and similar technologies as described herein, subject to your
          browser settings and applicable laws.
        </p>
      </LegalSection>

      <RelatedPolicies current="/legal/cookies" />
    </LegalLayout>
  );
}