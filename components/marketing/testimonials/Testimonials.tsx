
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import FadeUp from "@/components/animations/FadeUp";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import TestimonialCard from "./TestimonialCard";

import { platformReviewService } from "@/lib/services/platform-review/platform-review.service";
import type { PlatformReview } from "@/types/platform-review";

export default function Testimonials() {
    const [reviews, setReviews] = useState<PlatformReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadTestimonials() {
            try {
                const result = await platformReviewService.getReviews({
                    limit: 3,
                });

                if (!isMounted) return;

                const publishedReviews = (result.reviews || [])
                    .filter(
                        (review) =>
                            review.status === "published" &&
                            typeof review.feedback === "string" &&
                            review.feedback.trim().length > 0
                    )
                    .slice(0, 3);

                setReviews(publishedReviews);
            } catch (error) {
                console.error("Failed to load homepage testimonials:", error);

                if (isMounted) {
                    setReviews([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadTestimonials();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="bg-slate-50 py-28">
            <Container>
                <FadeUp>
                    <SectionTitle
                        badge="Trusted by the Community"
                        title="Real Experiences from Clients and Freelancers"
                        subtitle="See how NARP is helping people hire trusted freelancers and grow their businesses across the Philippines."
                    />
                </FadeUp>

                {/* Testimonials */}
                {loading ? (
                    <div className="mt-20 grid gap-8 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm"
                            >
                                <div className="mb-8 h-5 w-28 rounded bg-slate-200" />
                                <div className="space-y-3">
                                    <div className="h-4 rounded bg-slate-200" />
                                    <div className="h-4 rounded bg-slate-200" />
                                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                                </div>
                                <div className="mt-10 flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-slate-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 rounded bg-slate-200" />
                                        <div className="h-3 w-24 rounded bg-slate-200" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="mt-20 grid gap-8 lg:grid-cols-3">
                        {reviews.map((review, index) => (
                            <TestimonialCard
                                key={review.id}
                                name={review.userName || "NARP User"}
                                role={review.userRole}
                                avatar={review.reviewerProfileImageUrl}
                                rating={review.rating}
                                review={review.feedback || ""}
                                className={index === 1 ? "lg:mt-8" : ""}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-20 rounded-[32px] border border-slate-200 bg-white px-6 py-16 text-center">
                        <h3 className="text-xl font-bold text-slate-900">
                            Your experience could be featured here!
                        </h3>
                        <p className="mx-auto mt-3 max-w-xl text-slate-500">
                            Be among the first to share your experience with
                            NARP and help our community grow.
                        </p>
                    </div>
                )}

                {/* View All Reviews */}
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/reviews"
                        className="
                            group
                            inline-flex
                            items-center
                            gap-3
                            rounded-full
                            bg-orange-500
                            px-8
                            py-4
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-orange-500/20
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:bg-orange-600
                            hover:shadow-xl
                        "
                    >
                        Read All Community Reviews

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </Container>
        </section>
    );
}
