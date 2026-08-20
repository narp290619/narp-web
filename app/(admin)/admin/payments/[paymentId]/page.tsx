"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Mail,
    Phone,
    BriefcaseBusiness,
    CalendarDays,
    MapPin,
    CreditCard,
    FileText,
    ShieldCheck,
    Loader2,
    AlertCircle,
    ExternalLink,
} from "lucide-react";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import { getFunctions, httpsCallable } from "firebase/functions";

import { db } from "@/lib/firebase";

type PaymentRecord = {
    id: string;

    receiptId?: string;
    requestId?: string;
    clientId?: string;

    skillId?: string;
    amount?: number;
    referenceNumber?: string;

    receiptImageUrl?: string;

    status?: string;
    remarks?: string;

    verifiedBy?: string;
    verifiedAt?: Date | null;

    createdAt?: Date | null;
};

type UserRecord = {
    id: string;

    name?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;

    email?: string;
    phoneNumber?: string;

    profileImageUrl?: string;
};

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

    distance?: number;
    eta?: string;

    clientLat?: number;
    clientLng?: number;

    freelancerLat?: number;
    freelancerLng?: number;

    address?: string;

    createdAt?: Date | null;
    acceptedAt?: Date | null;
    updatedAt?: Date | null;
    expiresAt?: Date | null;
    completedAt?: Date | null;
};

