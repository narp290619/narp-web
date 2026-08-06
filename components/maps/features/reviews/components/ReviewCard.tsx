"use client";

import { Review } from "@/lib/models/review";

import { useUserById } from "@/hooks/useUserById";

import ReviewHeader from "./ReviewHeader";
import ReviewBody from "./ReviewBody";
import FreelancerReply from "./FreelancerReply";
import ReviewActions from "./ReviewActions";

interface Props {

    review: Review;

    onReply?: () => void;

}

export default function ReviewCard({

    review,

    onReply,

}: Props) {

    const {

        user,

        loading,

    } = useUserById(

        review.clientId,

    );

    const reply = review.replies?.find(

        (reply) => !reply.isDeleted,

    );

    return (

        <article
            className="
                rounded-2xl
                border
                bg-white
                p-6
                shadow-sm
            "
        >

            <ReviewHeader

                clientName={

                    loading

                        ? "Loading..."

                        : user

                            ? `${user.firstName} ${user.lastName}`

                            : "Anonymous"

                }

                clientProfileImageUrl={

                    user?.profileImageUrl

                }

                clientVerified={

                    user?.isVerified

                }

                rating={

                    review.rating

                }

                createdAt={

                    review.createdAt

                }

            />

            <ReviewBody

                comment={

                    review.comment

                }

            />

            <FreelancerReply

                reply={

                    reply?.message

                }

            />

            <ReviewActions

                canReply={

                    !reply

                }

                onReply={

                    onReply

                }

            />

        </article>

    );

}