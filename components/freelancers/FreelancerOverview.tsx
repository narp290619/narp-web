import { User } from "lucide-react";

import type { SkillMember } from "@/lib/models/skill-member";
import type { Review } from "@/lib/models/review";

import FreelancerPortfolio from "./FreelancerPortfolio";

import ReviewSummaryCard
    from "@/components/maps/features/reviews/components/ReviewSummaryCard";

// import ReviewCard
//     from "@/components/maps/features/reviews/components/ReviewCard";

import ReviewList
    from "@/components/maps/features/reviews/components/ReviewList";

interface Props {

    member: SkillMember;

    reviews: Review[];

}

export default function FreelancerOverview({

    member,

    reviews,

}: Props) {

    return (

        <div
            className="
                space-y-8
            "
        >

            {/* About */}

            <section
                className="
                    rounded-3xl
                    border
                    bg-white
                    p-8
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <User className="text-orange-500" />

                    <h2
                        className="
                            text-2xl
                            font-bold
                        "
                    >

                        About

                    </h2>

                </div>

                <p
                    className="
                        mt-6
                        whitespace-pre-line
                        leading-8
                        text-slate-600
                    "
                >

                    {
                        member.aboutMemberSkill ||
                        "No description provided."
                    }

                </p>

            </section>

            {/* Portfolio */}

            <FreelancerPortfolio
                member={member}
            />

            {/* Reviews */}

            <section
                className="
                    rounded-3xl
                    border
                    bg-white
                    p-8
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                            "
                        >

                            Reviews

                        </h2>

                        <p
                            className="
                                mt-2
                                text-slate-500
                            "
                        >

                            Verified feedback from previous clients.

                        </p>

                    </div>

                    <div
                        className="
                            rounded-full
                            bg-orange-50
                            px-4
                            py-2
                            font-semibold
                            text-orange-600
                        "
                    >

                        {member.reviewCount} Reviews

                    </div>

                </div>

                <div className="mt-8">

                    <ReviewSummaryCard

                        rating={member.rating}

                        reviewCount={member.reviewCount}

                        rating1={member.rating1 ?? 0}

                        rating2={member.rating2 ?? 0}

                        rating3={member.rating3 ?? 0}

                        rating4={member.rating4 ?? 0}

                        rating5={member.rating5 ?? 0}

                    />

                </div>

                {/* {

                    reviews.length === 0 ? (

                        <div
                            className="
                                mt-8
                                rounded-2xl
                                border-2
                                border-dashed
                                py-20
                                text-center
                            "
                        >

                            <h3
                                className="
                                    text-xl
                                    font-semibold
                                "
                            >

                                No reviews yet

                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-slate-500
                                "
                            >

                                This freelancer hasn't received any reviews yet.

                            </p>

                        </div>

                    ) : (

                        <div
                            className="
                                mt-8
                                space-y-6
                            "
                        >

                            {

                                reviews.map((review) => (

                                    <ReviewCard

                                        key={review.id}

                                        review={review}

                                    />

                                ))

                            }

                        </div>

                    )

                } */}

                <div className="mt-8">

                    <ReviewList

                        freelancerId={member.userId}

                        skillId={member.skillId}

                        initialReviews={reviews}

                    />

                </div>

            </section>

        </div>

    );

}