type Booking = {
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

    distance?: number;
    eta?: string;

    clientLat?: number;
    clientLng?: number;

    freelancerLat?: number;
    freelancerLng?: number;

    address?: string;

    createdAt?: Date | null;
    acceptedAt?: Date | null;
    updatedAt?: Date | null;
    expiresAt?: Date | null;
    completedAt?: Date | null;
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

function getString(
    value: unknown
): string | undefined {
    return typeof value === "string"
        ? value
        : undefined;
}

function getNumber(
    value: unknown
): number | undefined {
    return typeof value === "number"
        ? value
        : undefined;
}

function getBoolean(
    value: unknown
): boolean | undefined {
    return typeof value === "boolean"
        ? value
        : undefined;
}

function getUserName(
    user?: UserRecord | null
) {
    if (!user) {
        return "Unknown Client";
    }

    if (user.name?.trim()) {
        return user.name;
    }

    const fullName = [
        user.firstName,
        user.middleName,
        user.lastName,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || "Unknown Client";
}

function formatMoney(
    value?: number
) {
    if (value === undefined) {
        return "₱—";
    }

    return `₱${value.toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;
}

function formatDate(
    date?: Date | null
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
    date?: Date | null
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

function normalizeStatus(
    value?: string
) {
    return (
        value
            ?.trim()
            .toLowerCase() ?? ""
    );
}

function PaymentStatusBadge({
    status,
}: {
    status?: string;
}) {
    const normalized =
        normalizeStatus(status);

    if (normalized === "approved") {
        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Approved
            </span>
        );
    }

    if (normalized === "rejected") {
        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700">
                <XCircle className="h-4 w-4" />
                Rejected
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
            <Clock className="h-4 w-4" />
            Pending Verification
        </span>
    );
}

function StatusBadge({
    value,
}: {
    value?: string;
}) {
    if (!value) {
        return (
            <span className="text-sm text-slate-400">
                —
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
            {value.replaceAll("_", " ")}
        </span>
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Mail;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
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

function parsePayment(
    id: string,
    data: Record<string, unknown>
): PaymentRecord {
    return {
        id,

        receiptId:
            getString(data.receiptId),

        requestId:
            getString(data.requestId),

        clientId:
            getString(data.clientId),

        skillId:
            getString(data.skillId),

        amount:
            getNumber(data.amount),

        referenceNumber:
            data.referenceNumber !== undefined
                ? String(
                    data.referenceNumber
                )
                : undefined,

        receiptImageUrl:
            getString(
                data.receiptImageUrl
            ),

        status:
            getString(data.status),

        remarks:
            getString(data.remarks),

        verifiedBy:
            getString(data.verifiedBy),

        verifiedAt:
            getDate(data.verifiedAt),

        createdAt:
            getDate(data.createdAt),
    };
}

function parseUser(
    id: string,
    data: Record<string, unknown>
): UserRecord {
    return {
        id,

        name:
            getString(data.name),

        firstName:
            getString(data.firstName),

        middleName:
            getString(data.middleName),

        lastName:
            getString(data.lastName),

        email:
            getString(data.email),

        phoneNumber:
            getString(data.phoneNumber),

        profileImageUrl:
            getString(
                data.profileImageUrl
            ),
    };
}

function parseRequest(
    id: string,
    data: Record<string, unknown>
): PostJobRequest {
    return {
        id,

        clientId:
            getString(data.clientId),

        freelancerId:
            getString(
                data.freelancerId
            ),

        freelancerName:
            getString(
                data.freelancerName
            ),

        skillId:
            getString(data.skillId),

        details:
            getString(data.details),

        price:
            getNumber(data.price),

        status:
            getString(data.status),

        paymentStatus:
            getString(
                data.paymentStatus
            ),

        date:
            getString(data.date),

        time:
            getString(data.time),

        isAsap:
            getBoolean(data.isAsap),

        distance:
            getNumber(data.distance),

        eta:
            getString(data.eta),

        clientLat:
            getNumber(data.clientLat),

        clientLng:
            getNumber(data.clientLng),

        freelancerLat:
            getNumber(
                data.freelancerLat
            ),

        freelancerLng:
            getNumber(
                data.freelancerLng
            ),

        address:
            getString(data.address),

        createdAt:
            getDate(data.createdAt),

        acceptedAt:
            getDate(data.acceptedAt),

        updatedAt:
            getDate(data.updatedAt),

        expiresAt:
            getDate(data.expiresAt),

        completedAt:
            getDate(data.completedAt),
    };
}

function parseBooking(
    id: string,
    data: Record<string, unknown>
): Booking {
    return {
        id,

        clientId:
            getString(data.clientId),

        freelancerId:
            getString(
                data.freelancerId
            ),

        freelancerName:
            getString(
                data.freelancerName
            ),

        skillId:
            getString(data.skillId),

        details:
            getString(data.details),

        price:
            getNumber(data.price),

        status:
            getString(data.status),

        paymentStatus:
            getString(
                data.paymentStatus
            ),

        date:
            getString(data.date),

        time:
            getString(data.time),

        isAsap:
            getBoolean(data.isAsap),

        distance:
            getNumber(data.distance),

        eta:
            getString(data.eta),

        clientLat:
            getNumber(data.clientLat),

        clientLng:
            getNumber(data.clientLng),

        freelancerLat:
            getNumber(
                data.freelancerLat
            ),

        freelancerLng:
            getNumber(
                data.freelancerLng
            ),

        address:
            getString(data.address),

        createdAt:
            getDate(data.createdAt),

        acceptedAt:
            getDate(data.acceptedAt),

        updatedAt:
            getDate(data.updatedAt),

        expiresAt:
            getDate(data.expiresAt),

        completedAt:
            getDate(data.completedAt),
    };
}

export default function AdminPaymentDetailPage() {
    const params = useParams();
    const router = useRouter();

    const paymentId =
        Array.isArray(params.paymentId)
            ? params.paymentId[0]
            : params.paymentId;

    const [payment, setPayment] =
        useState<PaymentRecord | null>(
            null
        );

    const [client, setClient] =
        useState<UserRecord | null>(
            null
        );

    const [postJobRequest, setPostJobRequest] =
        useState<PostJobRequest | null>(
            null
        );

    const [booking, setBooking] =
        useState<Booking | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(
            null
        );

    const [actionLoading, setActionLoading] =
        useState<
            "approve" |
            "reject" |
            null
        >(null);

    const [showRejectDialog, setShowRejectDialog] =
        useState(false);

    const [rejectRemarks, setRejectRemarks] =
        useState("");

    const [actionError, setActionError] =
        useState<string | null>(
            null
        );

    async function loadPayment() {
        if (!paymentId) {
            setError(
                "Payment ID is missing."
            );
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            /*
             * 1. Payment receipt
             */

            const paymentRef = doc(
                db,
                "PaymentReceipts",
                paymentId
            );

            const paymentSnapshot =
                await getDoc(
                    paymentRef
                );

            if (!paymentSnapshot.exists()) {
                setError(
                    "Payment receipt could not be found."
                );
                return;
            }

            const paymentData =
                parsePayment(
                    paymentSnapshot.id,
                    paymentSnapshot.data()
                );

            setPayment(paymentData);

            /*
             * 2. Client
             */

            if (paymentData.clientId) {
                const clientRef = doc(
                    db,
                    "Users",
                    paymentData.clientId
                );

                const clientSnapshot =
                    await getDoc(
                        clientRef
                    );

                if (
                    clientSnapshot.exists()
                ) {
                    setClient(
                        parseUser(
                            clientSnapshot.id,
                            clientSnapshot.data()
                        )
                    );
                } else {
                    setClient(null);
                }
            }

            /*
             * 3. PostJobRequest
             *
             * requestId is the document ID.
             */

            if (paymentData.requestId) {
                const requestRef =
                    doc(
                        db,
                        "PostJobRequests",
                        paymentData.requestId
                    );

                const requestSnapshot =
                    await getDoc(
                        requestRef
                    );

                if (
                    requestSnapshot.exists()
                ) {
                    setPostJobRequest(
                        parseRequest(
                            requestSnapshot.id,
                            requestSnapshot.data()
                        )
                    );
                } else {
                    setPostJobRequest(
                        null
                    );
                }

                /*
                 * 4. Booking
                 *
                 * IMPORTANT:
                 * Same requestId is the
                 * Booking document ID.
                 */

                const bookingRef =
                    doc(
                        db,
                        "Bookings",
                        paymentData.requestId
                    );

                const bookingSnapshot =
                    await getDoc(
                        bookingRef
                    );

                if (
                    bookingSnapshot.exists()
                ) {
                    setBooking(
                        parseBooking(
                            bookingSnapshot.id,
                            bookingSnapshot.data()
                        )
                    );
                } else {
                    setBooking(null);
                }
            }
        } catch (err) {
            console.error(
                "Failed to load payment:",
                err
            );

            setError(
                "Unable to load this payment."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPayment();
    }, [paymentId]);

    /*
     * Approve payment
     */

    async function approvePayment() {
        if (!payment?.requestId) {
            return;
        }

        try {
            setActionLoading("approve");
            setActionError(null);

            const functions = getFunctions(
                undefined,
                "asia-southeast1"
            );

            const callable = httpsCallable(
                functions,
                "approvePayment"
            );

            await callable.call({
                receiptId: payment.id,
                requestId: payment.requestId,
            });

            await loadPayment();
        } catch (err) {
            console.error(
                "Failed to approve payment:",
                err
            );

            setActionError(
                err instanceof Error
                    ? err.message
                    : "Unable to approve payment."
            );
        } finally {
            setActionLoading(null);
        }
    }

    /*
     * Reject payment
     */

    async function rejectPayment() {
        if (!payment?.requestId) {
            return;
        }

        const remarks =
            rejectRemarks.trim();

        if (!remarks) {
            setActionError(
                "Please provide a reason for rejecting the payment."
            );
            return;
        }

        try {
            setActionLoading("reject");
            setActionError(null);

            const functions = getFunctions(
                undefined,
                "asia-southeast1"
            );

            const callable = httpsCallable(
                functions,
                "rejectPayment"
            );

            await callable.call({
                receiptId: payment.id,
                requestId: payment.requestId,
                remarks,
            });

            setShowRejectDialog(false);
            setRejectRemarks("");

            await loadPayment();
        } catch (err) {
            console.error(
                "Failed to reject payment:",
                err
            );

            setActionError(
                err instanceof Error
                    ? err.message
                    : "Unable to reject payment."
            );
        } finally {
            setActionLoading(null);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
                        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <div className="space-y-6">
                        <div className="h-48 animate-pulse rounded-3xl bg-slate-200" />

                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="h-64 animate-pulse rounded-2xl bg-slate-200 lg:col-span-2" />
                            <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !payment) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                    <Link
                        href="/admin/payments"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Payments
                    </Link>

                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                        <AlertCircle className="mx-auto h-10 w-10 text-red-400" />

                        <h1 className="mt-4 text-lg font-semibold text-red-800">
                            Unable to load payment
                        </h1>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const clientName =
        getUserName(client);

    const canProcess =
        normalizeStatus(
            payment.status
        ) === "pending";

    return (
        <main className="min-h-screen bg-slate-50">

            {/* Header */}

            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

                    <Link
                        href="/admin/payments"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Payments
                    </Link>

                </div>
            </div>

            {/* Main */}

            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                {/* Payment header */}

                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-6 py-8 lg:px-8">

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                            <div>
                                <p className="text-sm font-medium text-blue-100">
                                    Payment Receipt
                                </p>

                                <h1 className="mt-1 text-3xl font-bold text-white">
                                    {formatMoney(
                                        payment.amount
                                    )}
                                </h1>

                                <p className="mt-2 font-mono text-sm text-blue-100">
                                    {payment.id}
                                </p>
                            </div>

                            <PaymentStatusBadge
                                status={
                                    payment.status
                                }
                            />

                        </div>

                    </div>

                    <div className="grid gap-6 px-6 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

                        <InfoItem
                            icon={
                                CreditCard
                            }
                            label="Reference"
                            value={
                                payment.referenceNumber ??
                                "Not provided"
                            }
                        />

                        <InfoItem
                            icon={
                                FileText
                            }
                            label="Receipt ID"
                            value={
                                payment.receiptId ??
                                payment.id
                            }
                        />

                        <InfoItem
                            icon={
                                BriefcaseBusiness
                            }
                            label="Service"
                            value={
                                payment.skillId ??
                                "Unknown"
                            }
                        />

                        <InfoItem
                            icon={
                                CalendarDays
                            }
                            label="Submitted"
                            value={formatDateTime(
                                payment.createdAt
                            )}
                        />

                    </div>

                </section>

                {actionError && (
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />

                        <span>
                            {actionError}
                        </span>
                    </div>
                )}

                {/* Content */}

                <div className="mt-8 grid gap-8 lg:grid-cols-3">

                    <div className="space-y-8 lg:col-span-2">

                        {/* Receipt image */}

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Payment Receipt
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Submitted payment proof
                                    </p>
                                </div>
                            </div>

                            {payment.receiptImageUrl ? (
                                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                    <img
                                        src={
                                            payment.receiptImageUrl
                                        }
                                        alt="Payment receipt"
                                        className="max-h-[700px] w-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="mt-6 rounded-xl bg-slate-50 p-10 text-center text-sm text-slate-400">
                                    No receipt image available.
                                </div>
                            )}

                            {payment.remarks && (
                                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                                        Rejection Remarks
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-red-700">
                                        {
                                            payment.remarks
                                        }
                                    </p>
                                </div>
                            )}

                        </section>

                        {/* Post Job Request */}

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center justify-between gap-4">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                        <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Post Job Request
                                        </h2>

                                        <p className="text-xs text-slate-400">
                                            Original service request
                                        </p>
                                    </div>
                                </div>

                                <span className="font-mono text-xs text-slate-400">
                                    {payment.requestId ??
                                        "—"}
                                </span>

                            </div>

                            {postJobRequest ? (
                                <div className="mt-6 space-y-6">

                                    <div className="grid gap-5 sm:grid-cols-2">

                                        <InfoItem
                                            icon={
                                                BriefcaseBusiness
                                            }
                                            label="Skill"
                                            value={
                                                postJobRequest.skillId ??
                                                "Unknown"
                                            }
                                        />

                                        <InfoItem
                                            icon={
                                                CreditCard
                                            }
                                            label="Price"
                                            value={formatMoney(
                                                postJobRequest.price
                                            )}
                                        />

                                        <InfoItem
                                            icon={
                                                CalendarDays
                                            }
                                            label="Date"
                                            value={
                                                postJobRequest.date ??
                                                "—"
                                            }
                                        />

                                        <InfoItem
                                            icon={
                                                Clock
                                            }
                                            label="Time"
                                            value={
                                                postJobRequest.isAsap
                                                    ? "ASAP"
                                                    : postJobRequest.time ??
                                                    "—"
                                            }
                                        />

                                    </div>

                                    <div className="border-t border-slate-100 pt-5">

                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Details
                                        </p>

                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                            {postJobRequest.details ??
                                                "No details provided."}
                                        </p>

                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">

                                        <InfoItem
                                            icon={
                                                User
                                            }
                                            label="Freelancer"
                                            value={
                                                postJobRequest.freelancerName ??
                                                postJobRequest.freelancerId ??
                                                "Not assigned"
                                            }
                                        />

                                        <InfoItem
                                            icon={
                                                CheckCircle2
                                            }
                                            label="Request Status"
                                            value={
                                                postJobRequest.status ??
                                                "Unknown"
                                            }
                                        />

                                        <InfoItem
                                            icon={
                                                CreditCard
                                            }
                                            label="Payment Status"
                                            value={
                                                postJobRequest.paymentStatus ??
                                                "Unknown"
                                            }
                                        />

                                        <InfoItem
                                            icon={
                                                MapPin
                                            }
                                            label="Distance"
                                            value={
                                                postJobRequest.distance !==
                                                    undefined
                                                    ? `${postJobRequest.distance} km`
                                                    : "—"
                                            }
                                        />

                                    </div>

                                    {postJobRequest.address && (
                                        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                                            <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Address
                                                </p>

                                                <p className="mt-1 text-sm text-slate-700">
                                                    {
                                                        postJobRequest.address
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-700">
                                    The PostJobRequest with ID{" "}
                                    <span className="font-mono font-semibold">
                                        {
                                            payment.requestId
                                        }
                                    </span>{" "}
                                    could not be found.
                                </div>
                            )}

                        </section>

                        {/* Booking */}

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center justify-between gap-4">

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Booking
                                        </h2>

                                        <p className="text-xs text-slate-400">
                                            Booking created from this request
                                        </p>
                                    </div>
                                </div>

                                <span className="font-mono text-xs text-slate-400">
                                    {payment.requestId ??
                                        "—"}
                                </span>

                            </div>

                            {booking ? (
                                <div className="mt-6 space-y-6">

                                    <div className="grid gap-5 sm:grid-cols-2">

                                        <InfoItem
                                            icon={
                                                BriefcaseBusiness
                                            }
                                            label="Skill"
                                            value={
                                                booking.skillId ??
                                                "Unknown"
                                            }
                                        />

                                        <InfoItem
                                            icon={
                                                CreditCard
                                            }
                                            label="Price"
                                            value={formatMoney(
                                                booking.price
                                            )}
                                        />

                                        <InfoItem
                                            icon={
                                                CheckCircle2
                                            }
                                            label="Booking Status"
                                            value={
                                                booking.status ??
                                                "Unknown"
                                            }
                                        />

                                        <InfoItem
                                            icon={
                                                CreditCard
                                            }
                                            label="Payment Status"
                                            value={
                                                booking.paymentStatus ??
                                                "Unknown"
                                            }
                                        />

                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">

                                        <InfoItem
                                            icon={
                                                User
                                            }
                                            label="Freelancer"
                                            value={
                                                booking.freelancerName ??
                                                booking.freelancerId ??
                                                "Unknown"
                                            }
                                        />

                                        <InfoItem
                                            icon={
                                                CalendarDays
                                            }
                                            label="Schedule"
                                            value={
                                                booking.isAsap
                                                    ? "ASAP"
                                                    : `${booking.date ?? "—"} ${booking.time ?? ""}`.trim()
                                            }
                                        />

                                    </div>

                                    {booking.details && (
                                        <div className="border-t border-slate-100 pt-5">

                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Details
                                            </p>

                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                                {
                                                    booking.details
                                                }
                                            </p>

                                        </div>
                                    )}

                                </div>
                            ) : (
                                <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-700">
                                    The Booking with ID{" "}
                                    <span className="font-mono font-semibold">
                                        {
                                            payment.requestId
                                        }
                                    </span>{" "}
                                    could not be found.
                                </div>
                            )}

                        </section>

                    </div>

                    {/* Right sidebar */}

                    <aside className="space-y-8">

                        {/* Client */}

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">

                                {client?.profileImageUrl ? (
                                    <img
                                        src={
                                            client.profileImageUrl
                                        }
                                        alt={
                                            clientName
                                        }
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                                        {clientName
                                            .split(" ")
                                            .filter(
                                                Boolean
                                            )
                                            .slice(
                                                0,
                                                2
                                            )
                                            .map(
                                                (
                                                    part
                                                ) =>
                                                    part[0]
                                            )
                                            .join("")
                                            .toUpperCase()}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <h2 className="truncate font-semibold text-slate-900">
                                        {clientName}
                                    </h2>

                                    <p className="mt-0.5 truncate text-xs text-slate-400">
                                        Client
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 space-y-5">

                                <InfoItem
                                    icon={
                                        Mail
                                    }
                                    label="Email"
                                    value={
                                        client?.email ??
                                        "Not provided"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        Phone
                                    }
                                    label="Phone"
                                    value={
                                        client?.phoneNumber ??
                                        "Not provided"
                                    }
                                />

                            </div>

                            {payment.clientId && (
                                <div className="mt-5 border-t border-slate-100 pt-5">

                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Client ID
                                    </p>

                                    <p className="mt-1 break-all font-mono text-xs text-slate-500">
                                        {
                                            payment.clientId
                                        }
                                    </p>

                                </div>
                            )}

                        </section>

                        {/* Verification */}

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Verification
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Payment review information
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-5">

                                <InfoItem
                                    icon={
                                        ShieldCheck
                                    }
                                    label="Status"
                                    value={
                                        payment.status ??
                                        "Unknown"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        User
                                    }
                                    label="Verified By"
                                    value={
                                        payment.verifiedBy ??
                                        "Not yet verified"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        CalendarDays
                                    }
                                    label="Verified At"
                                    value={formatDateTime(
                                        payment.verifiedAt
                                    )}
                                />

                            </div>

                        </section>

                        {/* Actions */}

                        {canProcess && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <h2 className="font-semibold text-slate-900">
                                    Admin Actions
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Verify the submitted payment before allowing the funds to be held.
                                </p>

                                <div className="mt-6 space-y-3">

                                    <button
                                        type="button"
                                        disabled={
                                            actionLoading !==
                                            null
                                        }
                                        onClick={
                                            approvePayment
                                        }
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {actionLoading ===
                                            "approve" ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4" />
                                        )}

                                        {actionLoading ===
                                            "approve"
                                            ? "Approving..."
                                            : "Approve Payment"}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            actionLoading !==
                                            null
                                        }
                                        onClick={() => {
                                            setActionError(
                                                null
                                            );
                                            setShowRejectDialog(
                                                true
                                            );
                                        }}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Reject Payment
                                    </button>

                                </div>

                            </section>
                        )}

                    </aside>

                </div>

            </div>

            {/* Reject dialog */}

            {showRejectDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Reject Payment
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Provide a reason for rejection.
                                </p>
                            </div>

                        </div>

                        <textarea
                            value={
                                rejectRemarks
                            }
                            onChange={(
                                event
                            ) =>
                                setRejectRemarks(
                                    event.target
                                        .value
                                )
                            }
                            rows={5}
                            placeholder="Reason for rejection..."
                            className="mt-6 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                        />

                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                disabled={
                                    actionLoading !==
                                    null
                                }
                                onClick={() =>
                                    setShowRejectDialog(
                                        false
                                    )
                                }
                                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    actionLoading !==
                                    null ||
                                    !rejectRemarks.trim()
                                }
                                onClick={
                                    rejectPayment
                                }
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {actionLoading ===
                                    "reject" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <XCircle className="h-4 w-4" />
                                )}

                                {actionLoading ===
                                    "reject"
                                    ? "Rejecting..."
                                    : "Reject Payment"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </main>
    );
}