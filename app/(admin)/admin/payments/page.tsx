"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    CreditCard,
    RefreshCw,
    Eye,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    XCircle,
    Receipt,
} from "lucide-react";

import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type PaymentReceipt = {
    id: string;

    verifiedBy?: string;
    clientId?: string;
    requestId?: string;
    skillId?: string;

    receiptImageUrl?: string;
    receiptId?: string;

    verifiedAt?: Date | null;
    createdAt?: Date | null;

    status?: string;

    referenceNumber?: string | number;

    amount?: number;
};

const PAGE_SIZE = 10;

/*
 * =====================================================
 * DATE HELPERS
 * =====================================================
 */

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

/*
 * =====================================================
 * FORMATTING
 * =====================================================
 */

function formatDate(date: Date | null) {
    if (!date) {
        return "—";
    }

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatDateTime(date: Date | null) {
    if (!date) {
        return "—";
    }

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function formatAmount(amount?: number) {
    if (typeof amount !== "number") {
        return "₱0.00";
    }

    return amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });
}

/*
 * =====================================================
 * STATUS BADGE
 * =====================================================
 */

function PaymentStatus({
    status,
}: {
    status?: string;
}) {
    const normalized =
        status?.toLowerCase() ?? "";

    if (normalized === "approved") {
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
                Approved
            </span>
        );
    }

    if (
        normalized === "rejected" ||
        normalized === "declined"
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
                Rejected
            </span>
        );
    }

    if (
        normalized === "pending" ||
        normalized === "pending_verification"
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
                <Clock className="h-3.5 w-3.5" />
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
            {status || "Unknown"}
        </span>
    );
}

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

