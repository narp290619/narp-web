
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import {
    getFunctions,
    httpsCallable,
} from "firebase/functions";
import {
    Search,
    RefreshCw,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    CreditCard,
    X,
    Loader2,
    AlertCircle,
    Image as ImageIcon,
    UserRound,
    Building2,
    MapPin,
    Mail,
    Phone,
    CalendarDays,
    Package,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { getInstallationId } from "@/lib/session";

type PaymentStatus = "pending" | "verified" | "rejected";

type AdvertiserInfo = {
    name: string;
    email: string;
    phoneNumber: string;
    profileImageUrl: string;
    city: string;
    province: string;
    region: string;
    country: string;
    status: string;
    isDeleted: boolean;
    banned: boolean;
};

type AdvertisementInfo = {
    title: string;
    description: string;
    advertiserType: string;
    freelancerName: string;
    businessName: string;
    businessDescription: string;
    packageName: string;
    packageId: string;
    durationDays: number | null;
    price: number;
    currency: string;
    imageUrl: string;
    status: string;
    paymentStatus: string;
    skillId: string;
    createdAt: Timestamp | Date | null;
    startAt: Timestamp | Date | null;
    endAt: Timestamp | Date | null;
};

type AdPayment = {
    id: string;
    advertisementId: string;
    advertiserId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    referenceNumber: string;
    receiptImagePath: string;
    status: PaymentStatus | string;
    rejectionReason: string | null;
    submittedAt: Timestamp | Date | null;
    reviewedAt: Timestamp | Date | null;
    reviewedBy: string | null;
    advertiser: AdvertiserInfo | null;
    advertisement: AdvertisementInfo | null;
};

type StatusFilter = "all" | PaymentStatus;

type ReceiptUrlResponse = {
    success: boolean;
    url: string;
    expiresAt: number;
};

const functions = getFunctions(undefined, "asia-southeast1");

function getDateValue(
    value: Timestamp | Date | null | undefined
): number {
    if (!value) return 0;

    if (value instanceof Timestamp) return value.toMillis();
    if (value instanceof Date) return value.getTime();

    return 0;
}

function formatDate(
    value: Timestamp | Date | null | undefined
): string {
    const timestamp = getDateValue(value);

    if (!timestamp) return "—";

    return new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Manila",
    }).format(new Date(timestamp));
}

function formatAmount(amount: number, currency: string): string {
    try {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: currency || "PHP",
        }).format(amount);
    } catch {
        return `${currency || "PHP"} ${amount.toLocaleString("en-PH")}`;
    }
}

function displayValue(value: unknown): string {
    if (typeof value === "string" && value.trim()) {
        return value.trim();
    }

    if (typeof value === "number") {
        return String(value);
    }

    return "—";
}

function getAdvertiserName(
    data: Record<string, unknown>
): string {
    const name =
        typeof data.name === "string" ? data.name.trim() : "";

    if (name) return name;

    const firstName =
        typeof data.firstName === "string" ? data.firstName.trim() : "";

    const lastName =
        typeof data.lastName === "string" ? data.lastName.trim() : "";

    const combined = `${firstName} ${lastName}`.trim();

    return combined || "Unknown advertiser";
}

