"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    Receipt,
    User,
    BriefcaseBusiness,
    CalendarDays,
    CreditCard,
    ShieldCheck,
    AlertTriangle,
    FileText,
    ExternalLink,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    Loader2,
} from "lucide-react";

import {
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
} from "firebase/firestore";

import {
    getAuth,
} from "firebase/auth";

import { db } from "@/lib/firebase";

/*
 * =====================================================
 * TYPES
 * =====================================================
 */

type PaymentRecord = {
    id: string;

    clientId?: string;
    requestId?: string;
    receiptId?: string;

    skillId?: string;

    amount?: number;
    referenceNumber?: string;

    receiptImageUrl?: string;

    status?: string;
    remarks?: string;

    verifiedBy?: string;

    createdAt?: Date | null;
    verifiedAt?: Date | null;
};

type ClientRecord = {
    id: string;

    name?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;

    email?: string;
    phoneNumber?: string;

    profileImageUrl?: string;
};

type RequestRecord = {
    id: string;

    clientId?: string;
    freelancerId?: string;
    freelancerName?: string;

    skillId?: string;

    price?: number;

    status?: string;
    paymentStatus?: string;

    details?: string;
    address?: string;

    date?: string;
    time?: string;

    createdAt?: Date | null;
    updatedAt?: Date | null;
    schedule?: Date | null;

    completedAt?: Date | null;
};

type BookingRecord = {
    id: string;

    freelancerId?: string;
    freelancerName?: string;

    clientId?: string;

    skillId?: string;

    price?: number;

    status?: string;
    paymentStatus?: string;

    details?: string;

    date?: string;
    time?: string;

    createdAt?: Date | null;
    updatedAt?: Date | null;

    completedAt?: Date | null;
};

/*
 * =====================================================
 * HELPERS
 * =====================================================
 */

function getDate(
    value: unknown
): Date | null {
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

function formatAmount(
    amount?: number
) {
    if (
        typeof amount !== "number"
    ) {
        return "₱—";
    }

    return `₱${amount.toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;
}

function getClientName(
    client: ClientRecord | null
) {
    if (!client) {
        return "Unknown client";
    }

    if (client.name?.trim()) {
        return client.name;
    }

    const fullName = [
        client.firstName,
        client.middleName,
        client.lastName,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || "Unnamed client";
}

function getInitials(
    name: string
) {
    const parts = name
        .split(" ")
        .filter(Boolean);

    if (
        parts.length === 0
    ) {
        return "?";
    }

    if (
        parts.length === 1
    ) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}

function getStatusConfig(
    status?: string
) {
    const normalized =
        status?.toLowerCase() ?? "";

    if (
        normalized ===
        "approved"
    ) {
        return {
            label: "Approved",
            className:
                "border-green-200 bg-green-50 text-green-700",
            icon: CheckCircle2,
        };
    }

    if (
        normalized ===
        "rejected"
    ) {
        return {
            label: "Rejected",
            className:
                "border-red-200 bg-red-50 text-red-700",
            icon: XCircle,
        };
    }

    return {
        label: "Pending",
        className:
            "border-orange-200 bg-orange-50 text-orange-700",
        icon: Clock,
    };
}

/*
 * =====================================================
 * STATUS BADGE
 * =====================================================
 */

function StatusBadge({
    status,
}: {
    status?: string;
}) {
    const config =
        getStatusConfig(status);

    const Icon =
        config.icon;

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-1.5
                text-sm
                font-semibold
                ${config.className}
            `}
        >
            <Icon className="h-4 w-4" />

            {config.label}
        </span>
    );
}

/*
 * =====================================================
 * INFO ITEM
 * =====================================================
 */

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
                <Icon
                    className="
                        h-4
                        w-4
                        text-slate-500
                    "
                />
            </div>

            <div className="min-w-0">

                <p
                    className="
                        text-xs
                        font-medium
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-1
                        break-words
                        text-sm
                        font-medium
                        text-slate-800
                    "
                >
                    {value}
                </p>

            </div>

        </div>
    );
}

/*
 * =====================================================
 * PAYMENT FIELD
 * =====================================================
 */

function PaymentField({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>

            <p
                className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    break-all
                    text-sm
                    font-medium
                    text-slate-800
                "
            >
                {value}
            </p>

        </div>
    );
}

/*
 * =====================================================
 * MAIN PAGE
 * =====================================================
 */

