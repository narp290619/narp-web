import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import LegalNotice from "@/components/legal/LegalNotice";
import LegalContactBox from "@/components/legal/LegalContactBox";
import RelatedPolicies from "@/components/legal/RelatedPolicies";
import LegalList from "@/components/legal/LegalList";

export const metadata = {
  title: "Community Guidelines | NARP",
  description:
    "Learn the standards of conduct expected from everyone using the NARP platform.",
};

export default function CommunityGuidelinesPage() {
  return (
    <LegalLayout
      title="Community Guidelines"
      description="These Community Guidelines help create a safe, respectful, and trustworthy marketplace for clients and freelancers."
      effectiveDate="May 9, 2026"
      lastUpdated="May 9, 2026"
      icon="🤝"
    >
      <LegalSection title="1. Our Commitment">
        <p>
          NARP (Nearby App for Reliable Professionals) is built on trust,
          professionalism, and respect. These Community Guidelines explain the
          behavior expected from everyone using our platform.
        </p>

        <p className="mt-4">
          By treating one another fairly and respectfully, we help create a
          reliable marketplace where clients and freelancers can confidently
          work together.
        </p>
      </LegalSection>

      <LegalSection title="2. Treat Others with Respect">
        <LegalList
          items={[
            "Communicate politely and professionally.",
            "Respect different backgrounds, cultures, and opinions.",
            "Avoid harassment, discrimination, or abusive language.",
            "Resolve disagreements calmly and respectfully.",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Be Honest">
        <LegalList
          items={[
            "Provide accurate profile information.",
            "Describe services truthfully.",
            "Set realistic expectations for bookings.",
            "Leave honest and constructive reviews.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Honor Your Commitments">
        <LegalList
          items={[
            "Accept only bookings you intend to complete.",
            "Arrive on time whenever possible.",
            "Complete agreed services professionally.",
            "Notify the other party promptly if circumstances change.",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Protect Privacy">
        <LegalList
          items={[
            "Respect personal information shared through NARP.",
            "Do not misuse another user's contact information.",
            "Do not share confidential information without permission.",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Promote Safety">
        <LegalList
          items={[
            "Follow all applicable laws and regulations.",
            "Report unsafe, illegal, or suspicious behavior.",
            "Avoid actions that may place others at risk.",
          ]}
        />

        <LegalNotice type="info" title="Safety First">
          If you believe someone is in immediate danger, contact your local
          emergency services before contacting NARP.
        </LegalNotice>
      </LegalSection>

      <LegalSection title="7. Reviews and Feedback">
        <p>
          Reviews help build trust within the NARP community.
        </p>

        <LegalList
          items={[
            "Leave honest and accurate feedback.",
            "Do not threaten or pressure others for positive reviews.",
            "Do not submit fake or misleading ratings.",
          ]}
        />
      </LegalSection>

      <LegalSection title="8. Violations">
        <p>
          Users who repeatedly violate these Community Guidelines may be subject
          to enforcement actions.
        </p>

        <LegalList
          items={[
            "Content removal",
            "Warnings",
            "Temporary account restrictions",
            "Permanent account suspension",
          ]}
        />

        <LegalNotice type="warning" title="Enforcement">
          Serious or repeated violations may result in permanent removal from
          the NARP platform.
        </LegalNotice>
      </LegalSection>

      <LegalSection title="9. Changes to these Guidelines">
        <p>
          NARP may update these Community Guidelines periodically. Updated
          versions become effective once published on the platform.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact Us">
        <LegalContactBox
          title="Community Support"
          email="narp290619@gmail.com"
          website="https://www.narp-svc.site"
          responseTime="We typically respond within 1–2 business days."
          contactPage="/contact"
        />
      </LegalSection>

      <LegalSection title="Acknowledgement">
        <p>
          By using NARP, you acknowledge that you have read, understood, and
          agree to follow these Community Guidelines.
        </p>
      </LegalSection>

      <RelatedPolicies current="/legal/community-guidelines" />
    </LegalLayout>
  );
}