export default function AdminPaymentsPage() {
    const [payments, setPayments] =
        useState<PaymentReceipt[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [page, setPage] =
        useState(1);

    /*
     * =================================================
     * LOAD PAYMENTS
     * =================================================
     */

    async function loadPayments() {
        try {
            setLoading(true);
            setError(null);

            const paymentsRef =
                collection(
                    db,
                    "PaymentReceipts"
                );

            const snapshot =
                await getDocs(
                    paymentsRef
                );

            const loadedPayments: PaymentReceipt[] =
                snapshot.docs.map(
                    (document) => {
                        const data =
                            document.data();

                        return {
                            id: document.id,

                            verifiedBy:
                                typeof data.verifiedBy ===
                                "string"
                                    ? data.verifiedBy
                                    : undefined,

                            clientId:
                                typeof data.clientId ===
                                "string"
                                    ? data.clientId
                                    : undefined,

                            requestId:
                                typeof data.requestId ===
                                "string"
                                    ? data.requestId
                                    : undefined,

                            skillId:
                                typeof data.skillId ===
                                "string"
                                    ? data.skillId
                                    : undefined,

                            receiptImageUrl:
                                typeof data.receiptImageUrl ===
                                "string"
                                    ? data.receiptImageUrl
                                    : undefined,

                            receiptId:
                                typeof data.receiptId ===
                                "string"
                                    ? data.receiptId
                                    : undefined,

                            verifiedAt:
                                getDate(
                                    data.verifiedAt
                                ),

                            createdAt:
                                getDate(
                                    data.createdAt
                                ),

                            status:
                                typeof data.status ===
                                "string"
                                    ? data.status
                                    : undefined,

                            referenceNumber:
                                typeof data.referenceNumber ===
                                    "string" ||
                                typeof data.referenceNumber ===
                                    "number"
                                    ? data.referenceNumber
                                    : undefined,

                            amount:
                                typeof data.amount ===
                                "number"
                                    ? data.amount
                                    : undefined,
                        };
                    }
                );

            /*
             * Newest payment first.
             */

            loadedPayments.sort(
                (a, b) => {
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

            setPayments(
                loadedPayments
            );

            setPage(1);
        } catch (err) {
            console.error(
                "Failed to load payment receipts:",
                err
            );

            setError(
                "Unable to load payment receipts. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPayments();
    }, []);

    /*
     * =================================================
     * SUMMARY
     * =================================================
     */

    const summary = useMemo(() => {
        let totalAmount = 0;
        let approved = 0;
        let pending = 0;
        let rejected = 0;

        for (const payment of payments) {
            totalAmount +=
                payment.amount ?? 0;

            const status =
                payment.status
                    ?.toLowerCase();

            if (
                status ===
                "approved"
            ) {
                approved++;
            } else if (
                status ===
                    "pending" ||
                status ===
                    "pending_verification"
            ) {
                pending++;
            } else if (
                status ===
                    "rejected" ||
                status ===
                    "declined"
            ) {
                rejected++;
            }
        }

        return {
            total: payments.length,
            totalAmount,
            approved,
            pending,
            rejected,
        };
    }, [payments]);

    /*
     * =================================================
     * FILTER
     * =================================================
     */

    const filteredPayments =
        useMemo(() => {
            const searchTerm =
                search
                    .trim()
                    .toLowerCase();

            return payments.filter(
                (payment) => {
                    const status =
                        (
                            payment.status ??
                            ""
                        ).toLowerCase();

                    /*
                     * Status filter
                     */

                    if (
                        statusFilter !==
                            "all" &&
                        status !==
                            statusFilter
                    ) {
                        return false;
                    }

                    /*
                     * Search
                     */

                    if (
                        !searchTerm
                    ) {
                        return true;
                    }

                    const searchableText =
                        [
                            payment.id,
                            payment.receiptId,
                            payment.clientId,
                            payment.requestId,
                            payment.skillId,
                            payment.verifiedBy,
                            String(
                                payment.referenceNumber ??
                                    ""
                            ),
                            String(
                                payment.amount ??
                                    ""
                            ),
                            payment.status,
                        ]
                            .filter(
                                Boolean
                            )
                            .join(" ")
                            .toLowerCase();

                    return searchableText.includes(
                        searchTerm
                    );
                }
            );
        }, [
            payments,
            search,
            statusFilter,
        ]);

    /*
     * =================================================
     * PAGINATION
     * =================================================
     */

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredPayments.length /
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

    const paginatedPayments =
        filteredPayments.slice(
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

    /*
     * =================================================
     * RENDER
     * =================================================
     */

    return (
        <main className="min-h-screen bg-slate-50">

            {/* =========================================
                HEADER
            ========================================= */}

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
                                <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>

                            <div>

                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Payment Verification
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review and manage payment receipts submitted by clients.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={
                                loadPayments
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

            {/* =========================================
                CONTENT
            ========================================= */}

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-6
                    py-8
                    lg:px-8
                "
            >

                {/* =====================================
                    SUMMARY CARDS
                ===================================== */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Total */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <div className="flex items-center justify-between">

                            <p className="text-sm font-medium text-slate-500">
                                Total Payments
                            </p>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                                <Receipt className="h-4 w-4 text-blue-600" />
                            </div>

                        </div>

                        <p className="mt-3 text-2xl font-bold text-slate-900">
                            {
                                summary.total
                            }
                        </p>

                    </div>

                    {/* Amount */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <div className="flex items-center justify-between">

                            <p className="text-sm font-medium text-slate-500">
                                Total Amount
                            </p>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                                <CreditCard className="h-4 w-4 text-green-600" />
                            </div>

                        </div>

                        <p className="mt-3 text-2xl font-bold text-slate-900">
                            {formatAmount(
                                summary.totalAmount
                            )}
                        </p>

                    </div>

                    {/* Pending */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <div className="flex items-center justify-between">

                            <p className="text-sm font-medium text-slate-500">
                                Pending Verification
                            </p>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                                <Clock className="h-4 w-4 text-orange-600" />
                            </div>

                        </div>

                        <p className="mt-3 text-2xl font-bold text-slate-900">
                            {
                                summary.pending
                            }
                        </p>

                    </div>

                    {/* Approved */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <div className="flex items-center justify-between">

                            <p className="text-sm font-medium text-slate-500">
                                Approved
                            </p>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>

                        </div>

                        <p className="mt-3 text-2xl font-bold text-slate-900">
                            {
                                summary.approved
                            }
                        </p>

                    </div>

                </div>

                {/* =====================================
                    SEARCH / FILTER
                ===================================== */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <div className="flex flex-col gap-3 lg:flex-row">

                        {/* Search */}

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
                                placeholder="Search receipt, client, request, skill, reference..."
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

                        {/* Status */}

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
                                transition
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

                            <option value="pending_verification">
                                Pending Verification
                            </option>

                            <option value="approved">
                                Approved
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>

                            <option value="declined">
                                Declined
                            </option>

                        </select>

                    </div>

                </div>

                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (
                    <div
                        className="
                            mt-6
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

                {/* =====================================
                    TABLE
                ===================================== */}

                <div
                    className="
                        mt-6
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px]">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Payment
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Client
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Request / Skill
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Reference
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Status
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

                                                    <div className="flex items-center gap-3">

                                                        <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />

                                                        <div className="space-y-2">

                                                            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                                                            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                                                        <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
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

                                ) : paginatedPayments.length ===
                                    0 ? (

                                    <tr>

                                        <td
                                            colSpan={
                                                8
                                            }
                                            className="px-6 py-16 text-center"
                                        >

                                            <Receipt className="mx-auto h-10 w-10 text-slate-300" />

                                            <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                                No payment receipts found
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {search ||
                                                statusFilter !==
                                                    "all"
                                                    ? "Try adjusting your search or filter."
                                                    : "There are no payment receipts to display."}
                                            </p>

                                        </td>

                                    </tr>

                                ) : (

                                    paginatedPayments.map(
                                        (
                                            payment
                                        ) => (
                                            <tr
                                                key={
                                                    payment.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >

                                                {/* Payment */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

                                                        {payment.receiptImageUrl ? (

                                                            <img
                                                                src={
                                                                    payment.receiptImageUrl
                                                                }
                                                                alt="Payment receipt"
                                                                className="
                                                                    h-10
                                                                    w-10
                                                                    flex-shrink-0
                                                                    rounded-lg
                                                                    border
                                                                    border-slate-200
                                                                    object-cover
                                                                "
                                                            />

                                                        ) : (

                                                            <div
                                                                className="
                                                                    flex
                                                                    h-10
                                                                    w-10
                                                                    flex-shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    bg-blue-50
                                                                "
                                                            >
                                                                <Receipt className="h-5 w-5 text-blue-600" />
                                                            </div>

                                                        )}

                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {payment.receiptId ??
                                                                    payment.id}
                                                            </p>

                                                            <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
                                                                ID:{" "}
                                                                {
                                                                    payment.id
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* Client */}

                                                <td className="px-6 py-5">

                                                    <p className="max-w-[180px] truncate text-sm font-medium text-slate-700">
                                                        {payment.clientId ??
                                                            "Unknown"}
                                                    </p>

                                                </td>

                                                {/* Request / Skill */}

                                                <td className="px-6 py-5">

                                                    <div className="space-y-1">

                                                        <p className="max-w-[180px] truncate text-sm font-medium text-slate-700">
                                                            {payment.requestId ??
                                                                "No request"}
                                                        </p>

                                                        <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                                            {payment.skillId ??
                                                                "Unknown skill"}
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* Amount */}

                                                <td className="px-6 py-5">

                                                    <p className="text-sm font-bold text-slate-900">
                                                        {formatAmount(
                                                            payment.amount
                                                        )}
                                                    </p>

                                                </td>

                                                {/* Reference */}

                                                <td className="px-6 py-5">

                                                    <p className="text-sm font-medium text-slate-700">
                                                        {payment.referenceNumber ??
                                                            "—"}
                                                    </p>

                                                </td>

                                                {/* Status */}

                                                <td className="px-6 py-5">

                                                    <PaymentStatus
                                                        status={
                                                            payment.status
                                                        }
                                                    />

                                                </td>

                                                {/* Created */}

                                                <td className="px-6 py-5">

                                                    <div>

                                                        <p className="text-sm text-slate-600">
                                                            {formatDate(
                                                                payment.createdAt ??
                                                                    null
                                                            )}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            {formatDateTime(
                                                                payment.createdAt ??
                                                                    null
                                                            )}
                                                        </p>

                                                    </div>

                                                </td>

                                                {/* Action */}

                                                <td className="px-6 py-5 text-right">

                                                    <Link
                                                        href={`/admin/payments/${payment.id}`}
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

                    {/* =================================
                        PAGINATION
                    ================================= */}

                    {!loading &&
                        filteredPayments.length >
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
                                            filteredPayments.length
                                        )}
                                    </span>

                                    {" "}of{" "}

                                    <span className="font-semibold text-slate-700">
                                        {
                                            filteredPayments.length
                                        }
                                    </span>

                                    {" "}payments

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
                                        }

                                        {" "}of{" "}

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