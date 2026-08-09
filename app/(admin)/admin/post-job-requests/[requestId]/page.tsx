"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    User,
    UserRound,
    BriefcaseBusiness,
    MapPin,
    PhilippinePeso,
    CreditCard,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Navigation,
    Timer,
    FileText,
} from "lucide-react";

import {
    doc,
    getDoc,
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

    isAsap?: boolean;

    address?: string;

    distance?: string;
    eta?: string;

    clientLat?: number;
    clientLng?: number;

    freelancerLat?: number;
    freelancerLng?: number;

    freelancerLocation?: {
        latitude: number;
        longitude: number;
    };

    createdAt?: Date | null;
    updatedAt?: Date | null;
    acceptedAt?: Date | null;
    completedAt?: Date | null;
    expiresAt?: Date | null;
    closeDialogAt?: Date | null;
    schedule?: Date | null;

    reviewed?: boolean;
    enriched?: boolean;

    rawData?: Record<string, unknown>;
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

function getNumber(
    value: unknown
): number | undefined {
    return typeof value === "number"
        ? value
        : undefined;
}

function getString(
    value: unknown
): string | undefined {
    return typeof value === "string"
        ? value
        : undefined;
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
            month: "long",
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

function formatCurrency(
    value?: number
) {
    if (value === undefined) {
        return "—";
    }

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }
    ).format(value);
}

function StatusBadge({
    status,
}: {
    status?: string;
}) {
    const normalized =
        status?.toLowerCase() ?? "";

    if (
        normalized === "accepted" ||
        normalized === "completed"
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

                {status === "accepted"
                    ? "Accepted"
                    : "Completed"}
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
                <Timer className="h-4 w-4" />

                Expired
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
                bg-blue-50
                px-3
                py-1.5
                text-sm
                font-semibold
                text-blue-700
            "
        >
            <AlertCircle className="h-4 w-4" />

            {status || "Pending"}
        </span>
    );
}

