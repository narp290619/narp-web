
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Star,
    Users,
    MessageSquareText,
    ShieldCheck,
    Loader2,
    ChevronDown,
    AlertCircle,
    ArrowRight,
    UserRound,
    BriefcaseBusiness,
} from "lucide-react";

import { platformReviewService } from "@/lib/services/platform-review/platform-review.service";

import type {
    PlatformReview,
    PlatformReviewRole,
    PlatformReviewStatistics,
} from "@/types/platform-review";

type ReviewFilter = "all" | PlatformReviewRole;

const PAGE_SIZE = 6;

const EMPTY_DISTRIBUTION = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
};

const FILTER_OPTIONS: {
    label: string;
    value: ReviewFilter;
}[] = [
    { label: "All Reviews", value: "all" },
    { label: "Clients", value: "client" },
    { label: "Freelancers", value: "freelancer" },
];

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong. Please try again.";
}

function formatReviewDate(value: PlatformReview["createdAt"]): string {
    if (!value) return "Recently";

    let date: Date;

    if (value instanceof Date) {
        date = value;
    } else if (typeof value === "string") {
        date = new Date(value);
    } else {
        date = new Date(value.seconds * 1000);
    }

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    return new Intl.DateTimeFormat("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function StarRating({
    rating,
    size = 18,
}: {
    rating: number;
    size?: number;
}) {
    return (
        <div
            className="flex items-center gap-0.5"
            aria-label={`${rating} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    strokeWidth={1.8}
                    className={
                        star <= rating
                            ? "fill-[#ffb300] text-[#ffb300]"
                            : "fill-slate-100 text-slate-200"
                    }
                />
            ))}
        </div>
    );
}

function getReviewDateTime(value: unknown): string | undefined {
    if (!value) return undefined;

    let date: Date;

    if (
        typeof value === "object" &&
        value !== null &&
        "seconds" in value &&
        typeof value.seconds === "number"
    ) {
        date = new Date(value.seconds * 1000);
    } else if (value instanceof Date) {
        date = value;
    } else if (typeof value === "string" || typeof value === "number") {
        date = new Date(value);
    } else {
        return undefined;
    }

    return Number.isFinite(date.getTime())
        ? date.toISOString()
        : undefined;
}

function ReviewCard({ review }: { review: PlatformReview }) {
    const isClient = review.userRole === "client";
    const Icon = isClient ? UserRound : BriefcaseBusiness;

    return (
        <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg">
            {/* Reviewer */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-[#1565c0]">
                        {(review.userName || "N").charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate font-bold text-[#081a43]">
                            {review.userName || "NARP User"}
                        </h3>

                        <span
                            className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                isClient
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-amber-50 text-amber-700"
                            }`}
                        >
                            <Icon size={12} />
                            {isClient ? "Client" : "Freelancer"}
                        </span>
                    </div>
                </div>

                <time
                    className="shrink-0 text-right text-xs leading-5 text-slate-400"
                    dateTime={getReviewDateTime(review.createdAt)}
                >
                    {formatReviewDate(review.createdAt)}
                </time>
            </div>

            {/* Rating */}
            <div className="mt-6 flex items-center gap-3">
                <StarRating rating={review.rating} />
                <span className="text-sm font-bold text-[#081a43]">
                    {review.rating}.0
                </span>
            </div>

            {/* Feedback */}
            <div className="mt-4 flex-1">
                {review.feedback?.trim() ? (
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                        &ldquo;{review.feedback}&rdquo;
                    </p>
                ) : (
                    <p className="text-sm italic leading-7 text-slate-400">
                        Rated their experience with NARP.
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
                <ShieldCheck size={15} className="text-emerald-500" />
                Published NARP review
            </div>
        </article>
    );
}

function RatingDistribution({
    distribution,
    total,
}: {
    distribution: Record<string, number>;
    total: number;
}) {
    return (
        <div>
            <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Rating Distribution
                </h3>
                <span className="text-xs text-slate-400">
                    {total} reviews
                </span>
            </div>

            <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                    const count = distribution[rating.toString()] ?? 0;
                    const percentage =
                        total > 0 ? (count / total) * 100 : 0;

                    return (
                        <div
                            key={rating}
                            className="flex items-center gap-3"
                        >
                            <span className="w-3 text-sm font-semibold text-slate-600">
                                {rating}
                            </span>

                            <Star
                                size={15}
                                className="shrink-0 fill-[#ffb300] text-[#ffb300]"
                            />

                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-[#ffb300] transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <span className="w-8 text-right text-xs font-medium tabular-nums text-slate-400">
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ReviewsPageClient() {
    const [filter, setFilter] = useState<ReviewFilter>("all");

    const [statistics, setStatistics] =
        useState<PlatformReviewStatistics | null>(null);

    const [reviews, setReviews] = useState<PlatformReview[]>([]);

    const [lastDocumentId, setLastDocumentId] = useState<string | null>(
        null
    );

    const [hasMore, setHasMore] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isStatisticsLoading, setIsStatisticsLoading] = useState(true);

    const [reviewError, setReviewError] = useState<string | null>(null);
    const [statisticsError, setStatisticsError] = useState<string | null>(
        null
    );

    const [refreshKey, setRefreshKey] = useState(0);
    const [statisticsRefreshKey, setStatisticsRefreshKey] = useState(0);

    // Load overall statistics.
    useEffect(() => {
        let active = true;

        async function loadStatistics() {
            setIsStatisticsLoading(true);
            setStatisticsError(null);

            try {
                const result = await platformReviewService.getStatistics();

                if (active) {
                    setStatistics(result);
                }
            } catch (error) {
                if (active) {
                    setStatisticsError(getErrorMessage(error));
                }
            } finally {
                if (active) {
                    setIsStatisticsLoading(false);
                }
            }
        }

        void loadStatistics();

        return () => {
            active = false;
        };
    }, [statisticsRefreshKey]);

    // Load reviews whenever the selected filter changes.
    useEffect(() => {
        let active = true;

        async function loadReviews() {
            setIsLoading(true);
            setReviewError(null);
            setReviews([]);
            setLastDocumentId(null);
            setHasMore(false);

            try {
                const result = await platformReviewService.getReviews({
                    limit: PAGE_SIZE,
                    ...(filter === "all" ? {} : { role: filter }),
                });

                if (!active) return;

                setReviews(result.reviews || []);
                setLastDocumentId(result.lastDocumentId);
                setHasMore(result.hasMore);
            } catch (error) {
                if (active) {
                    setReviewError(getErrorMessage(error));
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        }

        void loadReviews();

        return () => {
            active = false;
        };
    }, [filter, refreshKey]);

    async function handleLoadMore() {
        if (isLoadingMore || !hasMore || !lastDocumentId) {
            return;
        }

        setIsLoadingMore(true);
        setReviewError(null);

        try {
            const result = await platformReviewService.getReviews({
                limit: PAGE_SIZE,
                lastDocumentId,
                ...(filter === "all" ? {} : { role: filter }),
            });

            setReviews((previous) => {
                const existingIds = new Set(
                    previous.map((review) => review.id)
                );

                const newReviews = result.reviews.filter(
                    (review) => !existingIds.has(review.id)
                );

                return [...previous, ...newReviews];
            });

            setLastDocumentId(result.lastDocumentId);
            setHasMore(result.hasMore);
        } catch (error) {
            setReviewError(getErrorMessage(error));
        } finally {
            setIsLoadingMore(false);
        }
    }

    const averageRating = statistics?.averageRating ?? 0;
    const publishedReviews = statistics?.publishedReviews ?? 0;

    const distribution =
        statistics?.ratingDistribution ?? EMPTY_DISTRIBUTION;

    const hasReviews = publishedReviews > 0;

    const emptyMessage =
        filter === "all"
            ? "There are no published reviews yet. Be one of the first to share your NARP experience."
            : `There are no published ${filter} reviews yet. Check back later or share your own experience.`;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Hero */}
            <section className="relative overflow-hidden bg-[#081a43] px-5 py-20 text-white sm:py-24">
                <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#1565c0]/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#1565c0]/20 blur-3xl" />

                <div className="relative mx-auto max-w-6xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
                        <MessageSquareText size={16} />
                        The NARP Community
                    </span>

                    <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Real Experiences.
                        <span className="block text-[#ffb300]">
                            Real People.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
                        Discover what clients and freelancers say about
                        their experiences with NARP. Every review helps us
                        build a better marketplace.
                    </p>

                    <div className="mt-9 flex flex-col items-center gap-5">
                        <Link
                            href="/reviews/write"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffb300] px-8 py-4 text-sm font-bold text-[#081a43] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-amber-400"
                        >
                            <Star
                                size={19}
                                className="fill-current"
                            />
                            Rate NARP
                            <ArrowRight size={17} />
                        </Link>

                        <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-blue-100">
                            <span className="flex items-center gap-2">
                                <ShieldCheck
                                    size={17}
                                    className="text-[#ffb300]"
                                />
                                Community feedback
                            </span>

                            <span className="flex items-center gap-2">
                                <Users
                                    size={17}
                                    className="text-[#ffb300]"
                                />
                                Clients and freelancers
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-5">
                <div className="grid gap-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8 md:grid-cols-2 md:gap-10">
                    {/* Average rating */}
                    <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-8 text-center md:border-b-0 md:border-r md:pb-0 md:pr-8">
                        <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                            Overall Rating
                        </p>

                        {isStatisticsLoading ? (
                            <div className="mt-6 flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-[#1565c0]" />
                                <span className="text-xs text-slate-400">
                                    Loading rating...
                                </span>
                            </div>
                        ) : hasReviews ? (
                            <>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-6xl font-extrabold tracking-tight text-[#081a43]">
                                        {averageRating.toFixed(1)}
                                    </span>
                                    <span className="text-lg text-slate-400">
                                        / 5
                                    </span>
                                </div>

                                <div className="mt-3">
                                    <StarRating
                                        rating={Math.round(averageRating)}
                                        size={23}
                                    />
                                </div>

                                <p className="mt-3 text-sm text-slate-500">
                                    Based on{" "}
                                    <strong className="text-[#081a43]">
                                        {publishedReviews}
                                    </strong>{" "}
                                    published{" "}
                                    {publishedReviews === 1
                                        ? "review"
                                        : "reviews"}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="mt-5 text-3xl font-extrabold text-[#081a43]">
                                    {statisticsError
                                        ? "Unavailable"
                                        : "Be the first!"}
                                </p>

                                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                                    {statisticsError
                                        ? "We couldn't load the current rating."
                                        : "NARP is waiting for its first published review."}
                                </p>

                                {!statisticsError && (
                                    <Link
                                        href="/reviews/write"
                                        className="mt-4 text-sm font-bold text-[#1565c0] hover:underline"
                                    >
                                        Share your experience
                                    </Link>
                                )}
                            </>
                        )}

                        {statisticsError && (
                            <button
                                type="button"
                                onClick={() =>
                                    setStatisticsRefreshKey(
                                        (current) => current + 1
                                    )
                                }
                                className="mt-3 text-xs font-semibold text-[#1565c0] hover:underline"
                            >
                                Retry statistics
                            </button>
                        )}
                    </div>

                    {/* Rating distribution */}
                    <div className="flex flex-col justify-center md:pl-2">
                        {isStatisticsLoading ? (
                            <div className="flex min-h-48 items-center justify-center">
                                <Loader2 className="h-7 w-7 animate-spin text-[#1565c0]" />
                            </div>
                        ) : (
                            <RatingDistribution
                                distribution={distribution}
                                total={publishedReviews}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Reviews */}
            <section className="mx-auto max-w-6xl px-5 py-20">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-wider text-[#1565c0]">
                            Community Reviews
                        </span>

                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#081a43] sm:text-4xl">
                            What People Are Saying
                        </h2>

                        <p className="mt-3 max-w-xl leading-7 text-slate-500">
                            Honest feedback from people who use NARP to
                            connect, work, and grow.
                        </p>
                    </div>

                    <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label="Filter reviews"
                    >
                        {FILTER_OPTIONS.map((option) => {
                            const selected = filter === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFilter(option.value)}
                                    aria-pressed={selected}
                                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                                        selected
                                            ? "bg-[#1565c0] text-white shadow-md shadow-blue-900/10"
                                            : "border border-slate-200 bg-white text-slate-600 hover:border-[#1565c0] hover:text-[#1565c0]"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-4">
                        <Loader2 className="h-9 w-9 animate-spin text-[#1565c0]" />
                        <p className="text-sm font-medium text-slate-500">
                            Loading community reviews...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!isLoading && reviewError && (
                    <div className="mt-10 flex flex-col items-center rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
                        <AlertCircle className="h-9 w-9 text-red-500" />

                        <p className="mt-3 font-semibold text-red-700">
                            Unable to load reviews
                        </p>

                        <p className="mt-2 max-w-lg text-sm leading-6 text-red-600">
                            {reviewError}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setRefreshKey((current) => current + 1)
                            }
                            className="mt-5 rounded-full bg-[#1565c0] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Review cards */}
                {!isLoading && !reviewError && reviews.length > 0 && (
                    <>
                        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {reviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#1565c0] bg-white px-8 py-3.5 text-sm font-bold text-[#1565c0] transition-colors hover:bg-[#1565c0] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            Load More Reviews
                                            <ChevronDown size={17} />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Empty state */}
                {!isLoading && !reviewError && reviews.length === 0 && (
                    <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#1565c0]">
                            <MessageSquareText size={30} />
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-[#081a43]">
                            No reviews found
                        </h3>

                        <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
                            {emptyMessage}
                        </p>

                        <Link
                            href="/reviews/write"
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#1565c0] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                        >
                            <Star size={16} className="fill-current" />
                            Rate NARP
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}

                {/* Bottom CTA */}
                {!isLoading && !reviewError && reviews.length > 0 && (
                    <div className="mt-16 rounded-3xl bg-[#081a43] px-6 py-10 text-center sm:px-10">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#ffb300]">
                            <MessageSquareText size={25} />
                        </div>

                        <h3 className="mt-5 text-2xl font-extrabold text-white">
                            Have a NARP story to share?
                        </h3>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-blue-100">
                            Your experience can help other clients and
                            freelancers discover a better way to work.
                        </p>

                        <Link
                            href="/reviews/write"
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#ffb300] px-7 py-3.5 text-sm font-bold text-[#081a43] transition-colors hover:bg-amber-400"
                        >
                            <Star size={17} className="fill-current" />
                            Rate NARP
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
