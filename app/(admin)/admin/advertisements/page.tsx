
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    collection,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    Image as ImageIcon,
    Loader2,
    Megaphone,
    RefreshCw,
    Search,
    X,
    XCircle,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { getInstallationId } from "@/lib/session";

type AdvertisementStatus =
    | "draft"
    | "pending_payment"
    | "pending_review"
    | "approved"
    | "active"
    | "scheduled"
    | "paused"
    | "rejected"
    | "expired";

type Advertisement = {
    id: string;
    advertisementId?: string;
    advertiserId: string;
    advertiserType: "freelancer" | "business";
    freelancerName?: string;
    freelancerImageUrl?: string;
    skillId?: string;
    skillMemberId?: string;
    businessName?: string;
    businessDescription?: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    imageStoragePath?: string;
    imageGeneration?: string;
    placement?: string;
    packageId?: string;
    packageName?: string;
    price?: number;
    currency?: string;
    durationDays?: number;
    status: AdvertisementStatus;
    paymentStatus: string;
    pendingRevisionId?: string | null;
    startAt?: Timestamp | Date | null;
    endAt?: Timestamp | Date | null;
    createdAt?: Timestamp | Date | null;
    updatedAt?: Timestamp | Date | null;
    reviewedAt?: Timestamp | Date | null;
    reviewedBy?: string | null;
    rejectionReason?: string | null;
    [key: string]: unknown;
};

type StatusFilter =
    | "pending_review"
    | "approved"
    | "active"
    | "rejected"
    | "all";

const functions = getFunctions(undefined, "asia-southeast1");

const approveAdvertisementCallable = httpsCallable<
    {
        advertisementId: string;
        installationId: string;
        clientPlatform: "web";
    },
    { success: boolean; message?: string }
>(functions, "approveAdvertisement");

const rejectAdvertisementCallable = httpsCallable<
    {
        advertisementId: string;
        rejectionReason: string;
        installationId: string;
        clientPlatform: "web";
    },
    { success: boolean; message?: string }
>(functions, "rejectAdvertisement");

const activateAdvertisementCallable = httpsCallable<
    {
        advertisementId: string;
        installationId: string;
        clientPlatform: "web";
    },
    { success: boolean; message?: string }
>(functions, "activateAdvertisement");

const getAdvertisementImageUrlCallable = httpsCallable<
    {
        advertisementId: string;
        installationId: string;
        clientPlatform: "web";
    },
    { success: boolean; url: string; expiresAt: number }
>(functions, "getAdvertisementImageUrl");

function getDateValue(value?: Timestamp | Date | null): Date | null {
    if (!value) return null;

    if (value instanceof Date) return value;

    if (value instanceof Timestamp) return value.toDate();

    return null;
}

function formatDate(value?: Timestamp | Date | null): string {
    const date = getDateValue(value);

    if (!date) return "—";

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatCurrency(
    amount?: number,
    currency = "PHP"
): string {
    if (typeof amount !== "number") return "—";

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency,
    }).format(amount);
}

function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending_review: "Pending Review",
        approved: "Approved",
        active: "Active",
        scheduled: "Scheduled",
        paused: "Paused",
        rejected: "Rejected",
        expired: "Expired",
        pending_payment: "Pending Payment",
        draft: "Draft",
    };

    return labels[status] ?? status;
}

function getStatusClasses(status: string): string {
    const classes: Record<string, string> = {
        pending_review: "bg-amber-100 text-amber-800",
        approved: "bg-blue-100 text-blue-800",
        active: "bg-green-100 text-green-800",
        scheduled: "bg-indigo-100 text-indigo-800",
        paused: "bg-gray-100 text-gray-700",
        rejected: "bg-red-100 text-red-800",
        expired: "bg-gray-100 text-gray-600",
        pending_payment: "bg-orange-100 text-orange-800",
        draft: "bg-gray-100 text-gray-600",
    };

    return classes[status] ?? "bg-gray-100 text-gray-700";
}

function getPaymentStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
        unpaid: "Unpaid",
        pending: "Pending Verification",
        verified: "Verified",
        rejected: "Rejected",
    };

    return labels[status || "unpaid"] ?? (status || "Unpaid");
}

function getPaymentStatusClasses(status?: string): string {
    const classes: Record<string, string> = {
        unpaid: "bg-gray-100 text-gray-700",
        pending: "bg-amber-100 text-amber-800",
        verified: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
    };

    return classes[status || "unpaid"] ?? "bg-gray-100 text-gray-700";
}

function hasPendingRevision(ad: Advertisement): boolean {
    return (
        typeof ad.pendingRevisionId === "string" &&
        ad.pendingRevisionId.trim().length > 0
    );
}

