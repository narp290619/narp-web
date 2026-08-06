import { getReviews } from "@/lib/firebase/reviews.service";

import {
    submitReview,
} from "@/lib/firebase/review-submit.service";

export async function getFreelancerReviews(
    freelancerId: string,
    skillId: string,
) {

    return getReviews(
        freelancerId,
        skillId,
    );

}

export {
    submitReview,
};