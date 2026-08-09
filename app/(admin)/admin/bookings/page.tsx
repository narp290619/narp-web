"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    collection,
    getDocs,
} from "firebase/firestore";

import {
    Search,
    CalendarDays,
    RefreshCw,
    Eye,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    User,
    BriefcaseBusiness,
    MapPin,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";

import { db } from "@/lib/firebase";

/*
 * =====================================================
 * TYPES
 * =====================================================
 */

type BookingRecord = {
    id: string;

    price?: number;

    createdAt?: Date | null;
    updatedAt?: Date | null;
    acceptedAt?: Date | null;
    completedAt?: Date | null;
    expiresAt?: Date | null;
    closeDialogAt?: Date | null;
    schedule?: Date | null;

    distance?: string;
    eta?: string;

    freelancerLat?: number;
    freelancerLng?: number;

    clientLat?: number;
    clientLng?: number;

    freelancerLocation?: unknown;

    isAsap?: boolean;

    skillId?: string;

    status?: string;
    paymentStatus?: string;

    freelancerName?: string;
    freelancerId?: string;

    clientId?: string;

    date?: string;
    time?: string;

    details?: string;

    reviewed?: boolean;
    enriched?: boolean;
};

const PAGE_SIZE = 10;

/*
 * =====================================================
 * FIRESTORE DATE HELPER
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
 * FORMATTERS
 * =====================================================
 */

function formatCurrency(
    value: number | undefined
) {
    if (
        value === undefined ||
        Number.isNaN(value)
    ) {
        return "—";
    }

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 2,
        }
    ).format(value);
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

function formatStatus(
    value?: string
) {
    if (!value) {
        return "Unknown";
    }

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
}

function truncateId(
    value?: string
) {
    if (!value) {
        return "—";
    }

    if (value.length <= 18) {
        return value;
    }

    return `${value.substring(
        0,
        8
    )}...${value.substring(
        value.length - 6
    )}`;
}

/*
 * =====================================================
 * STATUS BADGE
 * =====================================================
 */

function BookingStatusBadge({
    status,
}: {
    status?: string;
}) {
    const normalized =
        status?.toLowerCase() ?? "";

    if (
        normalized === "completed"
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
                Completed
            </span>
        );
    }

    if (
        normalized === "cancelled" ||
        normalized === "canceled" ||
        normalized === "rejected"
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
                {formatStatus(status)}
            </span>
        );
    }

    if (
        normalized === "in_progress"
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
                <Loader2 className="h-3.5 w-3.5" />
                In Progress
            </span>
        );
    }

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
                    bg-indigo-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-indigo-700
                "
            >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {formatStatus(status)}
            </span>
        );
    }

    if (
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
                <Clock className="h-3.5 w-3.5" />
                Pending
            </span>
        );
    }

    if (
        normalized === "disputed"
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
                <AlertCircle className="h-3.5 w-3.5" />
                Disputed
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
            {formatStatus(status)}
        </span>
    );
}

/*
 * =====================================================
 * PAYMENT BADGE
 * =====================================================
 */

function PaymentStatusBadge({
    status,
}: {
    status?: string;
}) {
    const normalized =
        status?.toLowerCase() ?? "";

    if (
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
                Paid
            </span>
        );
    }

    if (
        normalized === "refunded"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-purple-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-purple-700
                "
            >
                Refunded
            </span>
        );
    }

    if (
        normalized === "failed"
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
                Failed
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
            {formatStatus(status)}
        </span>
    );
}

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

