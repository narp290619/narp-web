"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Eye,
    BriefcaseBusiness,
    Clock,
    CheckCircle2,
    XCircle,
    CreditCard,
} from "lucide-react";

import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type PostJobRequest = {
    id: string;

    clientId?: string;

    freelancerId?: string;
    freelancerName?: string;

    skillId?: string;

    details?: string;

    price?: number;

    status?: string;
    paymentStatus?: string;

    date?: string;
    time?: string;

    schedule?: Date | null;

    createdAt?: Date | null;
    updatedAt?: Date | null;
    acceptedAt?: Date | null;
    expiresAt?: Date | null;
    completedAt?: Date | null;
    closeDialogAt?: Date | null;

    distance?: number | string;
    eta?: number | string;

    clientLat?: number;
    clientLng?: number;

    freelancerLat?: number;
    freelancerLng?: number;

    address?: string;

    isAsap?: boolean;

    reviewed?: boolean;
    enriched?: boolean;
};

const PAGE_SIZE = 10;

function getDate(value: unknown): Date | null {
    if (
        value &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof (
            value as {
                toDate: () => Date;
            }
        ).toDate === "function"
    ) {
        return (
            value as {
                toDate: () => Date;
            }
        ).toDate();
    }

    if (value instanceof Date) {
        return value;
    }

    return null;
}

function getNumber(
    value: unknown
): number | undefined {
    if (typeof value === "number") {
        return value;
    }

    if (typeof value === "string") {
        const parsed = Number(value);

        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }

    return undefined;
}

function formatDate(
    date: Date | null
) {
    if (!date) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-PH",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}

function formatDateTime(
    date: Date | null
) {
    if (!date) {
        return "—";
    }

    return date.toLocaleString(
        "en-PH",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    );
}

function formatPrice(
    price?: number
) {
    if (price === undefined) {
        return "—";
    }

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }
    ).format(price);
}

function formatDistance(
    distance?: number | string
) {
    if (
        distance === undefined ||
        distance === null
    ) {
        return "—";
    }

    if (typeof distance === "number") {
        return `${distance} km`;
    }

    return distance;
}

function formatEta(
    eta?: number | string
) {
    if (
        eta === undefined ||
        eta === null
    ) {
        return "—";
    }

    if (typeof eta === "number") {
        return `${eta} min`;
    }

    return eta;
}

/*
 * =====================================================
 * REQUEST STATUS
 * =====================================================
 */

function RequestStatus({
    status,
}: {
    status?: string;
}) {
    const normalized =
        status?.toLowerCase() ?? "";

    if (
        normalized === "accepted" ||
        normalized === "confirmed"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-green-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-green-700
                "
            >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Accepted
            </span>
        );
    }

    if (
        normalized === "completed" ||
        normalized === "complete"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-blue-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-blue-700
                "
            >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Completed
            </span>
        );
    }

    if (
        normalized === "rejected" ||
        normalized === "declined" ||
        normalized === "cancelled" ||
        normalized === "canceled"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-red-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-red-700
                "
            >
                <XCircle className="h-3.5 w-3.5" />
                {status}
            </span>
        );
    }

    if (
        normalized === "expired"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-slate-100
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-slate-600
                "
            >
                <Clock className="h-3.5 w-3.5" />
                Expired
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-orange-50
                px-2.5
                py-1
                text-xs
                font-semibold
                text-orange-700
            "
        >
            <Clock className="h-3.5 w-3.5" />
            {status || "Pending"}
        </span>
    );
}

/*
 * =====================================================
 * PAYMENT STATUS
 * =====================================================
 */

function PaymentStatus({
    status,
}: {
    status?: string;
}) {
    const normalized =
        status?.toLowerCase() ?? "";

    if (
        normalized === "held" ||
        normalized === "paid"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-green-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-green-700
                "
            >
                <CreditCard className="h-3.5 w-3.5" />
                {status}
            </span>
        );
    }

    if (
        normalized === "payment_pending" ||
        normalized === "pending"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-orange-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-orange-700
                "
            >
                <CreditCard className="h-3.5 w-3.5" />
                Pending
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                text-xs
                font-semibold
                text-slate-600
            "
        >
            {status || "—"}
        </span>
    );
}

