"use client";

import {

    useCallback,

    useEffect,

    useState,

} from "react";

import { Review } from "@/lib/models/review";

import {

    getFreelancerReviews,

} from "@/repositories/review.repository";

import ReviewCard from "./ReviewCard";
import ReviewReplyDialog from "./ReviewReplyDialog";

interface Props {

    freelancerId: string;

    skillId: string;

    initialReviews?: Review[];

}

export default function ReviewList({

    freelancerId,

    skillId,

    initialReviews,

}: Props) {

    const [

        reviews,

        setReviews,

    ] = useState<Review[]>(

        initialReviews ?? []

    );

    const [

        loading,

        setLoading,

    ] = useState(

        initialReviews ? false : true

    );
    const [

        selectedReview,

        setSelectedReview,

    ] = useState<Review | null>(null);

    const [

        replyDialogOpen,

        setReplyDialogOpen,

    ] = useState(false);

    // const refreshReviews = useCallback(

    //     async () => {

    //         try {

    //             setLoading(true);

    //             const data =

    //                 await getFreelancerReviews(

    //                     freelancerId,

    //                     skillId,

    //                 );

    //             setReviews(

    //                 data,

    //             );

    //         }

    //         catch (error) {

    //             console.error(

    //                 "Failed to load reviews",

    //                 error,

    //             );

    //         }

    //         finally {

    //             setLoading(false);

    //         }

    //     },

    //     [

    //         freelancerId,

    //         skillId,

    //     ],

    // );


    //
    // Reload reviews after any mutation
    // (reply, edit, delete, helpful vote, etc.)
    //
    async function refreshReviews() {

        setLoading(true);

        try {

            const data = await getFreelancerReviews(

                freelancerId,

                skillId,

            );

            setReviews(data);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        if (initialReviews) {

            return;

        }

        refreshReviews();

    }, [

        freelancerId,

        skillId,

        initialReviews,

    ]);

    if (loading) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    bg-white
                    p-6
                "
            >

                Loading reviews...

            </div>

        );

    }

    if (

        reviews.length === 0

    ) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    bg-white
                    p-6
                    text-slate-500
                "
            >

                No reviews yet.

            </div>

        );

    }

    return (

        <>

            <div
                className="
                    space-y-5
                "
            >

                {

                    reviews.map(

                        (

                            review,

                        ) => (

                            <ReviewCard

                                key={

                                    review.id

                                }

                                review={

                                    review

                                }

                                onReply={() => {

                                    setSelectedReview(

                                        review,

                                    );

                                    setReplyDialogOpen(

                                        true,

                                    );

                                }}

                            />

                        ),

                    )

                }

            </div>

            {

                selectedReview && (

                    <ReviewReplyDialog

                        open={

                            replyDialogOpen

                        }

                        reviewId={

                            selectedReview.id

                        }

                        onClose={() => {

                            setReplyDialogOpen(

                                false,

                            );

                            setSelectedReview(

                                null,

                            );

                        }}

                        onSuccess={

                            refreshReviews

                        }

                    />

                )

            }

        </>

    );

}