function PaymentBadge({
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

                {status === "held"
                    ? "Payment Held"
                    : "Paid"}
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
                <Clock className="h-4 w-4" />

                Payment Pending
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
            {status || "Unknown"}
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

export default function AdminPostJobRequestDetailPage() {
    const params = useParams();

    const requestId = Array.isArray(
        params.requestId
    )
        ? params.requestId[0]
        : params.requestId;

    const [request, setRequest] =
        useState<PostJobRequest | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        async function loadRequest() {
            if (!requestId) {
                setError(
                    "Request ID is missing."
                );

                setLoading(false);

                return;
            }

            try {
                setLoading(true);
                setError(null);

                const requestRef = doc(
                    db,
                    "PostJobRequests",
                    requestId
                );

                const snapshot =
                    await getDoc(requestRef);

                if (!snapshot.exists()) {
                    setError(
                        "Post job request could not be found."
                    );

                    return;
                }

                const data =
                    snapshot.data();

                const freelancerLocation =
                    data.freelancerLocation &&
                    typeof data.freelancerLocation ===
                        "object" &&
                    "latitude" in
                        data.freelancerLocation &&
                    "longitude" in
                        data.freelancerLocation
                        ? {
                              latitude:
                                  Number(
                                      (
                                          data.freelancerLocation as {
                                              latitude: number;
                                          }
                                      ).latitude
                                  ),
                              longitude:
                                  Number(
                                      (
                                          data.freelancerLocation as {
                                              longitude: number;
                                          }
                                      ).longitude
                                  ),
                          }
                        : undefined;

                const loadedRequest: PostJobRequest =
                    {
                        id: snapshot.id,

                        clientId:
                            getString(
                                data.clientId
                            ),

                        freelancerId:
                            getString(
                                data.freelancerId
                            ),

                        freelancerName:
                            getString(
                                data.freelancerName
                            ),

                        skillId:
                            getString(
                                data.skillId
                            ),

                        details:
                            getString(
                                data.details
                            ),

                        price:
                            getNumber(
                                data.price
                            ),

                        status:
                            getString(
                                data.status
                            ),

                        paymentStatus:
                            getString(
                                data.paymentStatus
                            ),

                        date:
                            getString(
                                data.date
                            ),

                        time:
                            getString(
                                data.time
                            ),

                        isAsap:
                            data.isAsap ===
                            true,

                        address:
                            getString(
                                data.address
                            ),

                        distance:
                            getString(
                                data.distance
                            ),

                        eta:
                            getString(
                                data.eta
                            ),

                        clientLat:
                            getNumber(
                                data.clientLat
                            ),

                        clientLng:
                            getNumber(
                                data.clientLng
                            ),

                        freelancerLat:
                            getNumber(
                                data.freelancerLat
                            ),

                        freelancerLng:
                            getNumber(
                                data.freelancerLng
                            ),

                        freelancerLocation,

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

                        reviewed:
                            data.reviewed ===
                            true,

                        enriched:
                            data.enriched ===
                            true,

                        rawData:
                            data,
                    };

                setRequest(
                    loadedRequest
                );
            } catch (err) {
                console.error(
                    "Failed to load post job request:",
                    err
                );

                setError(
                    "Unable to load this post job request."
                );
            } finally {
                setLoading(false);
            }
        }

        loadRequest();
    }, [requestId]);

    /*
     * Loading
     */

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">

                <div className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

                        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    <div className="rounded-3xl border border-slate-200 bg-white p-8">

                        <div className="h-8 w-72 animate-pulse rounded bg-slate-200" />

                        <div className="mt-4 h-4 w-96 animate-pulse rounded bg-slate-100" />

                        <div className="mt-8 grid gap-6 sm:grid-cols-3">

                            {Array.from({
                                length: 3,
                            }).map(
                                (_, index) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="h-24 animate-pulse rounded-2xl bg-slate-100"
                                    />
                                )
                            )}

                        </div>

                    </div>

                </div>

            </main>
        );
    }

    /*
     * Error
     */

    if (error || !request) {
        return (
            <main className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                    <Link
                        href="/admin/post-job-requests"
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

                        Back to Post Job Requests
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
                        <XCircle className="mx-auto h-10 w-10 text-red-400" />

                        <h1 className="mt-4 text-lg font-semibold text-red-800">
                            Unable to load request
                        </h1>

                        <p className="mt-2 text-sm text-red-600">
                            {error ??
                                "Request could not be found."}
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

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-6
                        lg:px-8
                    "
                >

                    <Link
                        href="/admin/post-job-requests"
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

                        Back to Post Job Requests
                    </Link>

                </div>

            </div>

            {/* Content */}

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-6
                    py-8
                    lg:px-8
                "
            >

                {/* Hero */}

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
                            h-32
                            bg-gradient-to-r
                            from-blue-700
                            via-blue-600
                            to-sky-500
                        "
                    />

                    <div className="px-6 pb-7 lg:px-8">

                        <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <div
                                    className="
                                        flex
                                        h-20
                                        w-20
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border-4
                                        border-white
                                        bg-blue-100
                                        shadow-lg
                                    "
                                >
                                    <FileText className="h-9 w-9 text-blue-700" />
                                </div>

                                <h1 className="mt-5 text-2xl font-bold text-slate-900">
                                    Post Job Request
                                </h1>

                                <p className="mt-1 break-all text-sm text-slate-400">
                                    {request.id}
                                </p>

                                <div className="mt-4 flex flex-wrap items-center gap-2">

                                    <StatusBadge
                                        status={
                                            request.status
                                        }
                                    />

                                    <PaymentBadge
                                        status={
                                            request.paymentStatus
                                        }
                                    />

                                    {request.isAsap && (
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
                                            <Timer className="h-4 w-4" />

                                            ASAP
                                        </span>
                                    )}

                                </div>

                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 sm:min-w-[220px]">

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Job Price
                                </p>

                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {formatCurrency(
                                        request.price
                                    )}
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                {/* Main grid */}

                <div className="mt-8 grid gap-8 lg:grid-cols-3">

                    {/* Main column */}

                    <div className="space-y-8 lg:col-span-2">

                        {/* Job Details */}

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

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Job Details
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Information submitted by the client
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">

                                <InfoItem
                                    icon={
                                        BriefcaseBusiness
                                    }
                                    label="Skill"
                                    value={
                                        request.skillId ??
                                        "Not specified"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        PhilippinePeso
                                    }
                                    label="Price"
                                    value={formatCurrency(
                                        request.price
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        CalendarDays
                                    }
                                    label="Date"
                                    value={
                                        request.date ??
                                        "Not specified"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        Clock
                                    }
                                    label="Time"
                                    value={
                                        request.time ??
                                        "Not specified"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        Timer
                                    }
                                    label="ETA"
                                    value={
                                        request.eta ??
                                        "Not available"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        Navigation
                                    }
                                    label="Distance"
                                    value={
                                        request.distance ??
                                        "Not available"
                                    }
                                />

                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-6">

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Job Description
                                </p>

                                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                                    {request.details ||
                                        "No job details provided."}
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

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Location
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Client and freelancer location data
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6">

                                <InfoItem
                                    icon={
                                        MapPin
                                    }
                                    label="Service Address"
                                    value={
                                        request.address ??
                                        "Address not provided"
                                    }
                                />

                            </div>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Client Coordinates
                                    </p>

                                    <div className="mt-3 space-y-2 text-sm">

                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Latitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {request.clientLat ??
                                                    "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Longitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {request.clientLng ??
                                                    "—"}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Freelancer Coordinates
                                    </p>

                                    <div className="mt-3 space-y-2 text-sm">

                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Latitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {request.freelancerLat ??
                                                    request
                                                        .freelancerLocation
                                                        ?.latitude ??
                                                    "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Longitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {request.freelancerLng ??
                                                    request
                                                        .freelancerLocation
                                                        ?.longitude ??
                                                    "—"}
                                            </span>
                                        </div>

                                    </div>

                                </div>

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

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <Clock className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Request Timeline
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Important lifecycle timestamps
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 space-y-6">

                                <InfoItem
                                    icon={
                                        CalendarDays
                                    }
                                    label="Created"
                                    value={formatDateTime(
                                        request.createdAt ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        Clock
                                    }
                                    label="Scheduled"
                                    value={formatDateTime(
                                        request.schedule ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        CheckCircle2
                                    }
                                    label="Accepted"
                                    value={formatDateTime(
                                        request.acceptedAt ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        Clock
                                    }
                                    label="Expires"
                                    value={formatDateTime(
                                        request.expiresAt ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        Clock
                                    }
                                    label="Last Updated"
                                    value={formatDateTime(
                                        request.updatedAt ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        CheckCircle2
                                    }
                                    label="Completed"
                                    value={formatDateTime(
                                        request.completedAt ??
                                            null
                                    )}
                                />

                            </div>

                        </section>

                    </div>

                    {/* Sidebar */}

                    <aside className="space-y-8">

                        {/* Client */}

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

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>

                                <h2 className="font-semibold text-slate-900">
                                    Client
                                </h2>

                            </div>

                            <div className="mt-5">

                                <InfoItem
                                    icon={
                                        User
                                    }
                                    label="Client ID"
                                    value={
                                        request.clientId ??
                                        "Unknown"
                                    }
                                />

                            </div>

                        </section>

                        {/* Freelancer */}

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

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <UserRound className="h-5 w-5 text-blue-600" />
                                </div>

                                <h2 className="font-semibold text-slate-900">
                                    Freelancer
                                </h2>

                            </div>

                            <div className="mt-5 space-y-5">

                                <InfoItem
                                    icon={
                                        UserRound
                                    }
                                    label="Name"
                                    value={
                                        request.freelancerName ??
                                        "Unknown"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        User
                                    }
                                    label="Freelancer ID"
                                    value={
                                        request.freelancerId ??
                                        "Unknown"
                                    }
                                />

                            </div>

                        </section>

                        {/* Payment */}

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

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                </div>

                                <h2 className="font-semibold text-slate-900">
                                    Payment
                                </h2>

                            </div>

                            <div className="mt-5 space-y-5">

                                <InfoItem
                                    icon={
                                        PhilippinePeso
                                    }
                                    label="Amount"
                                    value={formatCurrency(
                                        request.price
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        CreditCard
                                    }
                                    label="Payment Status"
                                    value={
                                        request.paymentStatus ??
                                        "Unknown"
                                    }
                                />

                            </div>

                        </section>

                        {/* Flags */}

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
                                Request Flags
                            </h2>

                            <div className="mt-5 space-y-4">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-500">
                                        Reviewed
                                    </span>

                                    {request.reviewed ? (
                                        <span className="font-semibold text-green-600">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="font-semibold text-slate-400">
                                            No
                                        </span>
                                    )}

                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-500">
                                        Enriched
                                    </span>

                                    {request.enriched ? (
                                        <span className="font-semibold text-green-600">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="font-semibold text-slate-400">
                                            No
                                        </span>
                                    )}

                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-sm text-slate-500">
                                        ASAP
                                    </span>

                                    {request.isAsap ? (
                                        <span className="font-semibold text-orange-600">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="font-semibold text-slate-400">
                                            No
                                        </span>
                                    )}

                                </div>

                            </div>

                        </section>

                    </aside>

                </div>

            </div>

        </main>
    );
}