export default function AdminBookingsPage() {
    const [bookings, setBookings] =
        useState<BookingRecord[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [
        paymentFilter,
        setPaymentFilter,
    ] = useState("all");

    const [page, setPage] =
        useState(1);

    /*
     * =================================================
     * LOAD BOOKINGS
     * =================================================
     */

    async function loadBookings() {
        try {
            setLoading(true);
            setError(null);

            const bookingsRef =
                collection(
                    db,
                    "Bookings"
                );

            const snapshot =
                await getDocs(
                    bookingsRef
                );

            const loadedBookings:
                BookingRecord[] =
                snapshot.docs.map(
                    (document) => {
                        const data =
                            document.data();

                        return {
                            id: document.id,

                            price:
                                typeof data.price ===
                                "number"
                                    ? data.price
                                    : undefined,

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

                            completedAt:
                                getDate(
                                    data.completedAt
                                ),

                            expiresAt:
                                getDate(
                                    data.expiresAt
                                ),

                            closeDialogAt:
                                getDate(
                                    data.closeDialogAt
                                ),

                            schedule:
                                getDate(
                                    data.schedule
                                ),

                            distance:
                                typeof data.distance ===
                                "string"
                                    ? data.distance
                                    : undefined,

                            eta:
                                typeof data.eta ===
                                "string"
                                    ? data.eta
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

                            freelancerLocation:
                                data.freelancerLocation,

                            isAsap:
                                data.isAsap ===
                                true,

                            skillId:
                                typeof data.skillId ===
                                "string"
                                    ? data.skillId
                                    : undefined,

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

                            freelancerName:
                                typeof data.freelancerName ===
                                "string"
                                    ? data.freelancerName
                                    : undefined,

                            freelancerId:
                                typeof data.freelancerId ===
                                "string"
                                    ? data.freelancerId
                                    : undefined,

                            clientId:
                                typeof data.clientId ===
                                "string"
                                    ? data.clientId
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

                            details:
                                typeof data.details ===
                                "string"
                                    ? data.details
                                    : undefined,

                            reviewed:
                                data.reviewed ===
                                true,

                            enriched:
                                data.enriched ===
                                true,
                        };
                    }
                );

            /*
             * Newest bookings first.
             */

            loadedBookings.sort(
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

            setBookings(
                loadedBookings
            );

            setPage(1);
        } catch (err) {
            console.error(
                "Failed to load bookings:",
                err
            );

            setError(
                "Unable to load bookings. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBookings();
    }, []);

    /*
     * =================================================
     * FILTER
     * =================================================
     */

    const filteredBookings =
        useMemo(() => {
            const searchTerm =
                search
                    .trim()
                    .toLowerCase();

            return bookings.filter(
                (booking) => {
                    /*
                     * Status filter
                     */

                    if (
                        statusFilter !==
                            "all" &&
                        booking.status
                            ?.toLowerCase() !==
                            statusFilter
                    ) {
                        return false;
                    }

                    /*
                     * Payment filter
                     */

                    if (
                        paymentFilter !==
                            "all" &&
                        booking.paymentStatus
                            ?.toLowerCase() !==
                            paymentFilter
                    ) {
                        return false;
                    }

                    /*
                     * Search
                     */

                    if (!searchTerm) {
                        return true;
                    }

                    const searchable =
                        [
                            booking.id,
                            booking.skillId,
                            booking.freelancerName,
                            booking.freelancerId,
                            booking.clientId,
                            booking.status,
                            booking.paymentStatus,
                            booking.date,
                            booking.time,
                            booking.details,
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
            bookings,
            search,
            statusFilter,
            paymentFilter,
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
                filteredBookings.length /
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

    const paginatedBookings =
        filteredBookings.slice(
            startIndex,
            startIndex +
                PAGE_SIZE
        );

    /*
     * =================================================
     * HANDLERS
     * =================================================
     */

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

    function handlePaymentFilter(
        value: string
    ) {
        setPaymentFilter(value);
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

                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

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
                                <CalendarDays
                                    className="
                                        h-5
                                        w-5
                                        text-blue-600
                                    "
                                />
                            </div>

                            <div>

                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                    "
                                >
                                    Bookings
                                </h1>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Monitor and manage
                                    NARP service bookings.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={
                                loadBookings
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
                    FILTER BAR
                ===================================== */}

                <div
                    className="
                        mb-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            lg:flex-row
                        "
                    >

                        {/* Search */}

                        <div
                            className="
                                relative
                                flex-1
                            "
                        >

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
                                placeholder="
                                    Search booking ID,
                                    client, freelancer,
                                    skill, or details...
                                "
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
                                bg-white
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-slate-700
                                outline-none
                                focus:border-blue-500
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

                            <option value="confirmed">
                                Confirmed
                            </option>

                            <option value="in_progress">
                                In Progress
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>

                            <option value="disputed">
                                Disputed
                            </option>

                        </select>

                        {/* Payment */}

                        <select
                            value={
                                paymentFilter
                            }
                            onChange={(
                                event
                            ) =>
                                handlePaymentFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-500/10
                            "
                        >

                            <option value="all">
                                All payments
                            </option>

                            <option value="payment_pending">
                                Payment Pending
                            </option>

                            <option value="paid">
                                Paid
                            </option>

                            <option value="failed">
                                Failed
                            </option>

                            <option value="refunded">
                                Refunded
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

                {/* =====================================
                    TABLE
                ===================================== */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div className="overflow-x-auto">

                        <table
                            className="
                                w-full
                                min-w-[1200px]
                            "
                        >

                            <thead>

                                <tr
                                    className="
                                        border-b
                                        border-slate-200
                                        bg-slate-50
                                    "
                                >

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        "
                                    >
                                        Booking
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        "
                                    >
                                        Customer
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        "
                                    >
                                        Freelancer
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        "
                                    >
                                        Schedule
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        "
                                    >
                                        Amount
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        "
                                    >
                                        Payment
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        "
                                    >
                                        Status
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-right
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        "
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody
                                className="
                                    divide-y
                                    divide-slate-100
                                "
                            >

                                {/* LOADING */}

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

                                                {Array.from(
                                                    {
                                                        length: 8,
                                                    }
                                                ).map(
                                                    (
                                                        _,
                                                        cellIndex
                                                    ) => (
                                                        <td
                                                            key={
                                                                cellIndex
                                                            }
                                                            className="
                                                                px-6
                                                                py-5
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    h-4
                                                                    w-24
                                                                    animate-pulse
                                                                    rounded
                                                                    bg-slate-100
                                                                "
                                                            />

                                                        </td>
                                                    )
                                                )}

                                            </tr>
                                        )
                                    )

                                ) : paginatedBookings.length ===
                                  0 ? (

                                    <tr>

                                        <td
                                            colSpan={
                                                8
                                            }
                                            className="
                                                px-6
                                                py-16
                                                text-center
                                            "
                                        >

                                            <CalendarDays
                                                className="
                                                    mx-auto
                                                    h-10
                                                    w-10
                                                    text-slate-300
                                                "
                                            />

                                            <h3
                                                className="
                                                    mt-4
                                                    text-sm
                                                    font-semibold
                                                    text-slate-900
                                                "
                                            >
                                                No bookings found
                                            </h3>

                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >
                                                {search ||
                                                statusFilter !==
                                                    "all" ||
                                                paymentFilter !==
                                                    "all"
                                                    ? "Try adjusting your filters."
                                                    : "There are no bookings to display."}
                                            </p>

                                        </td>

                                    </tr>

                                ) : (

                                    paginatedBookings.map(
                                        (
                                            booking
                                        ) => (
                                            <tr
                                                key={
                                                    booking.id
                                                }
                                                className="
                                                    transition
                                                    hover:bg-slate-50
                                                "
                                            >

                                                {/* BOOKING */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                h-10
                                                                w-10
                                                                flex-shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-xl
                                                                bg-blue-50
                                                            "
                                                        >

                                                            <BriefcaseBusiness
                                                                className="
                                                                    h-5
                                                                    w-5
                                                                    text-blue-600
                                                                "
                                                            />

                                                        </div>

                                                        <div
                                                            className="
                                                                min-w-0
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-slate-900
                                                                "
                                                            >
                                                                {
                                                                    booking.skillId ??
                                                                    "Unknown skill"
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    max-w-[210px]
                                                                    truncate
                                                                    text-xs
                                                                    text-slate-400
                                                                "
                                                                title={
                                                                    booking.details
                                                                }
                                                            >
                                                                {
                                                                    booking.details ??
                                                                    "No details"
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    font-mono
                                                                    text-[11px]
                                                                    text-slate-300
                                                                "
                                                                title={
                                                                    booking.id
                                                                }
                                                            >
                                                                {
                                                                    truncateId(
                                                                        booking.id
                                                                    )
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* CUSTOMER */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            gap-2
                                                        "
                                                    >

                                                        <User
                                                            className="
                                                                mt-0.5
                                                                h-4
                                                                w-4
                                                                flex-shrink-0
                                                                text-slate-400
                                                            "
                                                        />

                                                        <div>

                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-medium
                                                                    text-slate-700
                                                                "
                                                            >
                                                                Client
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    font-mono
                                                                    text-xs
                                                                    text-slate-400
                                                                "
                                                                title={
                                                                    booking.clientId
                                                                }
                                                            >
                                                                {
                                                                    truncateId(
                                                                        booking.clientId
                                                                    )
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* FREELANCER */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                    "
                                                >

                                                    <div>

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-semibold
                                                                text-slate-800
                                                            "
                                                        >
                                                            {
                                                                booking.freelancerName ??
                                                                "Unknown freelancer"
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                font-mono
                                                                text-xs
                                                                text-slate-400
                                                            "
                                                            title={
                                                                booking.freelancerId
                                                            }
                                                        >
                                                            {
                                                                truncateId(
                                                                    booking.freelancerId
                                                                )
                                                            }
                                                        </p>

                                                    </div>

                                                </td>

                                                {/* SCHEDULE */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            space-y-1
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-medium
                                                                text-slate-700
                                                            "
                                                        >
                                                            {
                                                                booking.date ??
                                                                formatDate(
                                                                    booking.schedule ??
                                                                    null
                                                                )
                                                            }
                                                        </p>

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-1.5
                                                                text-xs
                                                                text-slate-400
                                                            "
                                                        >

                                                            <Clock
                                                                className="
                                                                    h-3.5
                                                                    w-3.5
                                                                "
                                                            />

                                                            {booking.isAsap
                                                                ? "ASAP"
                                                                : booking.time ??
                                                                  formatDateTime(
                                                                      booking.schedule ??
                                                                      null
                                                                  )}

                                                        </div>

                                                        {booking.eta && (
                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-slate-400
                                                                "
                                                            >
                                                                ETA:{" "}
                                                                {
                                                                    booking.eta
                                                                }
                                                            </p>
                                                        )}

                                                    </div>

                                                </td>

                                                {/* AMOUNT */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-bold
                                                            text-slate-900
                                                        "
                                                    >
                                                        {formatCurrency(
                                                            booking.price
                                                        )}
                                                    </p>

                                                    {booking.distance && (
                                                        <div
                                                            className="
                                                                mt-1
                                                                flex
                                                                items-center
                                                                gap-1
                                                                text-xs
                                                                text-slate-400
                                                            "
                                                        >

                                                            <MapPin
                                                                className="
                                                                    h-3
                                                                    w-3
                                                                "
                                                            />

                                                            {
                                                                booking.distance
                                                            }

                                                        </div>
                                                    )}

                                                </td>

                                                {/* PAYMENT */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                    "
                                                >

                                                    <PaymentStatusBadge
                                                        status={
                                                            booking.paymentStatus
                                                        }
                                                    />

                                                </td>

                                                {/* STATUS */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                    "
                                                >

                                                    <BookingStatusBadge
                                                        status={
                                                            booking.status
                                                        }
                                                    />

                                                </td>

                                                {/* ACTION */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                        text-right
                                                    "
                                                >

                                                    <Link
                                                        href={`/admin/bookings/${booking.id}`}
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
                        filteredBookings.length >
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

                                <p
                                    className="
                                        text-sm
                                        text-slate-500
                                    "
                                >

                                    Showing{" "}

                                    <span
                                        className="
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {
                                            startIndex +
                                            1
                                        }
                                    </span>

                                    {" "}to{" "}

                                    <span
                                        className="
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {Math.min(
                                            startIndex +
                                                PAGE_SIZE,
                                            filteredBookings.length
                                        )}
                                    </span>

                                    {" "}of{" "}

                                    <span
                                        className="
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {
                                            filteredBookings.length
                                        }
                                    </span>

                                    {" "}bookings

                                </p>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

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

                                    <span
                                        className="
                                            min-w-[90px]
                                            text-center
                                            text-sm
                                            font-medium
                                            text-slate-600
                                        "
                                    >
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