
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Star,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    MessageSquareText,
    UserRound,
    BriefcaseBusiness,
    LockKeyhole,
    ArrowRight,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { platformReviewService } from "@/lib/services/platform-review/platform-review.service";

import type {
    PlatformReview,
    PlatformReviewCategoryRatings,
    PlatformReviewEligibility,
    PlatformReviewRole,
    SubmitPlatformReviewRequest,
} from "@/types/platform-review";

const CATEGORY_OPTIONS: {
    key: keyof PlatformReviewCategoryRatings;
    label: string;
    description: string;
}[] = [
    {
        key: "easeOfUse",
        label: "Ease of Use",
        description: "How easy is NARP to navigate and use?",
    },
    {
        key: "platformExperience",
        label: "Platform Experience",
        description: "How was your overall experience using NARP?",
    },
    {
        key: "paymentExperience",
        label: "Payment Experience",
        description: "How was your experience with payments?",
    },
    {
        key: "reliability",
        label: "Reliability",
        description: "How reliable has the platform been?",
    },
    {
        key: "customerSupport",
        label: "Customer Support",
        description: "How would you rate the support you received?",
    },
];

const INITIAL_CATEGORY_RATINGS: PlatformReviewCategoryRatings = {
    easeOfUse: 5,
    platformExperience: 5,
    paymentExperience: 5,
    reliability: 5,
    customerSupport: 5,
};

const ROLE_OPTIONS = [
    {
        role: "client",
        title: "Client Review",
        subtitle: "Your experience as a client",
        description:
            "Share your experience finding and working with freelancers through NARP.",
        requirement: "Requires at least one completed booking as a client.",
        icon: UserRound,
    },
    {
        role: "freelancer",
        title: "Freelancer Review",
        subtitle: "Your experience as a freelancer",
        description:
            "Tell us about your experience using NARP to offer your services.",
        requirement: "Requires a freelancer skill membership.",
        icon: BriefcaseBusiness,
    },
] as const;

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return "We couldn't submit your review. Please try again.";
}