function canApproveOrReject(ad: Advertisement): boolean {
    return (
        ad.status === "pending_review" &&
        ad.paymentStatus === "unpaid"
    );
}

function canActivate(ad: Advertisement): boolean {
    return (
        ad.status === "approved" &&
        ad.paymentStatus === "verified" &&
        !hasPendingRevision(ad)
    );
}

function getErrorMessage(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
    ) {
        return String(error.message);
    }

    return "An unexpected error occurred.";
}

export default function AdminAdvertisementsPage() {
    const [advertisements, setAdvertisements] = useState<
        Advertisement[]
    >([]);

    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("pending_review");

    const [selectedAdvertisement, setSelectedAdvertisement] =
        useState<Advertisement | null>(null);

    const [rejectingAdvertisement, setRejectingAdvertisement] =
        useState<Advertisement | null>(null);

    const [rejectionReason, setRejectionReason] = useState("");

    const [processingId, setProcessingId] = useState<string | null>(
        null
    );

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loadAdvertisements = useCallback(async () => {
        try {
            setError(null);

            const snapshot = await getDocs(
                collection(db, "Advertisements")
            );

            const items = snapshot.docs.map((document) => {
                const data = document.data();

                return {
                    id: document.id,
                    ...data,
                } as Advertisement;
            });

            items.sort((a, b) => {
                const dateA = getDateValue(a.createdAt)?.getTime() ?? 0;
                const dateB = getDateValue(b.createdAt)?.getTime() ?? 0;

                return dateB - dateA;
            });

            setAdvertisements(items);
        } catch (err) {
            console.error(
                "[ADMIN ADVERTISEMENTS] Failed to load advertisements:",
                err
            );

            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadAdvertisements();
    }, [loadAdvertisements]);

    const refreshAdvertisements = async () => {
        setIsRefreshing(true);
        await loadAdvertisements();
    };

    const counts = useMemo(() => {
        return {
            pending_review: advertisements.filter(
                (ad) => ad.status === "pending_review"
            ).length,

            approved: advertisements.filter(
                (ad) => ad.status === "approved"
            ).length,

            active: advertisements.filter(
                (ad) => ad.status === "active"
            ).length,

            rejected: advertisements.filter(
                (ad) => ad.status === "rejected"
            ).length,

            all: advertisements.length,
        };
    }, [advertisements]);

    const filteredAdvertisements = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return advertisements.filter((ad) => {
            const matchesStatus =
                statusFilter === "all" ||
                ad.status === statusFilter;

            const searchableValues = [
                ad.id,
                ad.advertisementId,
                ad.advertiserId,
                ad.title,
                ad.description,
                ad.businessName,
                ad.freelancerName,
                ad.skillId,
                ad.packageName,
            ];

            const matchesSearch =
                !normalizedSearch ||
                searchableValues.some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(normalizedSearch)
                );

            return matchesStatus && matchesSearch;
        });
    }, [advertisements, search, statusFilter]);

    useEffect(() => {
        let cancelled = false;

        const loadImages = async () => {
            const missingImages = filteredAdvertisements.filter(
                (ad) => ad.imageStoragePath && !imageUrls[ad.id]
            );

            if (missingImages.length === 0) return;

            const results = await Promise.all(
                missingImages.map(async (ad) => {
                    try {
                        const result = await getAdvertisementImageUrlCallable({
                            advertisementId: ad.advertisementId || ad.id,
                            installationId: getInstallationId(),
                            clientPlatform: "web",
                        });

                        return [ad.id, result.data.url] as const;
                    } catch (err) {
                        console.error(
                            `[ADMIN ADVERTISEMENTS] Image load failed for ${ad.id}:`,
                            err
                        );

                        return null;
                    }
                })
            );

            if (cancelled) return;

            const loadedImages = Object.fromEntries(
                results.filter(
                    (item): item is readonly [string, string] => item !== null
                )
            );

            setImageUrls((previous) => ({
                ...previous,
                ...loadedImages,
            }));
        };

        void loadImages();

        return () => {
            cancelled = true;
        };
    }, [filteredAdvertisements, imageUrls]);

    const handleApprove = async (ad: Advertisement) => {
        const advertisementId = ad.advertisementId || ad.id;

        if (!canApproveOrReject(ad)) {
            setError(
                "Only advertisements awaiting content review with unpaid status can be approved."
            );
            return;
        }

        const confirmed = window.confirm(
            `Approve "${ad.title}"?\n\nThis approves the advertisement content only. The advertiser must submit payment afterward. The advertisement will not be published yet.`
        );

        if (!confirmed) return;

        try {
            setProcessingId(ad.id);
            setError(null);
            setSuccess(null);

            const installationId = getInstallationId();

            const result = await approveAdvertisementCallable({
                advertisementId,
                installationId,
                clientPlatform: "web",
            });

            setSuccess(
                result.data.message ||
                "Advertisement content approved. Awaiting advertiser payment."
            );

            setSelectedAdvertisement(null);

            await loadAdvertisements();
        } catch (err) {
            console.error(
                "[ADMIN ADVERTISEMENTS] Approval failed:",
                err
            );

            setError(getErrorMessage(err));
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!rejectingAdvertisement) return;

        const ad = rejectingAdvertisement;
        const advertisementId = ad.advertisementId || ad.id;
        const reason = rejectionReason.trim();

        if (reason.length < 3 || reason.length > 500) {
            setError(
                "Rejection reason must contain between 3 and 500 characters."
            );
            return;
        }

        if (!canApproveOrReject(ad)) {
            setError(
                "This advertisement is no longer eligible for content review."
            );
            return;
        }

        try {
            setProcessingId(ad.id);
            setError(null);
            setSuccess(null);

            const installationId = getInstallationId();

            const result = await rejectAdvertisementCallable({
                advertisementId,
                rejectionReason: reason,
                installationId,
                clientPlatform: "web",
            });

            setSuccess(
                result.data.message ||
                "Advertisement content rejected."
            );

            setRejectingAdvertisement(null);
            setSelectedAdvertisement(null);
            setRejectionReason("");

            await loadAdvertisements();
        } catch (err) {
            console.error(
                "[ADMIN ADVERTISEMENTS] Rejection failed:",
                err
            );

            setError(getErrorMessage(err));
        } finally {
            setProcessingId(null);
        }
    };

    const handleActivate = async (ad: Advertisement) => {
        const advertisementId = ad.advertisementId || ad.id;

        if (!canActivate(ad)) {
            setError(
                "This advertisement must have approved content, verified payment, and no pending revision before activation."
            );
            return;
        }

        const confirmed = window.confirm(
            `Activate "${ad.title}"?\n\nThis will publish the advertisement to the homepage Promo Slider and start its campaign duration.`
        );

        if (!confirmed) return;

        try {
            setProcessingId(ad.id);
            setError(null);
            setSuccess(null);

            const installationId = getInstallationId();

            const result = await activateAdvertisementCallable({
                advertisementId,
                installationId,
                clientPlatform: "web",
            });

            setSuccess(
                result.data.message ||
                "Advertisement activated successfully."
            );

            setSelectedAdvertisement(null);

            await loadAdvertisements();
        } catch (err) {
            console.error(
                "[ADMIN ADVERTISEMENTS] Activation failed:",
                err
            );

            setError(getErrorMessage(err));
        } finally {
            setProcessingId(null);
        }
    };

    const openRejectDialog = (ad: Advertisement) => {
        setError(null);
        setRejectionReason("");
        setRejectingAdvertisement(ad);
    };

    const statusTabs: {
        label: string;
        value: StatusFilter;
        count: number;
    }[] = [
        {
            label: "Pending Review",
            value: "pending_review",
            count: counts.pending_review,
        },
        {
            label: "Approved",
            value: "approved",
            count: counts.approved,
        },
        {
            label: "Active",
            value: "active",
            count: counts.active,
        },
        {
            label: "Rejected",
            value: "rejected",
            count: counts.rejected,
        },
        {
            label: "All",
            value: "all",
            count: counts.all,
        },
    ];

    return (
        <div className="space-y-6 p-4 sm:p-6">
            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Megaphone className="h-6 w-6 text-gray-700" />
                        <h1 className="text-2xl font-bold text-gray-900">
                            Advertisement Review
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        Review advertisement content, verify payment, and activate advertiser campaigns.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={refreshAdvertisements}
                    disabled={isRefreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <SummaryCard
                    label="Pending Review"
                    value={counts.pending_review}
                    icon={<Clock className="h-5 w-5" />}
                    color="amber"
                />

                <SummaryCard
                    label="Approved"
                    value={counts.approved}
                    icon={<CheckCircle className="h-5 w-5" />}
                    color="blue"
                />

                <SummaryCard
                    label="Active"
                    value={counts.active}
                    icon={<Megaphone className="h-5 w-5" />}
                    color="green"
                />

                <SummaryCard
                    label="Rejected"
                    value={counts.rejected}
                    icon={<XCircle className="h-5 w-5" />}
                    color="red"
                />
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="break-words">{error}</p>
                    <button
                        type="button"
                        onClick={() => setError(null)}
                        className="ml-auto"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>{success}</p>
                    <button
                        type="button"
                        onClick={() => setSuccess(null)}
                        className="ml-auto"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => setStatusFilter(tab.value)}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                    statusFilter === tab.value
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {tab.label}
                                <span className="ml-2 opacity-70">
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search title, advertiser, ID, or package..."
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Advertisement list */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {isLoading ? (
                    <div className="flex min-h-64 items-center justify-center">
                        <Loader2 className="h-7 w-7 animate-spin text-gray-500" />
                    </div>
                ) : filteredAdvertisements.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                        <Megaphone className="mb-3 h-10 w-10 text-gray-300" />

                        <h3 className="font-semibold text-gray-900">
                            No advertisements found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            There are no advertisements matching this filter.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredAdvertisements.map((ad) => {
                            const isProcessing = processingId === ad.id;

                            return (
                                <div
                                    key={ad.id}
                                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                                >
                                    {/* Image */}
                                    <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:w-36">
                                        {imageUrls[ad.id] ? (
                                            <img
                                                src={imageUrls[ad.id]}
                                                alt={ad.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="h-8 w-8 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Information */}
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {ad.title || "Untitled Advertisement"}
                                            </h3>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                                                    ad.status
                                                )}`}
                                            >
                                                {getStatusLabel(ad.status)}
                                            </span>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClasses(
                                                    ad.paymentStatus
                                                )}`}
                                            >
                                                Payment: {getPaymentStatusLabel(ad.paymentStatus)}
                                            </span>

                                            {hasPendingRevision(ad) && (
                                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                                                    Revision Pending
                                                </span>
                                            )}
                                        </div>

                                        <p className="line-clamp-2 text-sm text-gray-600">
                                            {ad.description || "No description provided."}
                                        </p>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                            <span>
                                                Advertiser:{" "}
                                                <strong className="text-gray-700">
                                                    {ad.advertiserType === "freelancer"
                                                        ? ad.freelancerName || "Freelancer"
                                                        : ad.businessName || "Business"}
                                                </strong>
                                            </span>

                                            <span>
                                                Type: {ad.advertiserType}
                                            </span>

                                            <span>
                                                Package: {ad.packageName || "—"}
                                            </span>

                                            <span>
                                                {formatCurrency(ad.price, ad.currency)}
                                            </span>

                                            <span>
                                                {ad.durationDays ?? "—"} days
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-400">
                                            Submitted: {formatDate(ad.createdAt)}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedAdvertisement(ad)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </button>

                                        {ad.status === "pending_review" && (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={isProcessing || !canApproveOrReject(ad)}
                                                    onClick={() => handleApprove(ad)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4" />
                                                    )}
                                                    Approve
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={isProcessing || !canApproveOrReject(ad)}
                                                    onClick={() => openRejectDialog(ad)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        {ad.status === "approved" &&
                                            ad.paymentStatus === "verified" &&
                                            !hasPendingRevision(ad) && (
                                                <button
                                                    type="button"
                                                    disabled={isProcessing}
                                                    onClick={() => handleActivate(ad)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Megaphone className="h-4 w-4" />
                                                    )}
                                                    Activate
                                                </button>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500">
                Showing {filteredAdvertisements.length} of{" "}
                {advertisements.length} advertisements.
            </p>

            {/* Advertisement details modal */}
            {selectedAdvertisement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Advertisement Details
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedAdvertisement(null)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <AdvertisementDetails
                            advertisement={selectedAdvertisement}
                            imageUrl={imageUrls[selectedAdvertisement.id]}
                        />

                        <div className="flex flex-wrap justify-end gap-2 border-t p-4">
                            <button
                                type="button"
                                onClick={() => setSelectedAdvertisement(null)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>

                            {selectedAdvertisement.status === "pending_review" && (
                                <>
                                    <button
                                        type="button"
                                        disabled={
                                            processingId === selectedAdvertisement.id ||
                                            !canApproveOrReject(selectedAdvertisement)
                                        }
                                        onClick={() =>
                                            openRejectDialog(selectedAdvertisement)
                                        }
                                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        Reject
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            processingId === selectedAdvertisement.id ||
                                            !canApproveOrReject(selectedAdvertisement)
                                        }
                                        onClick={() =>
                                            handleApprove(selectedAdvertisement)
                                        }
                                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                </>
                            )}

                            {canActivate(selectedAdvertisement) && (
                                <button
                                    type="button"
                                    disabled={
                                        processingId === selectedAdvertisement.id
                                    }
                                    onClick={() =>
                                        handleActivate(selectedAdvertisement)
                                    }
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Activate Advertisement
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection modal */}
            {rejectingAdvertisement && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Reject Advertisement
                            </h2>

                            <button
                                type="button"
                                onClick={() => setRejectingAdvertisement(null)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-3 p-4">
                            <p className="text-sm text-gray-600">
                                You are rejecting:
                            </p>

                            <p className="font-semibold text-gray-900">
                                {rejectingAdvertisement.title}
                            </p>

                            <label
                                htmlFor="rejectionReason"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Rejection reason
                            </label>

                            <textarea
                                id="rejectionReason"
                                rows={5}
                                maxLength={500}
                                value={rejectionReason}
                                onChange={(event) =>
                                    setRejectionReason(event.target.value)
                                }
                                placeholder="Explain why this advertisement cannot be approved..."
                                className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                            />

                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Minimum 3 characters</span>
                                <span>{rejectionReason.length}/500</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t p-4">
                            <button
                                type="button"
                                onClick={() => setRejectingAdvertisement(null)}
                                disabled={processingId !== null}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={
                                    processingId !== null ||
                                    rejectionReason.trim().length < 3 ||
                                    rejectionReason.trim().length > 500
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {processingId !== null && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: "amber" | "blue" | "green" | "red";
}) {
    const colors = {
        amber: "bg-amber-50 text-amber-700",
        blue: "bg-blue-50 text-blue-700",
        green: "bg-green-50 text-green-700",
        red: "bg-red-50 text-red-700",
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{label}</p>

                <div className={`rounded-lg p-2 ${colors[color]}`}>
                    {icon}
                </div>
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}

function AdvertisementDetails({
    advertisement: ad,
    imageUrl,
}: {
    advertisement: Advertisement;
    imageUrl?: string;
}) {
    const advertiserName =
        ad.advertiserType === "freelancer"
            ? ad.freelancerName || "Freelancer"
            : ad.businessName || "Business";

    return (
        <div className="space-y-5 p-5">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={ad.title}
                    className="max-h-72 w-full rounded-lg bg-gray-100 object-contain"
                />
            ) : (
                <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
            )}

            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">
                        {ad.title}
                    </h3>

                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            ad.status
                        )}`}
                    >
                        {getStatusLabel(ad.status)}
                    </span>

                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentStatusClasses(
                            ad.paymentStatus
                        )}`}
                    >
                        Payment: {getPaymentStatusLabel(ad.paymentStatus)}
                    </span>

                    {hasPendingRevision(ad) && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                            Revision Pending
                        </span>
                    )}
                </div>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {ad.description || "No description provided."}
                </p>
            </div>

            {ad.advertiserType === "business" &&
                ad.businessDescription && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                            Business Description
                        </h4>

                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                            {ad.businessDescription}
                        </p>
                    </div>
                )}

            <div className="grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2">
                <Detail label="Advertiser" value={advertiserName} />
                <Detail
                    label="Advertiser Type"
                    value={ad.advertiserType}
                />
                <Detail label="Advertiser UID" value={ad.advertiserId} />
                <Detail label="Skill ID" value={ad.skillId || "—"} />
                <Detail label="Advertisement ID" value={ad.id} />
                <Detail label="Package" value={ad.packageName || "—"} />
                <Detail
                    label="Price"
                    value={formatCurrency(ad.price, ad.currency)}
                />
                <Detail
                    label="Campaign Duration"
                    value={`${ad.durationDays ?? "—"} days`}
                />
                <Detail
                    label="Payment Status"
                    value={getPaymentStatusLabel(ad.paymentStatus)}
                />
                <Detail
                    label="Pending Revision"
                    value={hasPendingRevision(ad) ? "Yes" : "No"}
                />
                <Detail
                    label="Placement"
                    value={ad.placement || "—"}
                />
                <Detail
                    label="Submitted"
                    value={formatDate(ad.createdAt)}
                />
                <Detail
                    label="Reviewed"
                    value={formatDate(ad.reviewedAt)}
                />
                <Detail
                    label="Campaign Start"
                    value={formatDate(ad.startAt)}
                />
                <Detail
                    label="Campaign End"
                    value={formatDate(ad.endAt)}
                />
            </div>

            {ad.rejectionReason && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h4 className="text-sm font-semibold text-red-800">
                        Rejection Reason
                    </h4>

                    <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">
                        {ad.rejectionReason}
                    </p>
                </div>
            )}
        </div>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
            </p>

            <p className="mt-1 break-all text-sm font-medium text-gray-900">
                {value}
            </p>
        </div>
    );
}