export default function AdminPaymentDetailPage() {

    const params =
        useParams();

    const paymentId =
        Array.isArray(
            params.paymentId
        )
            ? params.paymentId[0]
            : params.paymentId;

    const [payment, setPayment] =
        useState<PaymentRecord | null>(
            null
        );

    const [client, setClient] =
        useState<ClientRecord | null>(
            null
        );

    const [request, setRequest] =
        useState<RequestRecord | null>(
            null
        );

    const [booking, setBooking] =
        useState<BookingRecord | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState<string | null>(
            null
        );

    const [success, setSuccess] =
        useState<string | null>(
            null
        );

    /*
     * =================================================
     * LOAD PAYMENT
     * =================================================
     */

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
             * -----------------------------------------
             * PAYMENT RECEIPT
             * -----------------------------------------
             */

            const paymentRef =
                doc(
                    db,
                    "PaymentReceipts",
                    paymentId
                );

            const paymentSnapshot =
                await getDoc(
                    paymentRef
                );

            if (
                !paymentSnapshot.exists()
            ) {

                setError(
                    "Payment receipt could not be found."
                );

                return;
            }

            const data =
                paymentSnapshot.data();

            const loadedPayment:
                PaymentRecord = {

                id:
                    paymentSnapshot.id,

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

                receiptId:
                    typeof data.receiptId ===
                    "string"
                        ? data.receiptId
                        : undefined,

                skillId:
                    typeof data.skillId ===
                    "string"
                        ? data.skillId
                        : undefined,

                amount:
                    typeof data.amount ===
                    "number"
                        ? data.amount
                        : undefined,

                referenceNumber:
                    data.referenceNumber !==
                    undefined
                        ? String(
                              data.referenceNumber
                          )
                        : undefined,

                receiptImageUrl:
                    typeof data.receiptImageUrl ===
                    "string"
                        ? data.receiptImageUrl
                        : undefined,

                status:
                    typeof data.status ===
                    "string"
                        ? data.status
                        : undefined,

                remarks:
                    typeof data.remarks ===
                    "string"
                        ? data.remarks
                        : undefined,

                verifiedBy:
                    typeof data.verifiedBy ===
                    "string"
                        ? data.verifiedBy
                        : undefined,

                createdAt:
                    getDate(
                        data.createdAt
                    ),

                verifiedAt:
                    getDate(
                        data.verifiedAt
                    ),
            };

            setPayment(
                loadedPayment
            );

            /*
             * -----------------------------------------
             * CLIENT
             * -----------------------------------------
             */

            if (
                loadedPayment.clientId
            ) {

                const clientRef =
                    doc(
                        db,
                        "Users",
                        loadedPayment.clientId
                    );

                const clientSnapshot =
                    await getDoc(
                        clientRef
                    );

                if (
                    clientSnapshot.exists()
                ) {

                    const clientData =
                        clientSnapshot.data();

                    setClient({
                        id:
                            clientSnapshot.id,

                        name:
                            typeof clientData.name ===
                            "string"
                                ? clientData.name
                                : undefined,

                        firstName:
                            typeof clientData.firstName ===
                            "string"
                                ? clientData.firstName
                                : undefined,

                        middleName:
                            typeof clientData.middleName ===
                            "string"
                                ? clientData.middleName
                                : undefined,

                        lastName:
                            typeof clientData.lastName ===
                            "string"
                                ? clientData.lastName
                                : undefined,

                        email:
                            typeof clientData.email ===
                            "string"
                                ? clientData.email
                                : undefined,

                        phoneNumber:
                            typeof clientData.phoneNumber ===
                            "string"
                                ? clientData.phoneNumber
                                : undefined,

                        profileImageUrl:
                            typeof clientData.profileImageUrl ===
                            "string"
                                ? clientData.profileImageUrl
                                : undefined,
                    });

                } else {

                    setClient(null);

                }
            }

            /*
             * -----------------------------------------
             * POST JOB REQUEST
             * -----------------------------------------
             */

            if (
                loadedPayment.requestId
            ) {

                const postRef =
                    doc(
                        db,
                        "PostJobRequests",
                        loadedPayment.requestId
                    );

                const postSnapshot =
                    await getDoc(
                        postRef
                    );

                if (
                    postSnapshot.exists()
                ) {

                    const postData =
                        postSnapshot.data();

                    setRequest({

                        id:
                            postSnapshot.id,

                        clientId:
                            typeof postData.clientId ===
                            "string"
                                ? postData.clientId
                                : undefined,

                        freelancerId:
                            typeof postData.freelancerId ===
                            "string"
                                ? postData.freelancerId
                                : undefined,

                        freelancerName:
                            typeof postData.freelancerName ===
                            "string"
                                ? postData.freelancerName
                                : undefined,

                        skillId:
                            typeof postData.skillId ===
                            "string"
                                ? postData.skillId
                                : undefined,

                        price:
                            typeof postData.price ===
                            "number"
                                ? postData.price
                                : undefined,

                        status:
                            typeof postData.status ===
                            "string"
                                ? postData.status
                                : undefined,

                        paymentStatus:
                            typeof postData.paymentStatus ===
                            "string"
                                ? postData.paymentStatus
                                : undefined,

                        details:
                            typeof postData.details ===
                            "string"
                                ? postData.details
                                : undefined,

                        address:
                            typeof postData.address ===
                            "string"
                                ? postData.address
                                : undefined,

                        date:
                            typeof postData.date ===
                            "string"
                                ? postData.date
                                : undefined,

                        time:
                            typeof postData.time ===
                            "string"
                                ? postData.time
                                : undefined,

                        createdAt:
                            getDate(
                                postData.createdAt
                            ),

                        updatedAt:
                            getDate(
                                postData.updatedAt
                            ),

                        schedule:
                            getDate(
                                postData.schedule
                            ),

                        completedAt:
                            getDate(
                                postData.completedAt
                            ),
                    });

                } else {

                    setRequest(null);

                }

                /*
                 * -------------------------------------
                 * BOOKING
                 * -------------------------------------
                 */

                const bookingRef =
                    doc(
                        db,
                        "Bookings",
                        loadedPayment.requestId
                    );

                const bookingSnapshot =
                    await getDoc(
                        bookingRef
                    );

                if (
                    bookingSnapshot.exists()
                ) {

                    const bookingData =
                        bookingSnapshot.data();

                    setBooking({

                        id:
                            bookingSnapshot.id,

                        freelancerId:
                            typeof bookingData.freelancerId ===
                            "string"
                                ? bookingData.freelancerId
                                : undefined,

                        freelancerName:
                            typeof bookingData.freelancerName ===
                            "string"
                                ? bookingData.freelancerName
                                : undefined,

                        clientId:
                            typeof bookingData.clientId ===
                            "string"
                                ? bookingData.clientId
                                : undefined,

                        skillId:
                            typeof bookingData.skillId ===
                            "string"
                                ? bookingData.skillId
                                : undefined,

                        price:
                            typeof bookingData.price ===
                            "number"
                                ? bookingData.price
                                : undefined,

                        status:
                            typeof bookingData.status ===
                            "string"
                                ? bookingData.status
                                : undefined,

                        paymentStatus:
                            typeof bookingData.paymentStatus ===
                            "string"
                                ? bookingData.paymentStatus
                                : undefined,

                        details:
                            typeof bookingData.details ===
                            "string"
                                ? bookingData.details
                                : undefined,

                        date:
                            typeof bookingData.date ===
                            "string"
                                ? bookingData.date
                                : undefined,

                        time:
                            typeof bookingData.time ===
                            "string"
                                ? bookingData.time
                                : undefined,

                        createdAt:
                            getDate(
                                bookingData.createdAt
                            ),

                        updatedAt:
                            getDate(
                                bookingData.updatedAt
                            ),

                        completedAt:
                            getDate(
                                bookingData.completedAt
                            ),
                    });

                } else {

                    setBooking(null);

                }

            } else {

                setRequest(null);
                setBooking(null);

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
     * =================================================
     * APPROVE PAYMENT
     * =================================================
     */

    async function approvePayment() {

        if (
            !payment ||
            !payment.requestId
        ) {

            setError(
                "This payment does not have a valid request ID."
            );

            return;
        }

        const auth =
            getAuth();

        const currentUser =
            auth.currentUser;

        if (!currentUser) {

            setError(
                "You must be signed in as an administrator."
            );

            return;
        }

        const confirmed =
            window.confirm(
                "Approve this payment?\n\n" +
                "The payment receipt will be marked approved and both the PostJobRequest and Booking will be marked as payment held."
            );

        if (!confirmed) {
            return;
        }

        try {

            setProcessing(true);
            setError(null);
            setSuccess(null);

            const receiptRef =
                doc(
                    db,
                    "PaymentReceipts",
                    payment.id
                );

            const postRef =
                doc(
                    db,
                    "PostJobRequests",
                    payment.requestId
                );

            const bookingRef =
                doc(
                    db,
                    "Bookings",
                    payment.requestId
                );

            await runTransaction(
                db,
                async (
                    transaction
                ) => {

                    /*
                     * READ EVERYTHING FIRST
                     */

                    const receiptSnapshot =
                        await transaction.get(
                            receiptRef
                        );

                    const postSnapshot =
                        await transaction.get(
                            postRef
                        );

                    const bookingSnapshot =
                        await transaction.get(
                            bookingRef
                        );

                    /*
                     * Validate receipt
                     */

                    if (
                        !receiptSnapshot.exists()
                    ) {

                        throw new Error(
                            "Payment receipt no longer exists."
                        );
                    }

                    const receiptData =
                        receiptSnapshot.data();

                    const currentStatus =
                        String(
                            receiptData.status ??
                            "pending"
                        ).toLowerCase();

                    /*
                     * IMPORTANT:
                     * Prevent double processing.
                     */

                    if (
                        currentStatus !==
                        "pending"
                    ) {

                        throw new Error(
                            `This payment has already been ${currentStatus}.`
                        );
                    }

                    /*
                     * Both related documents must exist.
                     *
                     * This matches your Flutter implementation,
                     * which updates both documents.
                     */

                    if (
                        !postSnapshot.exists()
                    ) {

                        throw new Error(
                            "The related PostJobRequest could not be found."
                        );
                    }

                    if (
                        !bookingSnapshot.exists()
                    ) {

                        throw new Error(
                            "The related Booking could not be found."
                        );
                    }

                    /*
                     * WRITES AFTER ALL READS
                     */

                    transaction.update(
                        receiptRef,
                        {
                            status:
                                "approved",

                            verifiedBy:
                                currentUser.uid,

                            verifiedAt:
                                serverTimestamp(),

                            remarks:
                                "",
                        }
                    );

                    transaction.update(
                        postRef,
                        {
                            paymentStatus:
                                "held",
                        }
                    );

                    transaction.update(
                        bookingRef,
                        {
                            paymentStatus:
                                "held",
                        }
                    );
                }
            );

            setSuccess(
                "Payment approved successfully."
            );

            await loadPayment();

        } catch (err) {

            console.error(
                "Failed to approve payment:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to approve payment."
            );

        } finally {

            setProcessing(false);

        }
    }

    /*
     * =================================================
     * REJECT PAYMENT
     * =================================================
     */

    async function rejectPayment() {

        if (
            !payment ||
            !payment.requestId
        ) {

            setError(
                "This payment does not have a valid request ID."
            );

            return;
        }

        const auth =
            getAuth();

        const currentUser =
            auth.currentUser;

        if (!currentUser) {

            setError(
                "You must be signed in as an administrator."
            );

            return;
        }

        const remarks =
            window.prompt(
                "Enter the reason for rejecting this payment:"
            );

        if (
            remarks === null
        ) {
            return;
        }

        const trimmedRemarks =
            remarks.trim();

        if (
            !trimmedRemarks
        ) {

            setError(
                "A rejection reason is required."
            );

            return;
        }

        try {

            setProcessing(true);
            setError(null);
            setSuccess(null);

            const receiptRef =
                doc(
                    db,
                    "PaymentReceipts",
                    payment.id
                );

            const postRef =
                doc(
                    db,
                    "PostJobRequests",
                    payment.requestId
                );

            const bookingRef =
                doc(
                    db,
                    "Bookings",
                    payment.requestId
                );

            await runTransaction(
                db,
                async (
                    transaction
                ) => {

                    /*
                     * READ EVERYTHING FIRST
                     */

                    const receiptSnapshot =
                        await transaction.get(
                            receiptRef
                        );

                    const postSnapshot =
                        await transaction.get(
                            postRef
                        );

                    const bookingSnapshot =
                        await transaction.get(
                            bookingRef
                        );

                    /*
                     * Validate receipt
                     */

                    if (
                        !receiptSnapshot.exists()
                    ) {

                        throw new Error(
                            "Payment receipt no longer exists."
                        );
                    }

                    const receiptData =
                        receiptSnapshot.data();

                    const currentStatus =
                        String(
                            receiptData.status ??
                            "pending"
                        ).toLowerCase();

                    /*
                     * IMPORTANT:
                     * Prevent double processing.
                     */

                    if (
                        currentStatus !==
                        "pending"
                    ) {

                        throw new Error(
                            `This payment has already been ${currentStatus}.`
                        );
                    }

                    /*
                     * Both related documents must exist.
                     */

                    if (
                        !postSnapshot.exists()
                    ) {

                        throw new Error(
                            "The related PostJobRequest could not be found."
                        );
                    }

                    if (
                        !bookingSnapshot.exists()
                    ) {

                        throw new Error(
                            "The related Booking could not be found."
                        );
                    }

                    /*
                     * WRITES AFTER ALL READS
                     */

                    transaction.update(
                        receiptRef,
                        {
                            status:
                                "rejected",

                            remarks:
                                trimmedRemarks,

                            verifiedBy:
                                currentUser.uid,

                            verifiedAt:
                                serverTimestamp(),
                        }
                    );

                    transaction.update(
                        postRef,
                        {
                            paymentStatus:
                                "rejected",
                        }
                    );

                    transaction.update(
                        bookingRef,
                        {
                            paymentStatus:
                                "rejected",
                        }
                    );
                }
            );

            setSuccess(
                "Payment rejected successfully."
            );

            await loadPayment();

        } catch (err) {

            console.error(
                "Failed to reject payment:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to reject payment."
            );

        } finally {

            setProcessing(false);

        }
    }

    /*
     * =================================================
     * LOADING
     * =================================================
     */

    if (loading) {

        return (
            <main
                className="
                    min-h-screen
                    bg-slate-50
                "
            >

                <div
                    className="
                        border-b
                        border-slate-200
                        bg-white
                    "
                >
                    <div
                        className="
                            mx-auto
                            max-w-7xl
                            px-6
                            py-6
                            lg:px-8
                        "
                    >
                        <div
                            className="
                                h-5
                                w-32
                                animate-pulse
                                rounded
                                bg-slate-200
                            "
                        />
                    </div>
                </div>

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
                            h-8
                            w-64
                            animate-pulse
                            rounded
                            bg-slate-200
                        "
                    />

                    <div
                        className="
                            mt-6
                            grid
                            gap-8
                            lg:grid-cols-3
                        "
                    >

                        <div
                            className="
                                h-[500px]
                                animate-pulse
                                rounded-2xl
                                bg-white
                            "
                        />

                        <div
                            className="
                                h-[500px]
                                animate-pulse
                                rounded-2xl
                                bg-white
                                lg:col-span-2
                            "
                        />

                    </div>

                </div>

            </main>
        );
    }

    /*
     * =================================================
     * ERROR
     * =================================================
     */

    if (
        error &&
        !payment
    ) {

        return (
            <main
                className="
                    min-h-screen
                    bg-slate-50
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-10
                        lg:px-8
                    "
                >

                    <Link
                        href="/admin/payments"
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
                        Back to Payments
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

                        <AlertTriangle
                            className="
                                mx-auto
                                h-10
                                w-10
                                text-red-400
                            "
                        />

                        <h1
                            className="
                                mt-4
                                text-lg
                                font-semibold
                                text-red-800
                            "
                        >
                            Unable to load payment
                        </h1>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-red-600
                            "
                        >
                            {error}
                        </p>

                    </div>

                </div>

            </main>
        );
    }

    if (!payment) {
        return null;
    }

    const paymentStatus =
        payment.status?.toLowerCase() ??
        "pending";

    const isPending =
        paymentStatus ===
        "pending";

    const clientName =
        getClientName(client);

    const statusConfig =
        getStatusConfig(
            payment.status
        );

    /*
     * =================================================
     * PAGE
     * =================================================
     */

    return (
        <main
            className="
                min-h-screen
                bg-slate-50
            "
        >

            {/* =========================================
                HEADER
            ========================================= */}

            <div
                className="
                    border-b
                    border-slate-200
                    bg-white
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-6
                        lg:px-8
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <Link
                            href="/admin/payments"
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
                            Back to Payments
                        </Link>

                        <button
                            type="button"
                            onClick={
                                loadPayment
                            }
                            disabled={
                                loading ||
                                processing
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
                MAIN
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
                    TITLE
                ===================================== */}

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

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

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
                            <Receipt
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
                                Payment Details
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Receipt #{payment.id}
                            </p>

                        </div>

                    </div>

                    <StatusBadge
                        status={
                            payment.status
                        }
                    />

                </div>

                {/* =====================================
                    SUCCESS
                ===================================== */}

                {success && (
                    <div
                        className="
                            mt-6
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-green-200
                            bg-green-50
                            px-5
                            py-4
                            text-sm
                            text-green-700
                        "
                    >

                        <CheckCircle2
                            className="
                                mt-0.5
                                h-5
                                w-5
                                flex-shrink-0
                            "
                        />

                        <p>
                            {success}
                        </p>

                    </div>
                )}

                {/* =====================================
                    ACTION ERROR
                ===================================== */}

                {error && payment && (
                    <div
                        className="
                            mt-6
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-sm
                            text-red-700
                        "
                    >

                        <AlertTriangle
                            className="
                                mt-0.5
                                h-5
                                w-5
                                flex-shrink-0
                            "
                        />

                        <p>
                            {error}
                        </p>

                    </div>
                )}

                {/* =====================================
                    APPROVAL ACTIONS
                ===================================== */}

                {isPending && (
                    <section
                        className="
                            mt-6
                            rounded-2xl
                            border
                            border-orange-200
                            bg-orange-50
                            p-5
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <Clock
                                        className="
                                            h-5
                                            w-5
                                            text-orange-600
                                        "
                                    />

                                    <h2
                                        className="
                                            font-semibold
                                            text-orange-900
                                        "
                                    >
                                        Payment requires verification
                                    </h2>

                                </div>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-orange-700
                                    "
                                >
                                    Review the receipt before approving or rejecting this payment.
                                </p>

                            </div>

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        rejectPayment
                                    }
                                    disabled={
                                        processing
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-red-200
                                        bg-white
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-red-600
                                        shadow-sm
                                        transition
                                        hover:bg-red-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {processing ? (
                                        <Loader2
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                            "
                                        />
                                    ) : (
                                        <XCircle
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />
                                    )}

                                    Reject

                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        approvePayment
                                    }
                                    disabled={
                                        processing
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-green-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition
                                        hover:bg-green-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {processing ? (
                                        <Loader2
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                            "
                                        />
                                    ) : (
                                        <CheckCircle2
                                            className="
                                                h-4
                                                w-4
                                            "
                                        />
                                    )}

                                    Approve Payment

                                </button>

                            </div>

                        </div>

                    </section>
                )}

                {/* =====================================
                    RECEIPT + SUMMARY
                ===================================== */}

                <div
                    className="
                        mt-8
                        grid
                        gap-8
                        lg:grid-cols-3
                    "
                >

                    {/* Receipt */}

                    <section
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                            lg:col-span-2
                        "
                    >

                        <div
                            className="
                                border-b
                                border-slate-200
                                px-6
                                py-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <Receipt
                                    className="
                                        h-5
                                        w-5
                                        text-slate-500
                                    "
                                />

                                <div>

                                    <h2
                                        className="
                                            font-semibold
                                            text-slate-900
                                        "
                                    >
                                        Payment Receipt
                                    </h2>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Submitted payment proof
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="p-6">

                            {payment.receiptImageUrl ? (

                                <a
                                    href={
                                        payment.receiptImageUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        block
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                    "
                                >

                                    <img
                                        src={
                                            payment.receiptImageUrl
                                        }
                                        alt="Payment receipt"
                                        className="
                                            max-h-[700px]
                                            w-full
                                            object-contain
                                            transition
                                            duration-200
                                            group-hover:scale-[1.01]
                                        "
                                    />

                                </a>

                            ) : (

                                <div
                                    className="
                                        flex
                                        h-80
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-slate-50
                                        text-sm
                                        text-slate-400
                                    "
                                >
                                    No receipt image available.
                                </div>

                            )}

                            {payment.receiptImageUrl && (
                                <a
                                    href={
                                        payment.receiptImageUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        mt-4
                                        inline-flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-semibold
                                        text-blue-600
                                        hover:text-blue-700
                                    "
                                >

                                    <ExternalLink className="h-4 w-4" />

                                    Open full receipt

                                </a>
                            )}

                        </div>

                    </section>

                    {/* Payment Summary */}

                    <aside className="space-y-6">

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

                            <h2
                                className="
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                Payment Summary
                            </h2>

                            <div
                                className="
                                    mt-6
                                    space-y-5
                                "
                            >

                                <PaymentField
                                    label="Amount"
                                    value={formatAmount(
                                        payment.amount
                                    )}
                                />

                                <PaymentField
                                    label="Reference Number"
                                    value={
                                        payment.referenceNumber ??
                                        "Not provided"
                                    }
                                />

                                <PaymentField
                                    label="Service"
                                    value={
                                        payment.skillId ??
                                        "Unknown"
                                    }
                                />

                                <PaymentField
                                    label="Created"
                                    value={formatDateTime(
                                        payment.createdAt ??
                                            null
                                    )}
                                />

                            </div>

                        </section>

                    </aside>

                </div>

                {/* =====================================
                    CLIENT
                ===================================== */}

                <section
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

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
                            <User
                                className="
                                    h-5
                                    w-5
                                    text-blue-600
                                "
                            />
                        </div>

                        <div>

                            <h2
                                className="
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                Client
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Customer associated with this payment
                            </p>

                        </div>

                    </div>

                    <div
                        className="
                            mt-6
                            flex
                            flex-col
                            gap-6
                            sm:flex-row
                            sm:items-center
                        "
                    >

                        {/* Profile */}

                        {client?.profileImageUrl ? (

                            <img
                                src={
                                    client.profileImageUrl
                                }
                                alt={
                                    clientName
                                }
                                className="
                                    h-20
                                    w-20
                                    flex-shrink-0
                                    rounded-2xl
                                    object-cover
                                "
                            />

                        ) : (

                            <div
                                className="
                                    flex
                                    h-20
                                    w-20
                                    flex-shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-blue-100
                                    text-xl
                                    font-bold
                                    text-blue-700
                                "
                            >
                                {getInitials(
                                    clientName
                                )}
                            </div>

                        )}

                        <div
                            className="
                                grid
                                flex-1
                                gap-6
                                sm:grid-cols-3
                            "
                        >

                            <InfoItem
                                icon={
                                    User
                                }
                                label="Name"
                                value={
                                    clientName
                                }
                            />

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

                    </div>

                </section>

                {/* =====================================
                    VERIFICATION
                ===================================== */}

                <section
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <ShieldCheck
                            className="
                                h-5
                                w-5
                                text-slate-500
                            "
                        />

                        <h2
                            className="
                                font-semibold
                                text-slate-900
                            "
                        >
                            Verification
                        </h2>

                    </div>

                    <div
                        className="
                            mt-6
                            grid
                            gap-6
                            md:grid-cols-3
                        "
                    >

                        <InfoItem
                            icon={
                                ShieldCheck
                            }
                            label="Status"
                            value={
                                statusConfig.label
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
                                payment.verifiedAt ??
                                    null
                            )}
                        />

                    </div>

                    {paymentStatus ===
                        "rejected" &&
                        payment.remarks && (

                            <div
                                className="
                                    mt-6
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <AlertTriangle
                                        className="
                                            h-4
                                            w-4
                                            text-red-600
                                        "
                                    />

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-red-800
                                        "
                                    >
                                        Rejection Reason
                                    </p>

                                </div>

                                <p
                                    className="
                                        mt-2
                                        whitespace-pre-wrap
                                        text-sm
                                        leading-6
                                        text-red-700
                                    "
                                >
                                    {
                                        payment.remarks
                                    }
                                </p>

                            </div>

                        )}

                </section>

                {/* =====================================
                    RELATED JOB REQUEST
                ===================================== */}

                <section
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

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
                            <BriefcaseBusiness
                                className="
                                    h-5
                                    w-5
                                    text-blue-600
                                "
                            />
                        </div>

                        <div>

                            <h2
                                className="
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                Post Job Request
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Job request associated with this payment
                            </p>

                        </div>

                    </div>

                    {request ? (

                        <div
                            className="
                                mt-6
                                grid
                                gap-6
                                md:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            <InfoItem
                                icon={
                                    BriefcaseBusiness
                                }
                                label="Service"
                                value={
                                    request.skillId ??
                                    payment.skillId ??
                                    "Unknown"
                                }
                            />

                            <InfoItem
                                icon={
                                    User
                                }
                                label="Freelancer"
                                value={
                                    request.freelancerName ??
                                    request.freelancerId ??
                                    "Not assigned"
                                }
                            />

                            <InfoItem
                                icon={
                                    CreditCard
                                }
                                label="Price"
                                value={formatAmount(
                                    request.price
                                )}
                            />

                            <InfoItem
                                icon={
                                    ShieldCheck
                                }
                                label="Payment Status"
                                value={
                                    request.paymentStatus ??
                                    "Unknown"
                                }
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
                                    FileText
                                }
                                label="Request Status"
                                value={
                                    request.status ??
                                    "Unknown"
                                }
                            />

                            <InfoItem
                                icon={
                                    MapPin
                                }
                                label="Address"
                                value={
                                    request.address ??
                                    "Not provided"
                                }
                            />

                        </div>

                    ) : (

                        <div
                            className="
                                mt-6
                                rounded-xl
                                border
                                border-orange-200
                                bg-orange-50
                                p-4
                                text-sm
                                text-orange-700
                            "
                        >
                            The related PostJobRequest could not be loaded.
                        </div>

                    )}

                    {request?.details && (
                        <div
                            className="
                                mt-6
                                rounded-xl
                                bg-slate-50
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Job Details
                            </p>

                            <p
                                className="
                                    mt-2
                                    whitespace-pre-wrap
                                    text-sm
                                    leading-6
                                    text-slate-700
                                "
                            >
                                {
                                    request.details
                                }
                            </p>

                        </div>
                    )}

                </section>

                {/* =====================================
                    BOOKING
                ===================================== */}

                <section
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-green-50
                            "
                        >
                            <BriefcaseBusiness
                                className="
                                    h-5
                                    w-5
                                    text-green-600
                                "
                            />
                        </div>

                        <div>

                            <h2
                                className="
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                Booking
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Booking associated with this payment
                            </p>

                        </div>

                    </div>

                    {booking ? (

                        <div
                            className="
                                mt-6
                                grid
                                gap-6
                                md:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            <InfoItem
                                icon={
                                    BriefcaseBusiness
                                }
                                label="Service"
                                value={
                                    booking.skillId ??
                                    payment.skillId ??
                                    "Unknown"
                                }
                            />

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
                                    CreditCard
                                }
                                label="Price"
                                value={formatAmount(
                                    booking.price
                                )}
                            />

                            <InfoItem
                                icon={
                                    ShieldCheck
                                }
                                label="Payment Status"
                                value={
                                    booking.paymentStatus ??
                                    "Unknown"
                                }
                            />

                            <InfoItem
                                icon={
                                    FileText
                                }
                                label="Booking Status"
                                value={
                                    booking.status ??
                                    "Unknown"
                                }
                            />

                            <InfoItem
                                icon={
                                    CalendarDays
                                }
                                label="Date"
                                value={
                                    booking.date ??
                                    "Not specified"
                                }
                            />

                            <InfoItem
                                icon={
                                    Clock
                                }
                                label="Time"
                                value={
                                    booking.time ??
                                    "Not specified"
                                }
                            />

                            <InfoItem
                                icon={
                                    CalendarDays
                                }
                                label="Created"
                                value={formatDateTime(
                                    booking.createdAt ??
                                        null
                                )}
                            />

                        </div>

                    ) : (

                        <div
                            className="
                                mt-6
                                rounded-xl
                                border
                                border-orange-200
                                bg-orange-50
                                p-4
                                text-sm
                                text-orange-700
                            "
                        >
                            The related Booking could not be loaded.
                        </div>

                    )}

                </section>

                {/* =====================================
                    SYSTEM REFERENCES
                ===================================== */}

                <section
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <h2
                        className="
                            font-semibold
                            text-slate-900
                        "
                    >
                        System References
                    </h2>

                    <div
                        className="
                            mt-5
                            grid
                            gap-5
                            md:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        <PaymentField
                            label="Payment Receipt ID"
                            value={
                                payment.id
                            }
                        />

                        <PaymentField
                            label="Receipt ID"
                            value={
                                payment.receiptId ??
                                payment.id
                            }
                        />

                        <PaymentField
                            label="Request ID"
                            value={
                                payment.requestId ??
                                "Not available"
                            }
                        />

                        <PaymentField
                            label="Client ID"
                            value={
                                payment.clientId ??
                                "Not available"
                            }
                        />

                        <PaymentField
                            label="Verified By"
                            value={
                                payment.verifiedBy ??
                                "Not verified"
                            }
                        />

                    </div>

                </section>

            </div>

        </main>
    );
}