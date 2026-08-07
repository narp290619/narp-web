import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import LegalNotice from "@/components/legal/LegalNotice";
import LegalContactBox from "@/components/legal/LegalContactBox";
import RelatedPolicies from "@/components/legal/RelatedPolicies";
import LegalList from "@/components/legal/LegalList";

export const metadata = {
  title: "Acceptable Use Policy | NARP",
  description:
    "Learn what activities are prohibited when using the NARP platform.",
};

export default function AcceptableUsePolicyPage() {
  return (
    <LegalLayout
      title="Acceptable Use Policy"
      description="This Acceptable Use Policy explains the activities and behaviors that are prohibited when using NARP."
      effectiveDate="May 9, 2026"
      lastUpdated="May 9, 2026"
    >
      <LegalSection title="1. Purpose">
        <p>
          This Acceptable Use Policy ("AUP") helps maintain a safe, secure, and
          trustworthy marketplace for everyone using NARP (Nearby App for
          Reliable Professionals).
        </p>

        <p className="mt-4">
          By using NARP, you agree not to engage in any activity prohibited by
          this policy.
        </p>
      </LegalSection>

      <LegalSection title="2. Illegal Activities">
        <LegalList
          items={[
            "Violating applicable laws or regulations.",
            "Offering or requesting illegal goods or services.",
            "Using NARP to facilitate criminal activity.",
            "Money laundering or other financial crimes.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Fraud and Deception">
        <LegalList
          items={[
            "Creating fake identities or impersonating another person.",
            "Providing false profile information.",
            "Submitting fraudulent bookings or payment claims.",
            "Attempting to deceive clients, freelancers, or NARP.",
          ]}
        />

        <LegalNotice type="warning" title="Zero Tolerance">
          Fraudulent activity may result in immediate account suspension,
          permanent removal from the platform, and referral to appropriate
          authorities where required.
        </LegalNotice>
      </LegalSection>

      <LegalSection title="4. Abuse of the Platform">
        <LegalList
          items={[
            "Spamming users or sending unsolicited messages.",
            "Harassing, threatening, or intimidating others.",
            "Circumventing platform security or restrictions.",
            "Creating multiple accounts to evade enforcement actions.",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Harmful Content">
        <LegalList
          items={[
            "Uploading malware or malicious software.",
            "Sharing viruses or harmful code.",
            "Posting content intended to disrupt the platform.",
            "Attempting unauthorized access to accounts or systems.",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Intellectual Property">
        <LegalList
          items={[
            "Do not upload content you do not have permission to use.",
            "Respect copyrights, trademarks, and other intellectual property rights.",
            "Do not copy or misuse NARP branding without authorization.",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Off-Platform Transactions">
        <p>
          NARP encourages users to complete bookings and payments through the
          platform to maintain escrow protection and transaction records.
        </p>

        <LegalList
          items={[
            "Do not pressure users to avoid NARP's payment system.",
            "Do not request payment outside the platform to bypass applicable fees.",
            "Repeated attempts to circumvent platform protections may result in account restrictions.",
          ]}
        />
      </LegalSection>

      <LegalSection title="8. Enforcement">
        <p>
          If NARP determines that this policy has been violated, we may take one
          or more enforcement actions.
        </p>

        <LegalList
          items={[
            "Remove content.",
            "Issue warnings.",
            "Suspend platform features.",
            "Freeze funds when permitted by applicable policies.",
            "Temporarily suspend an account.",
            "Permanently terminate an account.",
            "Cooperate with law enforcement where legally required.",
          ]}
        />

        <LegalNotice type="info" title="Case-by-Case Review">
          Enforcement decisions are made based on the severity, frequency, and
          circumstances of each violation.
        </LegalNotice>
      </LegalSection>

      <LegalSection title="9. Changes to this Policy">
        <p>
          NARP may modify this Acceptable Use Policy from time to time. Updated
          versions become effective upon publication on the platform.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact Us">
        <LegalContactBox
          title="Policy Enforcement Support"
          email="narp290619@gmail.com"
          website="https://www.narp-svc.site"
          responseTime="We typically respond within 1–2 business days."
          contactPage="/contact"
        />
      </LegalSection>

      <LegalSection title="Acknowledgement">
        <p>
          By accessing or using NARP, you acknowledge that you have read,
          understood, and agree to comply with this Acceptable Use Policy.
        </p>
      </LegalSection>

      <RelatedPolicies current="/legal/acceptable-use" />
    </LegalLayout>
  );
}