function formatDate(value: PlatformReview["createdAt"]): string {
    if (!value) return "Recently submitted";

    const date =
        value instanceof Date
            ? value
            : typeof value === "string"
                ? new Date(value)
                : new Date(value.seconds * 1000);

    if (Number.isNaN(date.getTime())) {
        return "Recently submitted";
    }

    return new Intl.DateTimeFormat("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function StarSelector({
    value,
    onChange,
    label,
    description,
    size = "large",
}: {
    value: number;
    onChange: (value: number) => void;
    label: string;
    description?: string;
    size?: "small" | "large";
}) {
    const starSize = size === "large" ? 34 : 25;

    return (
        <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="font-semibold text-[#081a43]">{label}</p>
                    {description && (
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-[#1565c0]">
                    {value} / 5
                </span>
            </div>

            <div
                className="mt-3 flex items-center gap-1 sm:gap-2"
                role="group"
                aria-label={`${label} rating`}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        aria-label={`Rate ${star} out of 5`}
                        aria-pressed={value === star}
                        className="rounded-lg p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1565c0]"
                    >
                        <Star
                            size={starSize}
                            strokeWidth={1.8}
                            className={
                                star <= value
                                    ? "fill-[#ffb300] text-[#ffb300]"
                                    : "fill-slate-100 text-slate-300"
                            }
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

function ExistingReviewCard({
    review,
}: {
    review: PlatformReview;
}) {
    return (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Star
                        className="fill-[#ffb300] text-[#ffb300]"
                        size={18}
                    />
                    <span className="font-bold text-[#081a43]">
                        {review.rating} / 5
                    </span>
                </div>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        review.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                    }`}
                >
                    {review.status === "published" ? (
                        <CheckCircle2 size={13} />
                    ) : (
                        <LockKeyhole size={13} />
                    )}
                    {review.status === "published" ? "Published" : "Hidden"}
                </span>
            </div>

            {review.feedback?.trim() ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {review.feedback}
                </p>
            ) : (
                <p className="mt-3 text-sm italic text-slate-400">
                    No written feedback provided.
                </p>
            )}

            <p className="mt-3 text-xs text-slate-400">
                Submitted {formatDate(review.createdAt)}
            </p>
        </div>
    );
}

export default function ReviewSubmissionClient() {
    const { loading: authLoading, isAuthenticated } = useAuth();

    const [eligibility, setEligibility] =
        useState<PlatformReviewEligibility | null>(null);

    const [eligibilityLoading, setEligibilityLoading] = useState(true);
    const [eligibilityError, setEligibilityError] = useState<string | null>(
        null
    );

    const [selectedRole, setSelectedRole] =
        useState<PlatformReviewRole>("client");

    const [rating, setRating] = useState(5);

    const [categoryRatings, setCategoryRatings] =
        useState<PlatformReviewCategoryRatings>({
            ...INITIAL_CATEGORY_RATINGS,
        });

    const [feedback, setFeedback] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const loadEligibility = useCallback(async () => {
        setEligibilityLoading(true);
        setEligibilityError(null);

        try {
            const result = await platformReviewService.getEligibility();

            setEligibility(result);

            if (result.client.canReview) {
                setSelectedRole("client");
            } else if (result.freelancer.canReview) {
                setSelectedRole("freelancer");
            }
        } catch (error) {
            setEligibilityError(getErrorMessage(error));
        } finally {
            setEligibilityLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            setEligibilityLoading(false);
            return;
        }

        void loadEligibility();
    }, [authLoading, isAuthenticated, loadEligibility]);

    const selectedEligibility = eligibility?.[selectedRole];

    const availableRoles: PlatformReviewRole[] = [];

    if (eligibility?.client.canReview) {
        availableRoles.push("client");
    }

    if (eligibility?.freelancer.canReview) {
        availableRoles.push("freelancer");
    }

    const hasAvailableRole = availableRoles.length > 0;

    const bothRolesReviewed =
        Boolean(eligibility?.client.alreadyReviewed) &&
        Boolean(eligibility?.freelancer.alreadyReviewed);

    function updateCategoryRating(
        category: keyof PlatformReviewCategoryRatings,
        value: number
    ) {
        setCategoryRatings((previous) => ({
            ...previous,
            [category]: value,
        }));
    }

    function handleRoleChange(role: PlatformReviewRole) {
        setSelectedRole(role);
        setSubmitError(null);
        setSuccessMessage(null);
        setFeedback("");
        setRating(5);
        setCategoryRatings({ ...INITIAL_CATEGORY_RATINGS });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedEligibility?.canReview || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSuccessMessage(null);

        const request: SubmitPlatformReviewRequest = {
            userRole: selectedRole,
            rating,
            categoryRatings,
            feedback: feedback.trim(),
        };

        try {
            const result = await platformReviewService.submitReview(request);

            setSuccessMessage(
                result.message || "Thank you for reviewing NARP!"
            );

            setFeedback("");
            setRating(5);
            setCategoryRatings({ ...INITIAL_CATEGORY_RATINGS });

            await loadEligibility();
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (authLoading || (isAuthenticated && eligibilityLoading)) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#f8fafc]">
                <Loader2 className="h-9 w-9 animate-spin text-[#1565c0]" />
                <p className="text-sm font-medium text-slate-500">
                    Preparing your review form...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] px-5 py-12 sm:py-16">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/reviews"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#1565c0]"
                >
                    <ArrowLeft size={17} />
                    Back to Reviews
                </Link>

                {/* Page heading */}
                <div className="mt-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1565c0]">
                        <MessageSquareText size={28} />
                    </div>

                    <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#1565c0]">
                        Your voice matters
                    </p>

                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#081a43] sm:text-4xl">
                        Share Your NARP Experience
                    </h1>

                    <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                        Help us build a better marketplace. Share your honest
                        experience as a client or freelancer.
                    </p>
                </div>

                {/* Authentication */}
                {!isAuthenticated && (
                    <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-7 shadow-sm sm:p-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1565c0]">
                                <UserRound size={22} />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#081a43]">
                                    Sign in to submit a review
                                </h2>
                                <p className="mt-1 text-xs text-slate-400">
                                    NARP account required
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-500">
                            Sign in with your NARP client or freelancer account.
                            We&apos;ll check your eligibility before allowing you
                            to submit a review.
                        </p>

                        <Link
                            href="/login?redirect=%2Freviews%2Fwrite"
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1565c0] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-800 sm:w-auto"
                        >
                            Sign In to Your Account
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                )}

                {/* Eligibility error */}
                {isAuthenticated && eligibilityError && (
                    <div className="mt-8 rounded-2xl border border-red-100 bg-white p-7 shadow-sm">
                        <div className="flex items-center gap-3 text-red-600">
                            <AlertCircle size={22} />
                            <h2 className="font-bold">
                                Unable to check eligibility
                            </h2>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {eligibilityError}
                        </p>

                        <button
                            type="button"
                            onClick={() => void loadEligibility()}
                            className="mt-5 rounded-full bg-[#1565c0] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Authenticated review experience */}
                {isAuthenticated && eligibility && !eligibilityError && (
                    <>
                        {/* Eligibility section */}
                        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1565c0]">
                                    <ShieldCheck size={22} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-[#081a43]">
                                        Your Review Eligibility
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Choose the role you want to review. You
                                        can submit one review per role.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                {ROLE_OPTIONS.map((item) => {
                                    const status = eligibility[item.role];
                                    const Icon = item.icon;
                                    const isSelected = selectedRole === item.role;
                                    const isAvailable = status.canReview;
                                    const isReviewed = status.alreadyReviewed;

                                    return (
                                        <div
                                            key={item.role}
                                            className={`relative flex flex-col rounded-2xl border p-5 transition-all ${
                                                isAvailable && isSelected
                                                    ? "border-[#1565c0] bg-blue-50/60 shadow-sm ring-1 ring-[#1565c0]/20"
                                                    : isAvailable
                                                        ? "border-slate-200 bg-white hover:border-blue-200"
                                                        : "border-slate-200 bg-slate-50/70"
                                            }`}
                                        >
                                            {isAvailable && isSelected && (
                                                <span className="absolute right-4 top-4 rounded-full bg-[#1565c0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                                    Selected
                                                </span>
                                            )}

                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                                        isAvailable
                                                            ? "bg-blue-100 text-[#1565c0]"
                                                            : "bg-slate-200 text-slate-500"
                                                    }`}
                                                >
                                                    <Icon size={21} />
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-[#081a43]">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {item.subtitle}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-4 text-sm leading-6 text-slate-500">
                                                {item.description}
                                            </p>

                                            <div className="mt-4 flex-1">
                                                {isAvailable ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                                        <CheckCircle2 size={14} />
                                                        Eligible to review
                                                    </span>
                                                ) : isReviewed ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#1565c0]">
                                                        <CheckCircle2 size={14} />
                                                        Already reviewed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                                        <LockKeyhole size={13} />
                                                        Not eligible yet
                                                    </span>
                                                )}

                                                {status.reason && !isAvailable && (
                                                    <p className="mt-3 text-xs leading-5 text-slate-500">
                                                        {status.reason}
                                                    </p>
                                                )}
                                            </div>

                                            {isAvailable && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRoleChange(item.role)
                                                    }
                                                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition-all ${
                                                        isSelected
                                                            ? "bg-[#1565c0] text-white"
                                                            : "border border-[#1565c0] bg-white text-[#1565c0] hover:bg-blue-50"
                                                    }`}
                                                >
                                                    {isSelected
                                                        ? "Selected for Review"
                                                        : "Write This Review"}
                                                    {!isSelected && (
                                                        <ArrowRight size={16} />
                                                    )}
                                                </button>
                                            )}

                                            {status.review && (
                                                <ExistingReviewCard
                                                    review={status.review}
                                                />
                                            )}

                                            {!isAvailable && !isReviewed && (
                                                <p className="mt-4 text-xs leading-5 text-slate-400">
                                                    {item.requirement}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="mt-5 text-xs leading-5 text-slate-400">
                                Your Client and Freelancer reviews are separate.
                                Being eligible for one role does not automatically
                                qualify you for the other.
                            </p>
                        </section>

                        {/* Submission success */}
                        {successMessage && (
                            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                <CheckCircle2
                                    size={23}
                                    className="mt-0.5 shrink-0 text-emerald-600"
                                />

                                <div>
                                    <h3 className="font-bold text-emerald-800">
                                        Review submitted successfully!
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-emerald-700">
                                        {successMessage}
                                    </p>
                                    <p className="mt-2 text-xs text-emerald-700">
                                        Thank you for helping improve NARP.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Review form */}
                        {hasAvailableRole && selectedEligibility?.canReview && (
                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-6 sm:px-8">
                                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1565c0]">
                                        {selectedRole === "client"
                                            ? "Client Feedback"
                                            : "Freelancer Feedback"}
                                    </span>

                                    <h2 className="mt-4 text-2xl font-extrabold text-[#081a43]">
                                        Rate Your Experience
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Give us an honest rating based on your
                                        experience using NARP.
                                    </p>
                                </div>

                                <div className="px-6 py-7 sm:px-8">
                                    {/* Overall rating */}
                                    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 sm:p-6">
                                        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#1565c0]">
                                            Overall Rating
                                        </p>

                                        <StarSelector
                                            label="How would you rate NARP?"
                                            description="Your overall impression of the platform."
                                            value={rating}
                                            onChange={setRating}
                                        />

                                        <p className="mt-4 text-xs leading-5 text-slate-500">
                                            1 = Poor experience · 5 = Excellent
                                            experience
                                        </p>
                                    </div>

                                    {/* Category ratings */}
                                    <div className="mt-8">
                                        <h3 className="font-bold text-[#081a43]">
                                            Rate Different Areas
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            Help us understand what we're doing
                                            well and where we can improve.
                                        </p>

                                        <div className="mt-6 divide-y divide-slate-100">
                                            {CATEGORY_OPTIONS.map((category) => (
                                                <div
                                                    key={category.key}
                                                    className="py-6 first:pt-0 last:pb-0"
                                                >
                                                    <StarSelector
                                                        label={category.label}
                                                        description={category.description}
                                                        value={
                                                            categoryRatings[
                                                                category.key
                                                            ]
                                                        }
                                                        onChange={(value) =>
                                                            updateCategoryRating(
                                                                category.key,
                                                                value
                                                            )
                                                        }
                                                        size="small"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Written feedback */}
                                    <div className="mt-8 border-t border-slate-100 pt-7">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <label
                                                htmlFor="review-feedback"
                                                className="font-bold text-[#081a43]"
                                            >
                                                Tell Us More
                                                <span className="ml-2 text-sm font-normal text-slate-400">
                                                    Optional
                                                </span>
                                            </label>

                                            <span
                                                className={`text-xs font-medium ${
                                                    feedback.length >= 480
                                                        ? "text-amber-600"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                {feedback.length} / 500 characters
                                            </span>
                                        </div>

                                        <textarea
                                            id="review-feedback"
                                            value={feedback}
                                            onChange={(event) =>
                                                setFeedback(
                                                    event.target.value.slice(0, 500)
                                                )
                                            }
                                            maxLength={500}
                                            rows={5}
                                            placeholder="What did you like about NARP? What could we improve?"
                                            className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-[#081a43] outline-none transition-colors placeholder:text-slate-400 focus:border-[#1565c0] focus:bg-white focus:ring-2 focus:ring-blue-100"
                                        />

                                        <p className="mt-2 text-xs leading-5 text-slate-400">
                                            Keep your feedback respectful. Please
                                            avoid sharing private or sensitive
                                            information.
                                        </p>
                                    </div>

                                    {/* Submit error */}
                                    {submitError && (
                                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                                            <AlertCircle
                                                size={19}
                                                className="mt-0.5 shrink-0 text-red-500"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-red-700">
                                                    Submission unsuccessful
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-red-700">
                                                    {submitError}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit button */}
                                    <div className="mt-8 border-t border-slate-100 pt-7">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1565c0] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2
                                                        size={18}
                                                        className="animate-spin"
                                                    />
                                                    Submitting Review...
                                                </>
                                            ) : (
                                                <>
                                                    <Star
                                                        size={17}
                                                        className="fill-current"
                                                    />
                                                    Submit Review
                                                </>
                                            )}
                                        </button>

                                        <p className="mt-4 text-xs leading-5 text-slate-400">
                                            You can submit only one review per
                                            role. Once submitted, you cannot
                                            submit another review for that same
                                            role.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* No available roles */}
                        {!hasAvailableRole && (
                            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-9">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1565c0]">
                                    {bothRolesReviewed ? (
                                        <CheckCircle2 size={30} />
                                    ) : (
                                        <ShieldCheck size={30} />
                                    )}
                                </div>

                                <h2 className="mt-5 text-xl font-bold text-[#081a43]">
                                    {bothRolesReviewed
                                        ? "Thank You for Reviewing NARP!"
                                        : "You're Not Eligible to Review Yet"}
                                </h2>

                                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                    {bothRolesReviewed
                                        ? "You've already submitted your Client and Freelancer reviews. We appreciate you taking the time to share your experience."
                                        : "You don't currently meet the requirements to submit a review. Once you complete a booking as a client or qualify as a freelancer, you may become eligible."}
                                </p>

                                <Link
                                    href="/reviews"
                                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#1565c0] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                                >
                                    View Community Reviews
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
