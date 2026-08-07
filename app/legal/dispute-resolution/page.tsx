import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import LegalNotice from "@/components/legal/LegalNotice";
import LegalContactBox from "@/components/legal/LegalContactBox";
import RelatedPolicies from "@/components/legal/RelatedPolicies";
import LegalList from "@/components/legal/LegalList";

export const metadata = {
  title: "Dispute Resolution Policy | NARP",
  description:
    "Learn how NARP investigates and resolves disputes between clients and freelancers.",
};

export default function DisputeResolutionPolicyPage() {
  return (
    <LegalLayout
      title="Dispute Resolution Policy"
      description="This policy explains how disputes between clients and freelancers are investigated and resolved through the NARP platform."
      effectiveDate="May 9, 2026"
      lastUpdated="May 9, 2026"
    >
      <LegalSection title="1. Purpose">
        <p>
          NARP (Nearby App for Reliable Professionals) aims to provide a fair,
          transparent, and impartial process for resolving disputes that arise
          between clients and freelancers.
        </p>

        <p className="mt-4">
          This policy helps protect both parties while promoting trust and
          accountability across the platform.
        </p>
      </LegalSection>

      <LegalSection title="2. When a Dispute May Be Filed">
        <p>
          Either the client or the freelancer may submit a dispute if they
          believe a booking has not been handled fairly.
        </p>

        <LegalList
          items={[
            "Service not completed as agreed",
            "Poor quality or incomplete work",
            "Disagreement regarding payment",
            "Booking cancellation disagreements",
            "Suspected fraudulent activity",
            "Other issues affecting the booking",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Investigation Process">
        <p>
          When a dispute is submitted, NARP may conduct an investigation before
          making a decision.
        </p>

        <LegalList
          items={[
            "Review booking details",
            "Review chat messages and communications",
            "Review submitted photos, videos, or supporting evidence",
            "Request additional information from either party",
            "Review payment and escrow records",
          ]}
        />

        <LegalNotice type="info" title="Fair Review">
          NARP will make reasonable efforts to review all available information
          before reaching a decision.
        </LegalNotice>
      </LegalSection>

      <LegalSection title="4. Escrow During Investigation">
        <p>
          If payment is currently being held in escrow, the funds may remain on
          hold while the dispute is under investigation.
        </p>

        <LegalList
          items={[
            "Escrow funds will not normally be released until the dispute has been resolved.",
            "Neither party may access the disputed funds during the investigation.",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Possible Outcomes">
        <p>
          After reviewing the available information, NARP may determine an
          appropriate resolution.
        </p>

        <LegalList
          items={[
            "Release escrow funds to the freelancer",
            "Issue a full refund to the client",
            "Issue a partial refund",
            "Request additional information before making a decision",
            "Apply account warnings or restrictions when appropriate",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Cooperation">
        <p>
          Both clients and freelancers are expected to cooperate during a
          dispute investigation.
        </p>

        <LegalList
          items={[
            "Provide truthful information",
            "Respond to requests within a reasonable time",
            "Submit accurate supporting evidence",
            "Avoid abusive or misleading communications",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Fraudulent Claims">
        <p>
          Submitting false, misleading, or fraudulent disputes is strictly
          prohibited.
        </p>

        <LegalNotice type="warning" title="Policy Enforcement">
          NARP reserves the right to suspend or permanently terminate accounts
          involved in fraudulent dispute activity.
        </LegalNotice>
      </LegalSection>

      <LegalSection title="8. Final Decisions">
        <p>
          After completing an investigation, NARP will communicate its decision
          to the parties involved.
        </p>

        <p className="mt-4">
          Decisions are based on the information available at the time of the
          investigation and applicable platform policies.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to this Policy">
        <p>
          NARP may update this Dispute Resolution Policy from time to time.
          Updated versions become effective upon publication on the platform.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact Us">
        <LegalContactBox
          title="Dispute Resolution Support"
          email="narp290619@gmail.com"
          website="https://www.narp-svc.site"
          responseTime="We typically respond within 1–2 business days."
          contactPage="/contact"
        />
      </LegalSection>

      <LegalSection title="Acknowledgement">
        <p>
          By accessing or using NARP, you acknowledge that you have read,
          understood, and agree to this Dispute Resolution Policy.
        </p>
      </LegalSection>

      <RelatedPolicies current="/legal/dispute-resolution" />
    </LegalLayout>
  );
}