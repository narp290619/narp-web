import HelpArticleLayout from "@/components/help/HelpArticleLayout";
import HelpNotice from "@/components/help/HelpNotice";
import HelpSection from "@/components/help/HelpSection";

export const metadata = {
    title: "Ratings & Reviews | Help Center | NARP",
    description:
        "Learn how ratings and reviews work on NARP and how they help build trust within the marketplace.",
};

export default function ReviewsHelpPage() {
    return (
        <HelpArticleLayout
            title="Ratings & Reviews"
            description="Ratings and reviews help clients make informed decisions while rewarding freelancers who consistently provide excellent service."
            currentArticle="/help/reviews"
        >
            <HelpSection title="Why Ratings Matter">
                <p>
                    Ratings and reviews are one of the most important trust
                    signals on NARP. They help clients identify reliable
                    freelancers and encourage high-quality service across the
                    platform.
                </p>

                <p>
                    Honest feedback also helps freelancers improve and grow
                    their reputation.
                </p>
            </HelpSection>

            <HelpSection title="Who Can Leave a Review?">
                <p>
                    Only clients who have successfully completed a booking may
                    submit a rating and review for that service.
                </p>

                <ul>
                    <li>Reviews are tied to completed bookings.</li>
                    <li>Only one review may be submitted per completed booking.</li>
                    <li>Reviews should reflect the actual service received.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="info"
                title="Verified Reviews"
            >
                Reviews are linked to completed bookings, helping ensure that
                feedback comes from genuine client experiences.
            </HelpNotice>

            <HelpSection title="Writing Helpful Reviews">
                <p>
                    A useful review focuses on facts and personal experience.
                </p>

                <ul>
                    <li>Quality of work.</li>
                    <li>Punctuality.</li>
                    <li>Professionalism.</li>
                    <li>Communication.</li>
                    <li>Overall satisfaction.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Review Guidelines">
                <p>
                    Reviews should always be respectful and truthful.
                </p>

                <ul>
                    <li>Be honest.</li>
                    <li>Remain respectful.</li>
                    <li>Focus on the completed service.</li>
                    <li>Avoid sharing personal information.</li>
                    <li>Do not post misleading or false statements.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="warning"
                title="Reviews May Be Removed"
            >
                NARP may remove reviews that violate our Community Guidelines,
                Acceptable Use Policy, or applicable laws.
            </HelpNotice>

            <HelpSection title="Reviews That Are Not Allowed">
                <ul>
                    <li>Spam or promotional content.</li>
                    <li>Offensive or abusive language.</li>
                    <li>Discriminatory or hateful content.</li>
                    <li>Threats or harassment.</li>
                    <li>False or misleading information.</li>
                    <li>Reviews unrelated to the completed booking.</li>
                </ul>
            </HelpSection>

            <HelpSection title="How Ratings Affect Freelancers">
                <p>
                    Ratings contribute to a freelancer's public reputation on
                    NARP.
                </p>

                <ul>
                    <li>Higher ratings improve trust.</li>
                    <li>Positive reviews may increase booking opportunities.</li>
                    <li>Consistently poor ratings may reduce visibility.</li>
                    <li>Serious policy violations may result in account action.</li>
                </ul>
            </HelpSection>

            <HelpSection title="Can I Edit My Review?">
                <p>
                    Depending on platform features available at the time, NARP
                    may allow clients to edit or update a review for a limited
                    period after submission.
                </p>

                <p>
                    Once finalized, reviews generally become part of the
                    freelancer's permanent reputation history.
                </p>
            </HelpSection>

            <HelpSection title="Reporting an Inappropriate Review">
                <p>
                    If you believe a review violates NARP policies, you may
                    report it for review.
                </p>

                <ul>
                    <li>Open the review.</li>
                    <li>Select the Report option.</li>
                    <li>Choose the appropriate reason.</li>
                    <li>Submit any supporting information.</li>
                </ul>
            </HelpSection>

            <HelpNotice
                type="success"
                title="Building Trust"
            >
                Honest reviews benefit everyone. They help clients choose the
                right freelancer and encourage professionals to maintain high
                standards of service.
            </HelpNotice>

            <HelpSection title="Need More Help?">
                <p>
                    If you have questions about ratings, reviews, or believe a
                    review should be investigated, please contact NARP Support
                    with your booking reference and any relevant information.
                </p>
            </HelpSection>
        </HelpArticleLayout>
    );
}