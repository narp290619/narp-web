import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpSection from "@/components/help/HelpSection";
import HelpNotice from "@/components/help/HelpNotice";

export const metadata = {
    title: "Reviews | NARP Help Center",
    description:
        "Learn how NARP ratings and reviews work, what you can review, and how inappropriate or fraudulent reviews are handled.",
};

const tocItems = [
    {
        id: "how-reviews-work",
        title: "How Reviews Work",
    },
    {
        id: "leaving-review",
        title: "Leaving a Review",
    },
    {
        id: "review-content",
        title: "Review Guidelines",
    },
    {
        id: "review-removal",
        title: "Review Removal",
    },
    {
        id: "rating",
        title: "Ratings",
    },
    {
        id: "review-problems",
        title: "Review Problems",
    },
];

export default function ReviewsHelpPage() {
    return (
        <HelpArticleLayout
            title="Reviews"
            description="Learn how ratings and reviews work on NARP and how to provide useful, honest feedback."
            currentArticle="reviews"
            tocItems={tocItems}
        >
            <div className="space-y-10">

                <HelpSection
                    id="how-reviews-work"
                    title="How Reviews Work"
                >
                    <p>
                        Reviews allow clients and, where applicable,
                        freelancers to provide feedback based on their
                        actual experience with a completed service.
                    </p>

                    <p>
                        Reviews help users evaluate service providers and
                        make more informed decisions.
                    </p>
                </HelpSection>

                <HelpSection
                    id="leaving-review"
                    title="Leaving a Review"
                >
                    <p>
                        After an eligible service has been completed, you may
                        be given the opportunity to submit a rating and
                        written review.
                    </p>

                    <p>
                        Your review should accurately describe your actual
                        experience with the service.
                    </p>
                </HelpSection>

                <HelpSection
                    id="review-content"
                    title="Review Guidelines"
                >
                    <p>
                        Reviews should be:
                    </p>

                    <ul>
                        <li>Truthful and based on actual experience.</li>
                        <li>Relevant to the service provided.</li>
                        <li>Respectful and professional.</li>
                        <li>Free from threats or abusive language.</li>
                    </ul>

                    <HelpNotice type="warning">
                        Do not use reviews to post personal information,
                        threats, fraudulent claims, or content unrelated to
                        the actual service experience.
                    </HelpNotice>
                </HelpSection>

                <HelpSection
                    id="review-removal"
                    title="Review Removal"
                >
                    <p>
                        NARP may remove or restrict reviews that violate
                        platform rules or applicable policies.
                    </p>

                    <p>
                        This may include reviews that:
                    </p>

                    <ul>
                        <li>Contain fraudulent or manipulated information.</li>
                        <li>Include harassment or threats.</li>
                        <li>Contain illegal or prohibited content.</li>
                        <li>Include inappropriate personal information.</li>
                        <li>Violate NARP policies.</li>
                    </ul>
                </HelpSection>

                <HelpSection
                    id="rating"
                    title="Ratings"
                >
                    <p>
                        Ratings contribute to a freelancer's overall
                        reputation on NARP.
                    </p>

                    <p>
                        Ratings and reviews are user-generated content and
                        should not be interpreted as guarantees or endorsements
                        by NARP.
                    </p>
                </HelpSection>

                <HelpSection
                    id="review-problems"
                    title="Review Problems"
                >
                    <p>
                        If you believe a review violates NARP's policies,
                        contact NARP Support and provide the relevant
                        information.
                    </p>

                    <HelpNotice type="info">
                        NARP may review reported content and take appropriate
                        action based on the available information and
                        applicable policies.
                    </HelpNotice>
                </HelpSection>

            </div>
        </HelpArticleLayout>
    );
}