export default function AdminPostJobRequestsPage() {
    const [
        requests,
        setRequests,
    ] = useState<PostJobRequest[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [
        page,
        setPage,
    ] = useState(1);

    /*
     * =====================================================
     * LOAD REQUESTS
     * =====================================================
     */

    async function loadRequests() {
        try {
            setLoading(true);
            setError(null);

            const requestsRef =
                collection(
                    db,
                    "PostJobRequests"
                );

            const snapshot =
                await getDocs(
                    requestsRef
                );

            const loadedRequests =
                snapshot.docs.map(
                    (
                        document
                    ): PostJobRequest => {
                        const data =
                            document.data();

                        return {
                            id: document.id,

                            clientId:
                                typeof data.clientId ===
                                "string"
                                    ? data.clientId
                                    : undefined,

                            freelancerId:
                                typeof data.freelancerId ===
                                "string"
                                    ? data.freelancerId
                                    : undefined,

                            freelancerName:
                                typeof data.freelancerName ===
                                "string"
                                    ? data.freelancerName
                                    : undefined,

                            skillId:
                                typeof data.skillId ===
                                "string"
                                    ? data.skillId
                                    : undefined,

                            details:
                                typeof data.details ===
                                "string"
                                    ? data.details
                                    : undefined,

                            price:
                                getNumber(
                                    data.price
                                ),

                            status:
                                typeof data.status ===
                                "string"
                                    ? data.status
                                    : undefined,

                            paymentStatus:
                                typeof data.paymentStatus ===
                                "string"
                                    ? data.paymentStatus
                                    : undefined,

                            date:
                                typeof data.date ===
                                "string"
                                    ? data.date
                                    : undefined,

                            time:
                                typeof data.time ===
                                "string"
                                    ? data.time
                                    : undefined,

                            schedule:
                                getDate(
                                    data.schedule
                                ),

                            createdAt:
                                getDate(
                                    data.createdAt
                                ),

                            updatedAt:
                                getDate(
                                    data.updatedAt
                                ),

                            acceptedAt:
                                getDate(
                                    data.acceptedAt
                                ),

                            expiresAt:
                                getDate(
                                    data.expiresAt
                                ),

                            completedAt:
                                getDate(
                                    data.completedAt
                                ),

                            closeDialogAt:
                                getDate(
                                    data.closeDialogAt
                                ),

                            distance:
                                getNumber(
                                    data.distance
                                ) ??
                                (
                                    typeof data.distance ===
                                    "string"
                                        ? data.distance
                                        : undefined
                                ),

                            eta:
                                getNumber(
                                    data.eta
                                ) ??
                                (
                                    typeof data.eta ===
                                    "string"
                                        ? data.eta
                                        : undefined
                                ),

                            clientLat:
                                typeof data.clientLat ===
                                "number"
                                    ? data.clientLat
                                    : undefined,

                            clientLng:
                                typeof data.clientLng ===
                                "number"
                                    ? data.clientLng
                                    : undefined,

                            freelancerLat:
                                typeof data.freelancerLat ===
                                "number"
                                    ? data.freelancerLat
                                    : undefined,

                            freelancerLng:
                                typeof data.freelancerLng ===
                                "number"
                                    ? data.freelancerLng
                                    : undefined,

                            address:
                                typeof data.address ===
                                "string"
                                    ? data.address
                                    : undefined,

                            isAsap:
                                data.isAsap === true,

                            reviewed:
                                data.reviewed === true,

                            enriched:
                                data.enriched === true,
                        };
                    }
                );

            /*
             * Newest requests first.
             */

            loadedRequests.sort(
                (
                    a,
                    b
                ) => {
                    const aTime =
                        a.createdAt?.getTime() ??
                        0;

                    const bTime =
                        b.createdAt?.getTime() ??
                        0;

                    return (
                        bTime -
                        aTime
                    );
                }
            );

            setRequests(
                loadedRequests
            );

            setPage(1);
        } catch (err) {
            console.error(
                "Failed to load PostJobRequests:",
                err
            );

            setError(
                "Unable to load post job requests. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    /*
     * =====================================================
     * SEARCH + FILTER
     * =====================================================
     */

    const filteredRequests =
        useMemo(() => {
            const searchTerm =
                search
                    .trim()
                    .toLowerCase();

            return requests.filter(
                (request) => {
                    const matchesStatus =
                        statusFilter ===
                            "all" ||
                        (
                            request.status ??
                            "pending"
                        )
                            .toLowerCase() ===
                            statusFilter;

                    if (!matchesStatus) {
                        return false;
                    }

                    if (!searchTerm) {
                        return true;
                    }

                    const searchable = [
                        request.id,
                        request.clientId,
                        request.freelancerId,
                        request.freelancerName,
                        request.skillId,
                        request.details,
                        request.address,
                        request.status,
                        request.paymentStatus,
                        request.date,
                        request.time,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return searchable.includes(
                        searchTerm
                    );
                }
            );
        }, [
            requests,
            search,
            statusFilter,
        ]);

    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredRequests.length /
                    PAGE_SIZE
            )
        );

    const safePage =
        Math.min(
            page,
            totalPages
        );

    const startIndex =
        (safePage - 1) *
        PAGE_SIZE;

    const paginatedRequests =
        filteredRequests.slice(
            startIndex,
            startIndex +
                PAGE_SIZE
        );

    function handleSearch(
        value: string
    ) {
        setSearch(value);
        setPage(1);
    }

    function handleStatusFilter(
        value: string
    ) {
        setStatusFilter(value);
        setPage(1);
    }

    return (
        <main className="min-h-screen bg-slate-50">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="border-b border-slate-200 bg-white">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-8
                        lg:px-8
                    "
                >

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                "
                            >
                                <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                            </div>

                            <div>

                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Post Job Requests
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Monitor jobs before they become bookings.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={
                                loadRequests
                            }
                            disabled={
                                loading
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                shadow-sm
                                transition
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <RefreshCw
                                className={`
                                    h-4
                                    w-4
                                    ${
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                `}
                            />

                            Refresh

                        </button>

                    </div>

                </div>

            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-6
                    py-8
                    lg:px-8
                "
            >

                {/* Search + filter */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex flex-col gap-3 lg:flex-row">

                        <div className="relative flex-1">

                            <Search
                                className="
                                    pointer-events-none
                                    absolute
                                    left-4
                                    top-1/2
                                    h-5
                                    w-5
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    handleSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search request ID, client, freelancer, skill, or details..."
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    py-3
                                    pl-12
                                    pr-4
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>

                        <select
                            value={
                                statusFilter
                            }
                            onChange={(
                                event
                            ) =>
                                handleStatusFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:bg-white
                                focus:ring-4
                                focus:ring-blue-500/10
                            "
                        >

                            <option value="all">
                                All statuses
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="accepted">
                                Accepted
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>

                            <option value="declined">
                                Declined
                            </option>

                            <option value="expired">
                                Expired
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>

                </div>

                {/* Error */}

                {error && (
                    <div
                        className="
                            mb-6
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>
                )}

                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1250px]">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Request
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Job
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Freelancer
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Price
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Payment
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Created
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {loading ? (

                                    Array.from({
                                        length: 8,
                                    }).map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    index
                                                }
                                            >

                                                <td className="px-6 py-5">

                                                    <div className="space-y-2">

                                                        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                                                        <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

                                                    </div>

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="space-y-2">

                                                        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                                                        <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />

                                                    </div>

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="ml-auto h-9 w-20 animate-pulse rounded-lg bg-slate-100" />

                                                </td>

                                            </tr>
                                        )
                                    )

                                ) : paginatedRequests.length ===
                                  0 ? (

                                    <tr>

                                        <td
                                            colSpan={
                                                8
                                            }
                                            className="px-6 py-16 text-center"
                                        >

                                            <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

                                            <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                                No post job requests found
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {search ||
                                                statusFilter !==
                                                    "all"
                                                    ? "Try adjusting your search or filters."
                                                    : "There are no post job requests to display."}
                                            </p>

                                        </td>

                                    </tr>

                                ) : (

                                    paginatedRequests.map(
                                        (
                                            request
                                        ) => (
                                            <tr
                                                key={
                                                    request.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >

                                                {/* Request */}

                                                <td className="px-6 py-5">

                                                    <div className="min-w-[180px]">

                                                        <p className="font-mono text-xs font-semibold text-slate-700">
                                                            {
                                                                request.id
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Client:{" "}
                                                            {request.clientId ??
                                                                "Unknown"}
                                                        </p>

                                                    </div>

                                                </td>

                                                {/* Job */}

                                                <td className="px-6 py-5">

                                                    <div className="max-w-[260px]">

                                                        <div className="flex items-center gap-2">

                                                            <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                                                                {
                                                                    request.skillId ??
                                                                    "Unknown skill"
                                                                }
                                                            </span>

                                                            {request.isAsap && (
                                                                <span className="rounded-lg bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">
                                                                    ASAP
                                                                </span>
                                                            )}

                                                        </div>

                                                        <p className="mt-2 truncate text-sm font-medium text-slate-800">
                                                            {
                                                                request.details ??
                                                                "No details"
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">

                                                            {request.date ??
                                                                "No date"}

                                                            {" · "}

                                                            {request.time ??
                                                                "No time"}

                                                        </p>

                                                    </div>

                                                </td>

                                                {/* Freelancer */}

                                                <td className="px-6 py-5">

                                                    {request.freelancerName ? (

                                                        <div>

                                                            <p className="text-sm font-semibold text-slate-800">
                                                                {
                                                                    request.freelancerName
                                                                }
                                                            </p>

                                                            <p className="mt-1 font-mono text-xs text-slate-400">
                                                                {
                                                                    request.freelancerId
                                                                }
                                                            </p>

                                                        </div>

                                                    ) : (

                                                        <span className="text-sm text-slate-400">
                                                            Not accepted
                                                        </span>

                                                    )}

                                                </td>

                                                {/* Price */}

                                                <td className="px-6 py-5">

                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {formatPrice(
                                                            request.price
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">

                                                        {formatDistance(
                                                            request.distance
                                                        )}

                                                        {" · "}

                                                        ETA{" "}

                                                        {formatEta(
                                                            request.eta
                                                        )}

                                                    </p>

                                                </td>

                                                {/* Status */}

                                                <td className="px-6 py-5">

                                                    <RequestStatus
                                                        status={
                                                            request.status
                                                        }
                                                    />

                                                </td>

                                                {/* Payment */}

                                                <td className="px-6 py-5">

                                                    <PaymentStatus
                                                        status={
                                                            request.paymentStatus
                                                        }
                                                    />

                                                </td>

                                                {/* Created */}

                                                <td className="px-6 py-5">

                                                    <div>

                                                        <p className="text-sm text-slate-700">
                                                            {formatDate(
                                                                request.createdAt ??
                                                                    null
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {formatDateTime(
                                                                request.createdAt ??
                                                                    null
                                                            )}
                                                        </p>

                                                    </div>

                                                </td>

                                                {/* Action */}

                                                <td className="px-6 py-5 text-right">

                                                    <Link
                                                        href={`/admin/post-job-requests/${request.id}`}
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-2
                                                            rounded-lg
                                                            border
                                                            border-slate-200
                                                            px-3
                                                            py-2
                                                            text-sm
                                                            font-semibold
                                                            text-slate-700
                                                            transition
                                                            hover:border-blue-200
                                                            hover:bg-blue-50
                                                            hover:text-blue-700
                                                        "
                                                    >

                                                        <Eye className="h-4 w-4" />

                                                        View

                                                    </Link>

                                                </td>

                                            </tr>
                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {!loading &&
                        filteredRequests.length >
                            0 && (
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    border-t
                                    border-slate-200
                                    px-6
                                    py-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <p className="text-sm text-slate-500">

                                    Showing{" "}

                                    <span className="font-semibold text-slate-700">
                                        {
                                            startIndex +
                                            1
                                        }
                                    </span>

                                    {" "}to{" "}

                                    <span className="font-semibold text-slate-700">
                                        {Math.min(
                                            startIndex +
                                                PAGE_SIZE,
                                            filteredRequests.length
                                        )}
                                    </span>

                                    {" "}of{" "}

                                    <span className="font-semibold text-slate-700">
                                        {
                                            filteredRequests.length
                                        }
                                    </span>

                                    {" "}requests

                                </p>

                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage(
                                                (
                                                    current
                                                ) =>
                                                    Math.max(
                                                        1,
                                                        current -
                                                            1
                                                    )
                                            )
                                        }
                                        disabled={
                                            safePage ===
                                            1
                                        }
                                        className="
                                            inline-flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            border-slate-200
                                            text-slate-600
                                            transition
                                            hover:bg-slate-50
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    <span className="min-w-[80px] text-center text-sm font-medium text-slate-600">
                                        Page{" "}
                                        {
                                            safePage
                                        }{" "}
                                        of{" "}
                                        {
                                            totalPages
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage(
                                                (
                                                    current
                                                ) =>
                                                    Math.min(
                                                        totalPages,
                                                        current +
                                                            1
                                                    )
                                            )
                                        }
                                        disabled={
                                            safePage ===
                                            totalPages
                                        }
                                        className="
                                            inline-flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            border-slate-200
                                            text-slate-600
                                            transition
                                            hover:bg-slate-50
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>

                                </div>

                            </div>
                        )}

                </div>

            </div>

        </main>
    );
}