function getLocation(advertiser: AdvertiserInfo | null): string {
    if (!advertiser) return "—";

    return [
        advertiser.city,
        advertiser.province,
        advertiser.region,
        advertiser.country,
    ]
        .filter(Boolean)
        .join(", ") || "—";
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-amber-50 text-amber-700 border-amber-200",
        verified: "bg-green-50 text-green-700 border-green-200",
        rejected: "bg-red-50 text-red-700 border-red-200",
    };

    const icons: Record<string, React.ReactNode> = {
        pending: <Clock size={13} />,
        verified: <CheckCircle size={13} />,
        rejected: <XCircle size={13} />,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                styles[status] ||
                "bg-slate-50 text-slate-600 border-slate-200"
            }`}
        >
            {icons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function DetailItem({
    label,
    value,
    breakAll = false,
}: {
    label: string;
    value: React.ReactNode;
    breakAll?: boolean;
}) {
    return (
        <div className="min-w-0">
            <p className="text-xs text-slate-500">{label}</p>
            <div
                className={`mt-1 text-sm font-medium text-slate-800 ${
                    breakAll ? "break-all" : "break-words"
                }`}
            >
                {value || "—"}
            </div>
        </div>
    );
}

export default function AdminAdPaymentsPage() {
    const [payments, setPayments] = useState<AdPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("pending");

    const [search, setSearch] = useState("");

    const [selectedPayment, setSelectedPayment] =
        useState<AdPayment | null>(null);

    const [receiptUrl, setReceiptUrl] = useState("");
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [receiptError, setReceiptError] = useState("");

    const [rejectingPayment, setRejectingPayment] =
        useState<AdPayment | null>(null);

    const [rejectionReason, setRejectionReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    const fetchPayments = useCallback(async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            // ----------------------------------------------------
            // 1. Fetch payment records
            // ----------------------------------------------------

            const snapshot = await getDocs(
                collection(db, "AdPayments")
            );

            const baseRecords = snapshot.docs.map((paymentDoc) => {
                const data = paymentDoc.data();

                return {
                    id: paymentDoc.id,
                    advertisementId: data.advertisementId ?? "",
                    advertiserId: data.advertiserId ?? "",
                    amount: Number(data.amount ?? 0),
                    currency: data.currency ?? "PHP",
                    paymentMethod: data.paymentMethod ?? "gcash",
                    referenceNumber: data.referenceNumber ?? "",
                    receiptImagePath: data.receiptImagePath ?? "",
                    status: data.status ?? "pending",
                    rejectionReason: data.rejectionReason ?? null,
                    submittedAt:
                        data.submittedAt ?? data.createdAt ?? null,
                    reviewedAt: data.reviewedAt ?? null,
                    reviewedBy: data.reviewedBy ?? null,
                };
            });

            // ----------------------------------------------------
            // 2. Collect unique document IDs
            // ----------------------------------------------------

            const advertisementIds = [
                ...new Set(
                    baseRecords
                        .map((payment) => payment.advertisementId)
                        .filter(Boolean)
                ),
            ];

            const advertiserIds = [
                ...new Set(
                    baseRecords
                        .map((payment) => payment.advertiserId)
                        .filter(Boolean)
                ),
            ];

            // ----------------------------------------------------
            // 3. Fetch advertisement documents
            // ----------------------------------------------------

            const advertisementEntries = await Promise.all(
                advertisementIds.map(async (advertisementId) => {
                    try {
                        const advertisementSnapshot = await getDoc(
                            doc(db, "Advertisements", advertisementId)
                        );

                        if (!advertisementSnapshot.exists()) {
                            return [advertisementId, null] as const;
                        }

                        const data = advertisementSnapshot.data();

                        const advertisement: AdvertisementInfo = {
                            title: data.title ?? "",
                            description: data.description ?? "",
                            advertiserType: data.advertiserType ?? "",
                            freelancerName: data.freelancerName ?? "",
                            businessName: data.businessName ?? "",
                            businessDescription:
                                data.businessDescription ?? "",
                            packageName: data.packageName ?? "",
                            packageId: data.packageId ?? "",
                            durationDays:
                                data.durationDays == null
                                    ? null
                                    : Number(data.durationDays),
                            price: Number(data.price ?? 0),
                            currency: data.currency ?? "PHP",
                            imageUrl: data.imageUrl ?? "",
                            status: data.status ?? "",
                            paymentStatus: data.paymentStatus ?? "",
                            skillId: data.skillId ?? "",
                            createdAt: data.createdAt ?? null,
                            startAt: data.startAt ?? null,
                            endAt: data.endAt ?? null,
                        };

                        return [
                            advertisementId,
                            advertisement,
                        ] as const;
                    } catch (err) {
                        console.error(
                            `Failed to load advertisement ${advertisementId}:`,
                            err
                        );

                        return [advertisementId, null] as const;
                    }
                })
            );

            const advertisementMap = new Map(
                advertisementEntries
            );

            // ----------------------------------------------------
            // 4. Fetch advertiser user documents
            // ----------------------------------------------------

            const advertiserEntries = await Promise.all(
                advertiserIds.map(async (advertiserId) => {
                    try {
                        const userSnapshot = await getDoc(
                            doc(db, "Users", advertiserId)
                        );

                        if (!userSnapshot.exists()) {
                            return [advertiserId, null] as const;
                        }

                        const data = userSnapshot.data();

                        const advertiser: AdvertiserInfo = {
                            name: getAdvertiserName(data),
                            email: data.email ?? "",
                            phoneNumber: data.phoneNumber ?? "",
                            profileImageUrl:
                                data.profileImageUrl ||
                                data.profileImage ||
                                "",
                            city: data.city ?? "",
                            province: data.province ?? "",
                            region: data.region ?? "",
                            country: data.country ?? "",
                            status: data.status ?? "",
                            isDeleted: data.isDeleted === true,
                            banned: data.banned === true,
                        };

                        return [advertiserId, advertiser] as const;
                    } catch (err) {
                        console.error(
                            `Failed to load advertiser ${advertiserId}:`,
                            err
                        );

                        return [advertiserId, null] as const;
                    }
                })
            );

            const advertiserMap = new Map(advertiserEntries);

            // ----------------------------------------------------
            // 5. Join payment + advertisement + advertiser
            // ----------------------------------------------------

            const records: AdPayment[] = baseRecords.map((payment) => ({
                ...payment,
                advertiser:
                    advertiserMap.get(payment.advertiserId) ?? null,
                advertisement:
                    advertisementMap.get(payment.advertisementId) ?? null,
            }));

            records.sort(
                (a, b) =>
                    getDateValue(b.submittedAt) -
                    getDateValue(a.submittedAt)
            );

            setPayments(records);
        } catch (err) {
            console.error(
                "Failed to fetch advertisement payments:",
                err
            );

            setError(
                "Unable to load advertisement payments. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void fetchPayments();
    }, [fetchPayments]);

    const counts = useMemo(() => {
        return {
            all: payments.length,
            pending: payments.filter((p) => p.status === "pending").length,
            verified: payments.filter((p) => p.status === "verified").length,
            rejected: payments.filter((p) => p.status === "rejected").length,
        };
    }, [payments]);

    const filteredPayments = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return payments.filter((payment) => {
            const matchesStatus =
                statusFilter === "all" ||
                payment.status === statusFilter;

            const searchableValues = [
                payment.id,
                payment.advertisementId,
                payment.advertiserId,
                payment.referenceNumber,
                payment.advertiser?.name,
                payment.advertiser?.email,
                payment.advertiser?.phoneNumber,
                payment.advertisement?.title,
                payment.advertisement?.freelancerName,
                payment.advertisement?.businessName,
                payment.advertisement?.packageName,
                payment.advertisement?.advertiserType,
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
    }, [payments, search, statusFilter]);

    const loadReceipt = async (payment: AdPayment) => {
        setSelectedPayment(payment);
        setReceiptUrl("");
        setReceiptError("");
        setReceiptLoading(true);

        try {
            const callable = httpsCallable<
                {
                    paymentId: string;
                    installationId: string;
                    clientPlatform: "web";
                },
                ReceiptUrlResponse
            >(functions, "getAdPaymentReceiptUrl");

            const result = await callable({
                paymentId: payment.id,
                installationId: getInstallationId(),
                clientPlatform: "web",
            });

            if (!result.data?.url) {
                throw new Error("The receipt URL was not returned.");
            }

            setReceiptUrl(result.data.url);
        } catch (err: unknown) {
            console.error(
                "[AD PAYMENT RECEIPT] Callable failed:",
                err
            );

            const firebaseError = err as {
                code?: string;
                message?: string;
                details?: unknown;
            };

            console.error(
                "[AD PAYMENT RECEIPT] Error code:",
                firebaseError.code
            );
            console.error(
                "[AD PAYMENT RECEIPT] Error message:",
                firebaseError.message
            );
            console.error(
                "[AD PAYMENT RECEIPT] Error details:",
                firebaseError.details
            );

            setReceiptError(
                `${firebaseError.code ?? "unknown"}: ${
                    firebaseError.message ?? "Unable to load receipt."
                }`
            );
        } finally {
            setReceiptLoading(false);
        }
    };

    const approvePayment = async (payment: AdPayment) => {
        const confirmed = window.confirm(
            `Approve the GCash payment for advertisement ${
                payment.advertisement?.title ||
                payment.advertisementId
            }?`
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);
            setActionError("");

            const callable = httpsCallable<
                {
                    paymentId: string;
                    installationId: string;
                    clientPlatform: "web";
                },
                { success: boolean; message?: string }
            >(functions, "approveAdPayment");

            await callable({
                paymentId: payment.id,
                installationId: getInstallationId(),
                clientPlatform: "web",
            });

            setSelectedPayment(null);
            setReceiptUrl("");

            await fetchPayments(true);
        } catch (err) {
            console.error(
                "Failed to approve advertisement payment:",
                err
            );

            setActionError(
                "Unable to approve this payment. Please refresh and verify its current status."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const rejectPayment = async () => {
        if (!rejectingPayment) return;

        const reason = rejectionReason.trim();

        if (reason.length < 3 || reason.length > 500) {
            setActionError(
                "The rejection reason must contain between 3 and 500 characters."
            );
            return;
        }

        try {
            setActionLoading(true);
            setActionError("");

            const callable = httpsCallable<
                {
                    paymentId: string;
                    rejectionReason: string;
                    installationId: string;
                    clientPlatform: "web";
                },
                { success: boolean; message?: string }
            >(functions, "rejectAdPayment");

            await callable({
                paymentId: rejectingPayment.id,
                rejectionReason: reason,
                installationId: getInstallationId(),
                clientPlatform: "web",
            });

            setRejectingPayment(null);
            setRejectionReason("");
            setSelectedPayment(null);
            setReceiptUrl("");

            await fetchPayments(true);
        } catch (err) {
            console.error(
                "Failed to reject advertisement payment:",
                err
            );

            setActionError(
                "Unable to reject this payment. Please refresh and verify its current status."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const closeReceipt = () => {
        setSelectedPayment(null);
        setReceiptUrl("");
        setReceiptError("");
    };

    const filterOptions: {
        label: string;
        value: StatusFilter;
        count: number;
    }[] = [
        { label: "All", value: "all", count: counts.all },
        { label: "Pending", value: "pending", count: counts.pending },
        { label: "Verified", value: "verified", count: counts.verified },
        { label: "Rejected", value: "rejected", count: counts.rejected },
    ];

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-6 w-6 text-slate-700" />
                        <h1 className="text-2xl font-bold text-slate-900">
                            Advertisement Payments
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                        Review GCash payments submitted for NARP advertisements.
                    </p>
                </div>

                <button
                    onClick={() => void fetchPayments(true)}
                    disabled={refreshing || loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={refreshing ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                    {
                        label: "Total Payments",
                        value: counts.all,
                        icon: CreditCard,
                        color: "text-slate-700",
                    },
                    {
                        label: "Pending",
                        value: counts.pending,
                        icon: Clock,
                        color: "text-amber-600",
                    },
                    {
                        label: "Verified",
                        value: counts.verified,
                        icon: CheckCircle,
                        color: "text-green-600",
                    },
                    {
                        label: "Rejected",
                        value: counts.rejected,
                        icon: XCircle,
                        color: "text-red-600",
                    },
                ].map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500">
                                    {item.label}
                                </p>
                                <Icon size={19} className={item.color} />
                            </div>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {item.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Filters and search */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {filterOptions.map((option) => {
                            const active = statusFilter === option.value;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => setStatusFilter(option.value)}
                                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                                        active
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    {option.label}
                                    <span
                                        className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                                            active
                                                ? "bg-white/15 text-white"
                                                : "bg-white text-slate-600"
                                        }`}
                                    >
                                        {option.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative w-full lg:max-w-sm">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search payment, ad, advertiser, reference..."
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle size={17} />
                    {error}
                </div>
            )}

            {actionError && !rejectingPayment && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle size={17} />
                    {actionError}
                    <button
                        onClick={() => setActionError("")}
                        className="ml-auto"
                        aria-label="Dismiss error"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Payments table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="font-semibold text-slate-900">
                        {statusFilter === "all"
                            ? "All Advertisement Payments"
                            : `${statusFilter.charAt(0).toUpperCase()}${statusFilter.slice(1)} Payments`}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        {filteredPayments.length} payment(s) found
                    </p>
                </div>

                {loading ? (
                    <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
                        <Loader2 className="animate-spin" size={20} />
                        Loading advertisement payments...
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                        <CreditCard size={36} className="text-slate-300" />

                        <p className="mt-3 font-medium text-slate-700">
                            No payments found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            There are no payments matching your current filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">
                                        Payment
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Advertisement
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Advertiser
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Amount
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        GCash Reference
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Submitted
                                    </th>
                                    <th className="px-5 py-3 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-right font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredPayments.map((payment) => {
                                    const ad = payment.advertisement;
                                    const advertiser = payment.advertiser;

                                    const advertiserName =
                                        advertiser?.name ||
                                        ad?.freelancerName ||
                                        ad?.businessName ||
                                        "Unknown advertiser";

                                    return (
                                        <tr
                                            key={payment.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-slate-800">
                                                    {payment.id}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {payment.paymentMethod.toUpperCase()}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-medium text-slate-700">
                                                    {ad?.title || "Untitled advertisement"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {ad?.advertiserType
                                                        ? ad.advertiserType.charAt(0).toUpperCase() +
                                                          ad.advertiserType.slice(1)
                                                        : "Advertisement"}
                                                    {" · "}
                                                    {payment.advertisementId}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-medium text-slate-700">
                                                    {advertiserName}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {advertiser?.email ||
                                                        payment.advertiserId}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                                                {formatAmount(
                                                    payment.amount,
                                                    payment.currency
                                                )}
                                            </td>

                                            <td className="px-5 py-4 font-mono text-slate-700">
                                                {payment.referenceNumber || "—"}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                                {formatDate(payment.submittedAt)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={payment.status} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => void loadReceipt(payment)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                                    >
                                                        <Eye size={14} />
                                                        Details
                                                    </button>

                                                    {payment.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    void approvePayment(payment)
                                                                }
                                                                disabled={actionLoading}
                                                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                            >
                                                                Approve
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setRejectingPayment(payment);
                                                                    setRejectionReason("");
                                                                    setActionError("");
                                                                }}
                                                                disabled={actionLoading}
                                                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Payment details and receipt modal */}
            {selectedPayment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={closeReceipt}
                >
                    <div
                        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Advertisement Payment Details
                                </h3>
                                <p className="mt-1 break-all text-xs text-slate-500">
                                    Payment ID: {selectedPayment.id}
                                </p>
                            </div>

                            <button
                                onClick={closeReceipt}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Close payment details"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5">
                            {/* Payment summary */}
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <CreditCard size={18} className="text-slate-600" />
                                    <h4 className="font-semibold text-slate-900">
                                        Payment Information
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <DetailItem
                                        label="Payment ID"
                                        value={selectedPayment.id}
                                        breakAll
                                    />

                                    <DetailItem
                                        label="Payment Method"
                                        value={selectedPayment.paymentMethod.toUpperCase()}
                                    />

                                    <DetailItem
                                        label="Payment Status"
                                        value={
                                            <StatusBadge
                                                status={selectedPayment.status}
                                            />
                                        }
                                    />

                                    <DetailItem
                                        label="Amount Submitted"
                                        value={formatAmount(
                                            selectedPayment.amount,
                                            selectedPayment.currency
                                        )}
                                    />

                                    <DetailItem
                                        label="GCash Reference Number"
                                        value={selectedPayment.referenceNumber}
                                        breakAll
                                    />

                                    <DetailItem
                                        label="Submitted Date"
                                        value={formatDate(selectedPayment.submittedAt)}
                                    />

                                    <DetailItem
                                        label="Reviewed Date"
                                        value={formatDate(selectedPayment.reviewedAt)}
                                    />

                                    <DetailItem
                                        label="Reviewed By (Admin UID)"
                                        value={selectedPayment.reviewedBy}
                                        breakAll
                                    />

                                    <DetailItem
                                        label="Receipt Storage Path"
                                        value={selectedPayment.receiptImagePath}
                                        breakAll
                                    />
                                </div>
                            </section>

                            {/* Advertiser information */}
                            <section className="mt-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <UserRound size={18} className="text-slate-600" />
                                    <h4 className="font-semibold text-slate-900">
                                        Advertiser Information
                                    </h4>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">
                                    <div className="flex flex-col gap-4 sm:flex-row">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                            {selectedPayment.advertiser?.profileImageUrl ? (
                                                <img
                                                    src={selectedPayment.advertiser.profileImageUrl}
                                                    alt="Advertiser profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <UserRound
                                                    size={28}
                                                    className="text-slate-400"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-lg font-semibold text-slate-900">
                                                {selectedPayment.advertiser?.name ||
                                                    selectedPayment.advertisement?.freelancerName ||
                                                    selectedPayment.advertisement?.businessName ||
                                                    "Unknown advertiser"}
                                            </p>

                                            <p className="mt-1 break-all text-xs text-slate-400">
                                                User ID: {selectedPayment.advertiserId || "—"}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {selectedPayment.advertiser?.status && (
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                        Account: {selectedPayment.advertiser.status}
                                                    </span>
                                                )}

                                                {selectedPayment.advertiser?.isDeleted && (
                                                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                                        Deleted account
                                                    </span>
                                                )}

                                                {selectedPayment.advertiser?.banned && (
                                                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                                        Banned account
                                                    </span>
                                                )}

                                                {!selectedPayment.advertiser && (
                                                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                                        User document unavailable
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <DetailItem
                                            label="Email"
                                            value={
                                                selectedPayment.advertiser?.email ? (
                                                    <span className="inline-flex items-center gap-2">
                                                        <Mail size={14} className="shrink-0 text-slate-400" />
                                                        {selectedPayment.advertiser.email}
                                                    </span>
                                                ) : "—"
                                            }
                                        />

                                        <DetailItem
                                            label="Phone Number"
                                            value={
                                                selectedPayment.advertiser?.phoneNumber ? (
                                                    <span className="inline-flex items-center gap-2">
                                                        <Phone size={14} className="shrink-0 text-slate-400" />
                                                        {selectedPayment.advertiser.phoneNumber}
                                                    </span>
                                                ) : "—"
                                            }
                                        />

                                        <DetailItem
                                            label="Location"
                                            value={
                                                <span className="inline-flex items-start gap-2">
                                                    <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                                                    {getLocation(selectedPayment.advertiser)}
                                                </span>
                                            }
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Advertisement information */}
                            <section className="mt-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <Building2 size={18} className="text-slate-600" />
                                    <h4 className="font-semibold text-slate-900">
                                        Advertisement Information
                                    </h4>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">
                                    {selectedPayment.advertisement?.imageUrl && (
                                        <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                            <img
                                                src={selectedPayment.advertisement.imageUrl}
                                                alt="Advertisement banner"
                                                className="max-h-64 w-full object-contain"
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-2">
                                        <h5 className="text-base font-semibold text-slate-900">
                                            {selectedPayment.advertisement?.title ||
                                                "Untitled advertisement"}
                                        </h5>

                                        {selectedPayment.advertisement?.advertiserType && (
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                                                {selectedPayment.advertisement.advertiserType}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                                        {selectedPayment.advertisement?.description || "No advertisement description available."}
                                    </p>

                                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <DetailItem
                                            label="Advertisement ID"
                                            value={selectedPayment.advertisementId}
                                            breakAll
                                        />

                                        <DetailItem
                                            label="Advertisement Status"
                                            value={selectedPayment.advertisement?.status}
                                        />

                                        <DetailItem
                                            label="Advertisement Payment Status"
                                            value={selectedPayment.advertisement?.paymentStatus}
                                        />

                                        <DetailItem
                                            label="Advertiser / Business Name"
                                            value={
                                                selectedPayment.advertisement?.businessName ||
                                                selectedPayment.advertisement?.freelancerName
                                            }
                                        />

                                        <DetailItem
                                            label="Business Description"
                                            value={selectedPayment.advertisement?.businessDescription}
                                        />

                                        <DetailItem
                                            label="Skill ID"
                                            value={selectedPayment.advertisement?.skillId}
                                        />

                                        <DetailItem
                                            label="Package Name"
                                            value={
                                                <span className="inline-flex items-center gap-2">
                                                    <Package size={14} className="text-slate-400" />
                                                    {displayValue(
                                                        selectedPayment.advertisement?.packageName
                                                    )}
                                                </span>
                                            }
                                        />

                                        <DetailItem
                                            label="Package ID"
                                            value={selectedPayment.advertisement?.packageId}
                                            breakAll
                                        />

                                        <DetailItem
                                            label="Duration"
                                            value={
                                                selectedPayment.advertisement?.durationDays != null
                                                    ? `${selectedPayment.advertisement.durationDays} days`
                                                    : "—"
                                            }
                                        />

                                        <DetailItem
                                            label="Advertisement Price"
                                            value={
                                                selectedPayment.advertisement
                                                    ? formatAmount(
                                                          selectedPayment.advertisement.price,
                                                          selectedPayment.advertisement.currency
                                                      )
                                                    : "—"
                                            }
                                        />

                                        <DetailItem
                                            label="Advertisement Created"
                                            value={formatDate(
                                                selectedPayment.advertisement?.createdAt
                                            )}
                                        />

                                        <DetailItem
                                            label="Campaign Start"
                                            value={formatDate(
                                                selectedPayment.advertisement?.startAt
                                            )}
                                        />

                                        <DetailItem
                                            label="Campaign End"
                                            value={formatDate(
                                                selectedPayment.advertisement?.endAt
                                            )}
                                        />
                                    </div>

                                    {!selectedPayment.advertisement && (
                                        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                                            Advertisement document unavailable. Some advertisement details cannot be displayed.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Receipt image */}
                            <section className="mt-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <ImageIcon size={18} className="text-slate-600" />
                                    <h4 className="font-semibold text-slate-900">
                                        GCash Payment Receipt
                                    </h4>
                                </div>

                                <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    {receiptLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Loader2
                                                className="animate-spin"
                                                size={20}
                                            />
                                            Loading private receipt...
                                        </div>
                                    ) : receiptError ? (
                                        <div className="flex flex-col items-center gap-2 text-center text-sm text-red-600">
                                            <AlertCircle size={28} />
                                            {receiptError}
                                        </div>
                                    ) : receiptUrl ? (
                                        <img
                                            src={receiptUrl}
                                            alt="Advertisement GCash payment receipt"
                                            className="max-h-[55vh] max-w-full rounded-lg object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <ImageIcon size={32} />
                                            Receipt unavailable
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Rejection reason */}
                            {selectedPayment.status === "rejected" &&
                                selectedPayment.rejectionReason && (
                                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                                        <p className="text-xs font-semibold text-red-700">
                                            Rejection Reason
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">
                                            {selectedPayment.rejectionReason}
                                        </p>
                                    </div>
                                )}

                            {/* Actions */}
                            {selectedPayment.status === "pending" && (
                                <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-5">
                                    <button
                                        onClick={() => {
                                            setRejectingPayment(selectedPayment);
                                            setActionError("");
                                        }}
                                        disabled={actionLoading}
                                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                                    >
                                        Reject Payment
                                    </button>

                                    <button
                                        onClick={() =>
                                            void approvePayment(selectedPayment)
                                        }
                                        disabled={actionLoading}
                                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {actionLoading
                                            ? "Processing..."
                                            : "Approve Payment"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection modal */}
            {rejectingPayment && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Reject Advertisement Payment
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Payment ID: {rejectingPayment.id}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setRejectingPayment(null);
                                    setActionError("");
                                }}
                                disabled={actionLoading}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <label
                            htmlFor="rejectionReason"
                            className="mt-5 block text-sm font-medium text-slate-700"
                        >
                            Reason for rejection
                        </label>

                        <textarea
                            id="rejectionReason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            maxLength={500}
                            rows={4}
                            placeholder="Explain why this payment receipt is being rejected..."
                            className="mt-2 w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />

                        <div className="mt-1 flex justify-between text-xs text-slate-400">
                            <span>Minimum 3 characters</span>
                            <span>{rejectionReason.length}/500</span>
                        </div>

                        {actionError && (
                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                <AlertCircle size={16} />
                                {actionError}
                            </div>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setRejectingPayment(null);
                                    setActionError("");
                                }}
                                disabled={actionLoading}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => void rejectPayment()}
                                disabled={
                                    actionLoading ||
                                    rejectionReason.trim().length < 3 ||
                                    rejectionReason.trim().length > 500
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {actionLoading && (
                                    <Loader2
                                        size={15}
                                        className="animate-spin"
                                    />
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
