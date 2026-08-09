"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    MapPin,
    User,
    BriefcaseBusiness,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Star,
    Navigation,
    DollarSign,
    Hash,
    Timer,
    Route,
} from "lucide-react";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type BookingRecord = {
    id: string;

    price?: number;

    skillId?: string;

    status?: string;
    paymentStatus?: string;

    clientId?: string;
    clientName?: string;

    freelancerId?: string;
    freelancerName?: string;

    date?: string;
    time?: string;

    details?: string;

    distance?: string;
    eta?: string;

    isAsap?: boolean;
    enriched?: boolean;
    reviewed?: boolean;

    clientLat?: number;
    clientLng?: number;

    freelancerLat?: number;
    freelancerLng?: number;

    createdAt?: Date | null;
    updatedAt?: Date | null;
    acceptedAt?: Date | null;
    completedAt?: Date | null;
    expiresAt?: Date | null;
    closeDialogAt?: Date | null;
    schedule?: Date | null;
};

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

function formatDate(date: Date | null) {
    if (!date) {
        return "—";
    }

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
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

function formatCurrency(value?: number) {
    if (value === undefined) {
        return "—";
    }

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(value);
}

function normalizeStatus(value?: string) {
    return (
        value
            ?.replace(/_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            ) ?? "Unknown"
    );
}

function StatusBadge({
    status,
}: {
    status?: string;
}) {
    const normalized =
        status?.toLowerCase() ?? "";

    if (
        normalized === "completed" ||
        normalized === "complete"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-green-50
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-green-700
                "
            >
                <CheckCircle2 className="h-4 w-4" />
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
                    gap-2
                    rounded-full
                    bg-red-50
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-red-700
                "
            >
                <XCircle className="h-4 w-4" />
                {normalizeStatus(status)}
            </span>
        );
    }

    if (
        normalized === "accepted" ||
        normalized === "in_progress"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-blue-50
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-blue-700
                "
            >
                <CheckCircle2 className="h-4 w-4" />
                {normalizeStatus(status)}
            </span>
        );
    }

    if (
        normalized === "pending" ||
        normalized === "payment_pending"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-orange-50
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-orange-700
                "
            >
                <AlertCircle className="h-4 w-4" />
                {normalizeStatus(status)}
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-slate-100
                px-3
                py-1.5
                text-sm
                font-semibold
                text-slate-600
            "
        >
            {normalizeStatus(status)}
        </span>
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof User;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="
                    mt-0.5
                    flex
                    h-9
                    w-9
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                "
            >
                <Icon className="h-4 w-4 text-slate-500" />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function AdminBookingDetailPage() {
    const params = useParams();

    const bookingId = Array.isArray(
        params.bookingId
    )
        ? params.bookingId[0]
        : params.bookingId;

    const [booking, setBooking] =
        useState<BookingRecord | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        async function loadBooking() {
            if (!bookingId) {
                setError(
                    "Booking ID is missing."
                );
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const bookingRef = doc(
                    db,
                    "Bookings",
                    bookingId
                );

                const snapshot =
                    await getDoc(bookingRef);

                if (!snapshot.exists()) {
                    setError(
                        "Booking could not be found."
                    );
                    return;
                }

                const data =
                    snapshot.data();

                const loadedBooking: BookingRecord =
                    {
                        id: snapshot.id,

                        price:
                            typeof data.price ===
                            "number"
                                ? data.price
                                : undefined,

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

                        clientId:
                            typeof data.clientId ===
                            "string"
                                ? data.clientId
                                : undefined,

                        clientName:
                            typeof data.clientName ===
                            "string"
                                ? data.clientName
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

                        isAsap:
                            data.isAsap === true,

                        enriched:
                            data.enriched === true,

                        reviewed:
                            data.reviewed === true,

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
                    };

                setBooking(
                    loadedBooking
                );
            } catch (err) {
                console.error(
                    "Failed to load booking:",
                    err
                );

                setError(
                    "Unable to load this booking."
                );
            } finally {
                setLoading(false);
            }
        }

        loadBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
                        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8">
                        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />

                        <div className="mt-4 h-4 w-96 animate-pulse rounded bg-slate-100" />

                        <div className="mt-8 grid gap-6 md:grid-cols-3">
                            {Array.from({
                                length: 6,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-20 animate-pulse rounded-xl bg-slate-100"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !booking) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                    <Link
                        href="/admin/bookings"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-600
                            transition
                            hover:text-blue-600
                        "
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Bookings
                    </Link>

                    <div
                        className="
                            mt-8
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            p-8
                            text-center
                        "
                    >
                        <AlertCircle className="mx-auto h-10 w-10 text-red-400" />

                        <h1 className="mt-4 text-lg font-semibold text-red-800">
                            Unable to load booking
                        </h1>

                        <p className="mt-2 text-sm text-red-600">
                            {error ??
                                "Booking could not be found."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">

            {/* Header */}

            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

                    <Link
                        href="/admin/bookings"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-600
                            transition
                            hover:text-blue-600
                        "
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Bookings
                    </Link>

                </div>
            </div>

            {/* Main */}

            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                {/* Booking Header */}

                <section
                    className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            bg-gradient-to-r
                            from-blue-700
                            via-blue-600
                            to-sky-500
                            px-6
                            py-8
                            lg:px-8
                        "
                    >

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                                <p className="text-sm font-medium text-blue-100">
                                    Booking
                                </p>

                                <h1 className="mt-1 break-all text-2xl font-bold text-white">
                                    {booking.id}
                                </h1>

                                <p className="mt-2 text-sm text-blue-100">
                                    {booking.skillId ??
                                        "Unknown service"}
                                </p>

                            </div>

                            <div className="flex flex-wrap gap-2">

                                <StatusBadge
                                    status={
                                        booking.status
                                    }
                                />

                            </div>

                        </div>

                    </div>

                    <div className="grid gap-6 px-6 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

                        <InfoItem
                            icon={BriefcaseBusiness}
                            label="Service"
                            value={
                                booking.skillId ??
                                "Not specified"
                            }
                        />

                        <InfoItem
                            icon={DollarSign}
                            label="Price"
                            value={formatCurrency(
                                booking.price
                            )}
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="Date"
                            value={
                                booking.date ??
                                "Not specified"
                            }
                        />

                        <InfoItem
                            icon={Clock}
                            label="Time"
                            value={
                                booking.isAsap
                                    ? "ASAP"
                                    : booking.time ??
                                      "Scheduled"
                            }
                        />

                    </div>

                </section>

                {/* Content */}

                <div className="mt-8 grid gap-8 lg:grid-cols-3">

                    {/* Main column */}

                    <div className="space-y-8 lg:col-span-2">

                        {/* Client / Freelancer */}

                        <section className="grid gap-6 md:grid-cols-2">

                            {/* Client */}

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Client
                                        </h2>

                                        <p className="text-xs text-slate-400">
                                            Customer who requested the service
                                        </p>
                                    </div>

                                </div>

                                <div className="mt-5 space-y-4">

                                    <InfoItem
                                        icon={User}
                                        label="Name"
                                        value={
                                            booking.clientName ??
                                            "Not available"
                                        }
                                    />

                                    <InfoItem
                                        icon={Hash}
                                        label="User ID"
                                        value={
                                            booking.clientId ??
                                            "Not available"
                                        }
                                    />

                                </div>

                                {booking.clientId && (
                                    <Link
                                        href={`/admin/users/${booking.clientId}`}
                                        className="
                                            mt-5
                                            inline-flex
                                            items-center
                                            text-sm
                                            font-semibold
                                            text-blue-600
                                            hover:text-blue-700
                                        "
                                    >
                                        View client profile →
                                    </Link>
                                )}

                            </div>

                            {/* Freelancer */}

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                        <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Freelancer
                                        </h2>

                                        <p className="text-xs text-slate-400">
                                            Freelancer assigned to this booking
                                        </p>
                                    </div>

                                </div>

                                <div className="mt-5 space-y-4">

                                    <InfoItem
                                        icon={User}
                                        label="Name"
                                        value={
                                            booking.freelancerName ??
                                            "Not available"
                                        }
                                    />

                                    <InfoItem
                                        icon={Hash}
                                        label="Freelancer ID"
                                        value={
                                            booking.freelancerId ??
                                            "Not available"
                                        }
                                    />

                                </div>

                                {booking.freelancerId && (
                                    <Link
                                        href={`/admin/freelancers/${booking.freelancerId}`}
                                        className="
                                            mt-5
                                            inline-flex
                                            items-center
                                            text-sm
                                            font-semibold
                                            text-blue-600
                                            hover:text-blue-700
                                        "
                                    >
                                        View freelancer profile →
                                    </Link>
                                )}

                            </div>

                        </section>

                        {/* Booking Details */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Booking Details
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Information provided for the service request
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6">

                                <p className="whitespace-pre-wrap leading-7 text-slate-600">
                                    {booking.details ||
                                        "No booking details were provided."}
                                </p>

                            </div>

                        </section>

                        {/* Location */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Location & Travel
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Booking location and freelancer travel information
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">

                                <InfoItem
                                    icon={Route}
                                    label="Distance"
                                    value={
                                        booking.distance ??
                                        "Not available"
                                    }
                                />

                                <InfoItem
                                    icon={Timer}
                                    label="Estimated arrival"
                                    value={
                                        booking.eta ??
                                        "Not available"
                                    }
                                />

                            </div>

                            <div className="mt-6 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2">

                                <div>

                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Client Location
                                    </p>

                                    <div className="mt-3 space-y-2 text-sm">

                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Latitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {booking.clientLat ??
                                                    "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Longitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {booking.clientLng ??
                                                    "—"}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                <div>

                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Freelancer Location
                                    </p>

                                    <div className="mt-3 space-y-2 text-sm">

                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Latitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {booking.freelancerLat ??
                                                    "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Longitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {booking.freelancerLng ??
                                                    "—"}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="mt-6 rounded-xl bg-slate-50 p-4">

                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

                                    <Navigation className="h-4 w-4 text-slate-500" />

                                    Location status

                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    Coordinates are shown for administrative reference. A map can be added later if needed.
                                </p>

                            </div>

                        </section>

                        {/* Timeline */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Booking Timeline
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Important booking lifecycle events
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 space-y-5">

                                <InfoItem
                                    icon={CalendarDays}
                                    label="Created"
                                    value={formatDateTime(
                                        booking.createdAt ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={Clock}
                                    label="Scheduled"
                                    value={formatDateTime(
                                        booking.schedule ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={CheckCircle2}
                                    label="Accepted"
                                    value={formatDateTime(
                                        booking.acceptedAt ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={CheckCircle2}
                                    label="Completed"
                                    value={formatDateTime(
                                        booking.completedAt ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={Clock}
                                    label="Expires"
                                    value={formatDateTime(
                                        booking.expiresAt ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={Clock}
                                    label="Last Updated"
                                    value={formatDateTime(
                                        booking.updatedAt ??
                                            null
                                    )}
                                />

                            </div>

                        </section>

                    </div>

                    {/* Right column */}

                    <aside className="space-y-8">

                        {/* Financial */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                                    <CreditCard className="h-5 w-5 text-green-600" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Payment
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Current payment state
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6">

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Booking Amount
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {formatCurrency(
                                        booking.price
                                    )}
                                </p>

                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-5">

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Payment Status
                                </p>

                                <div className="mt-2">
                                    <StatusBadge
                                        status={
                                            booking.paymentStatus
                                        }
                                    />
                                </div>

                            </div>

                        </section>

                        {/* Booking state */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <h2 className="font-semibold text-slate-900">
                                Booking State
                            </h2>

                            <div className="mt-5 space-y-4">

                                <InfoItem
                                    icon={CheckCircle2}
                                    label="Enriched"
                                    value={
                                        booking.enriched
                                            ? "Yes"
                                            : "No"
                                    }
                                />

                                <InfoItem
                                    icon={Star}
                                    label="Reviewed"
                                    value={
                                        booking.reviewed
                                            ? "Yes"
                                            : "No"
                                    }
                                />

                                <InfoItem
                                    icon={Clock}
                                    label="Booking Type"
                                    value={
                                        booking.isAsap
                                            ? "ASAP"
                                            : "Scheduled"
                                    }
                                />

                            </div>

                        </section>

                        {/* IDs */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <h2 className="font-semibold text-slate-900">
                                References
                            </h2>

                            <div className="mt-5 space-y-5">

                                <InfoItem
                                    icon={Hash}
                                    label="Booking ID"
                                    value={
                                        booking.id
                                    }
                                />

                                <InfoItem
                                    icon={Hash}
                                    label="Client ID"
                                    value={
                                        booking.clientId ??
                                        "—"
                                    }
                                />

                                <InfoItem
                                    icon={Hash}
                                    label="Freelancer ID"
                                    value={
                                        booking.freelancerId ??
                                        "—"
                                    }
                                />

                                <InfoItem
                                    icon={BriefcaseBusiness}
                                    label="Skill ID"
                                    value={
                                        booking.skillId ??
                                        "—"
                                    }
                                />

                            </div>

                        </section>

                    </aside>

                </div>

            </div>

        </main>
    );
}