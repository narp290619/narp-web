"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
    ArrowLeft,
    ArrowDownToLine,
    User,
    Wallet,
    Smartphone,
    CalendarDays,
    CheckCircle2,
    Clock3,
    XCircle,
    ShieldCheck,
} from "lucide-react";

import WithdrawalActions from "./WithdrawalActions";

import {
    doc,
    getDoc,
    Timestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "@/lib/firebase";

type WithdrawalData = {
    id: string;
    amount?: number;
    completedAt?: Timestamp | null;
    createdAt?: Timestamp | null;
    gcashNumber?: string;
    processedBy?: string;
    status?: string;
    userId?: string;
};

type UserData = {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    email?: string;
    phoneNumber?: string;
};

function normalizeStatus(
    status?: string
) {
    return String(status ?? "")
        .trim()
        .toLowerCase();
}

function formatAmount(
    amount?: number
) {
    if (
        typeof amount !== "number" ||
        Number.isNaN(amount)
    ) {
        return "₱0.00";
    }

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }
    ).format(amount);
}

function formatDate(
    value?: Timestamp | null
) {
    if (!value) {
        return "—";
    }

    try {
        return value
            .toDate()
            .toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                }
            );
    } catch {
        return "—";
    }
}

function getUserDisplayName(
    user?: UserData
) {
    if (!user) {
        return "Unknown Freelancer";
    }

    if (user.name?.trim()) {
        return user.name;
    }

    const fullName = [
        user.firstName,
        user.lastName,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return (
        fullName ||
        "Unknown Freelancer"
    );
}

function StatusBadge({
    status,
}: {
    status?: string;
}) {
    const normalized =
        normalizeStatus(status);

    if (
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
                    px-4
                    py-2
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
        normalized === "pending"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-amber-50
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-amber-700
                "
            >
                <Clock3 className="h-4 w-4" />
                Pending
            </span>
        );
    }

    if (
        normalized === "approved"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-blue-50
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-blue-700
                "
            >
                <CheckCircle2 className="h-4 w-4" />
                Approved
            </span>
        );
    }

    if (
        normalized === "rejected" ||
        normalized === "cancelled" ||
        normalized === "canceled"
    ) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-red-50
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-red-700
                "
            >
                <XCircle className="h-4 w-4" />
                {normalized ===
                    "rejected"
                    ? "Rejected"
                    : "Cancelled"}
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex
                items-center
                rounded-full
                bg-slate-100
                px-4
                py-2
                text-sm
                font-semibold
                text-slate-600
            "
        >
            {status || "Unknown"}
        </span>
    );
}

export default function
    AdminWithdrawalDetailPage() {

    const params =
        useParams();

    const withdrawalId =
        typeof params.withdrawalId ===
            "string"
            ? params.withdrawalId
            : "";

    const [
        withdrawal,
        setWithdrawal,
    ] = useState<
        WithdrawalData | null
    >(null);

    const [
        user,
        setUser,
    ] = useState<
        UserData | null
    >(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );

    useEffect(() => {

        if (!withdrawalId) {
            return;
        }

        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (currentUser) => {

                    if (!currentUser) {

                        setError(
                            "You must be signed in to view this withdrawal."
                        );

                        setLoading(false);

                        return;
                    }

                    try {

                        setLoading(true);

                        setError(null);

                        /*
                         * =====================================================
                         * LOAD WITHDRAWAL
                         * =====================================================
                         */

                        const withdrawalRef =
                            doc(
                                db,
                                "WithdrawalRequests",
                                withdrawalId
                            );

                        const withdrawalSnapshot =
                            await getDoc(
                                withdrawalRef
                            );

                        if (
                            !withdrawalSnapshot.exists()
                        ) {

                            setError(
                                "Withdrawal request could not be found."
                            );

                            setLoading(false);

                            return;
                        }

                        const withdrawalData =
                            withdrawalSnapshot.data();

                        const withdrawalRecord: WithdrawalData =
                        {
                            id:
                                withdrawalSnapshot.id,

                            amount:
                                typeof withdrawalData.amount ===
                                    "number"
                                    ? withdrawalData.amount
                                    : undefined,

                            completedAt:
                                withdrawalData.completedAt ??
                                null,

                            createdAt:
                                withdrawalData.createdAt ??
                                null,

                            gcashNumber:
                                typeof withdrawalData.gcashNumber ===
                                    "string"
                                    ? withdrawalData.gcashNumber
                                    : undefined,

                            processedBy:
                                typeof withdrawalData.processedBy ===
                                    "string"
                                    ? withdrawalData.processedBy
                                    : undefined,

                            status:
                                typeof withdrawalData.status ===
                                    "string"
                                    ? withdrawalData.status
                                    : undefined,

                            userId:
                                typeof withdrawalData.userId ===
                                    "string"
                                    ? withdrawalData.userId
                                    : undefined,
                        };

                        setWithdrawal(
                            withdrawalRecord
                        );

                        /*
                         * =====================================================
                         * LOAD USER
                         * =====================================================
                         */

                        if (
                            withdrawalRecord.userId
                        ) {

                            const userRef =
                                doc(
                                    db,
                                    "Users",
                                    withdrawalRecord.userId
                                );

                            const userSnapshot =
                                await getDoc(
                                    userRef
                                );

                            if (
                                userSnapshot.exists()
                            ) {

                                const userData =
                                    userSnapshot.data();

                                setUser({
                                    id:
                                        userSnapshot.id,

                                    name:
                                        typeof userData.name ===
                                            "string"
                                            ? userData.name
                                            : undefined,

                                    firstName:
                                        typeof userData.firstName ===
                                            "string"
                                            ? userData.firstName
                                            : undefined,

                                    lastName:
                                        typeof userData.lastName ===
                                            "string"
                                            ? userData.lastName
                                            : undefined,

                                    profileImageUrl:
                                        typeof userData.profileImageUrl ===
                                            "string"
                                            ? userData.profileImageUrl
                                            : undefined,

                                    email:
                                        typeof userData.email ===
                                            "string"
                                            ? userData.email
                                            : undefined,

                                    phoneNumber:
                                        typeof userData.phoneNumber ===
                                            "string"
                                            ? userData.phoneNumber
                                            : undefined,
                                });

                            }

                        }

                    } catch (err) {

                        console.error(
                            "Failed to load withdrawal:",
                            err
                        );

                        setError(
                            "Failed to load withdrawal. Please try again."
                        );

                    } finally {

                        setLoading(
                            false
                        );

                    }

                }
            );

        return () =>
            unsubscribe();

    }, [
        withdrawalId,
    ]);

    /*
     * =====================================================
     * LOADING
     * =====================================================
     */

    if (loading) {
        return (
            <div className="space-y-6">

                <div
                    className="
                        h-5
                        w-40
                        animate-pulse
                        rounded
                        bg-slate-200
                    "
                />

                <div
                    className="
                        h-32
                        animate-pulse
                        rounded-2xl
                        bg-slate-100
                    "
                />

                <div
                    className="
                        h-64
                        animate-pulse
                        rounded-2xl
                        bg-slate-100
                    "
                />

            </div>
        );
    }

    /*
     * =====================================================
     * ERROR
     * =====================================================
     */

    if (
        error ||
        !withdrawal
    ) {
        return (
            <div className="space-y-6">

                <Link
                    href="/admin/withdrawals"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-slate-600
                        hover:text-slate-900
                    "
                >
                    <ArrowLeft className="h-4 w-4" />

                    Back to Withdrawals
                </Link>

                <div
                    className="
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-8
                        text-center
                    "
                >

                    <XCircle className="mx-auto h-10 w-10 text-red-500" />

                    <h1
                        className="
                            mt-4
                            text-xl
                            font-bold
                            text-red-900
                        "
                    >
                        Unable to load withdrawal
                    </h1>

                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-lg
                            text-sm
                            text-red-700
                        "
                    >
                        {error ||
                            "Withdrawal request could not be found."}
                    </p>

                </div>

            </div>
        );
    }

    const status =
        normalizeStatus(
            withdrawal.status
        );

    return (
        <div className="space-y-8">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div>

                <Link
                    href="/admin/withdrawals"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-slate-500
                        hover:text-slate-900
                    "
                >
                    <ArrowLeft className="h-4 w-4" />

                    Back to Withdrawals
                </Link>

                <div
                    className="
                        mt-5
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                    "
                >

                    <div>

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-blue-50
                                "
                            >
                                <ArrowDownToLine className="h-6 w-6 text-blue-600" />
                            </div>

                            <div>

                                <p className="text-sm font-medium text-slate-400">
                                    Withdrawal Request
                                </p>

                                <h1
                                    className="
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                    "
                                >
                                    {formatAmount(
                                        withdrawal.amount
                                    )}
                                </h1>

                            </div>

                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                            Request ID:{" "}
                            <span className="font-mono text-slate-700">
                                {
                                    withdrawal.id
                                }
                            </span>
                        </p>

                    </div>

                    <StatusBadge
                        status={
                            withdrawal.status
                        }
                    />

                </div>

            </div>

            {/* =====================================================
                FREELANCER
            ====================================================== */}

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
                            bg-slate-100
                        "
                    >
                        <User className="h-5 w-5 text-slate-600" />
                    </div>

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            Freelancer
                        </h2>

                        <p className="text-sm text-slate-500">
                            Account associated with this withdrawal.
                        </p>

                    </div>

                </div>

                <div
                    className="
                        mt-6
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                    "
                >

                    {user?.profileImageUrl ? (
                        <img
                            src={
                                user.profileImageUrl
                            }
                            alt={getUserDisplayName(
                                user
                            )}
                            className="
                                h-20
                                w-20
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
                                items-center
                                justify-center
                                rounded-2xl
                                bg-slate-100
                                text-2xl
                                font-bold
                                text-slate-500
                            "
                        >
                            {getUserDisplayName(
                                user ??
                                undefined
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    )}

                    <div>

                        <h3
                            className="
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            {getUserDisplayName(
                                user ??
                                undefined
                            )}
                        </h3>

                        {user?.email && (
                            <p className="mt-1 text-sm text-slate-500">
                                {user.email}
                            </p>
                        )}

                        {user?.phoneNumber && (
                            <p className="mt-1 text-sm text-slate-500">
                                {user.phoneNumber}
                            </p>
                        )}

                        {withdrawal.userId && (
                            <p className="mt-2 text-xs text-slate-400">
                                User ID:{" "}
                                <span className="font-mono">
                                    {
                                        withdrawal.userId
                                    }
                                </span>
                            </p>
                        )}

                    </div>

                </div>

            </section>

            {/* =====================================================
                WITHDRAWAL DETAILS
            ====================================================== */}

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
                            bg-green-50
                        "
                    >
                        <Wallet className="h-5 w-5 text-green-600" />
                    </div>

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            Withdrawal Details
                        </h2>

                        <p className="text-sm text-slate-500">
                            Payment information submitted by the freelancer.
                        </p>

                    </div>

                </div>

                <div
                    className="
                        mt-6
                        grid
                        gap-4
                        sm:grid-cols-2
                    "
                >

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-5
                        "
                    >

                        <div className="flex items-center gap-3">

                            <Wallet className="h-5 w-5 text-slate-500" />

                            <span className="text-sm text-slate-500">
                                Withdrawal Amount
                            </span>

                        </div>

                        <p
                            className="
                                mt-3
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >
                            {formatAmount(
                                withdrawal.amount
                            )}
                        </p>

                    </div>

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-5
                        "
                    >

                        <div className="flex items-center gap-3">

                            <Smartphone className="h-5 w-5 text-slate-500" />

                            <span className="text-sm text-slate-500">
                                GCash Number
                            </span>

                        </div>

                        <p
                            className="
                                mt-3
                                text-lg
                                font-bold
                                text-slate-900
                            "
                        >
                            {withdrawal.gcashNumber ||
                                "—"}
                        </p>

                    </div>

                </div>

            </section>

            {/* =====================================================
                TIMELINE
            ====================================================== */}

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
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            Withdrawal Timeline
                        </h2>

                        <p className="text-sm text-slate-500">
                            Important timestamps for this request.
                        </p>

                    </div>

                </div>

                <div className="mt-6 space-y-5">

                    <div className="flex gap-4">

                        <div
                            className="
                                mt-1
                                h-3
                                w-3
                                flex-shrink-0
                                rounded-full
                                bg-blue-500
                            "
                        />

                        <div>

                            <p className="font-semibold text-slate-900">
                                Withdrawal requested
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                {formatDate(
                                    withdrawal.createdAt
                                )}
                            </p>

                        </div>

                    </div>

                    {withdrawal.completedAt && status === "completed" && (
                        <div className="flex gap-4">

                            <div
                                className="
                                    mt-1
                                    h-3
                                    w-3
                                    flex-shrink-0
                                    rounded-full
                                    bg-green-500
                                "
                            />

                            <div>

                                <p className="font-semibold text-slate-900">
                                    Withdrawal completed
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {formatDate(
                                        withdrawal.completedAt
                                    )}
                                </p>

                            </div>

                        </div>
                    )}

                    {withdrawal.completedAt && status === "rejected" && (
                        <div className="flex gap-4">

                            <div
                                className="
                                    mt-1
                                    h-3
                                    w-3
                                    flex-shrink-0
                                    rounded-full
                                    bg-red-500
                                "
                            />

                            <div>

                                <p className="font-semibold text-slate-900">
                                    Withdrawal rejected
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {formatDate(
                                        withdrawal.completedAt
                                    )}
                                </p>

                            </div>

                        </div>
                    )}

                </div>

            </section>

            {/* =====================================================
                PROCESSING INFORMATION
            ====================================================== */}

            {(withdrawal.processedBy ||
                status ===
                "completed") && (
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
                                bg-slate-100
                            "
                            >
                                <ShieldCheck className="h-5 w-5 text-slate-600" />
                            </div>

                            <div>

                                <h2 className="font-semibold text-slate-900">
                                    Processing Information
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Administrative processing details.
                                </p>

                            </div>

                        </div>

                        <div
                            className="
                            mt-6
                            grid
                            gap-4
                            sm:grid-cols-2
                        "
                        >

                            <div
                                className="
                                rounded-xl
                                bg-slate-50
                                p-4
                            "
                            >

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Processed By
                                </p>

                                <p className="mt-2 break-all text-sm font-medium text-slate-800">
                                    {withdrawal.processedBy ||
                                        "—"}
                                </p>

                            </div>

                            <div
                                className="
                                rounded-xl
                                bg-slate-50
                                p-4
                            "
                            >

                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    {status === "rejected"
                                        ? "Rejected At"
                                        : "Completed At"}
                                </p>

                                <p className="mt-2 text-sm font-medium text-slate-800">
                                    {formatDate(
                                        withdrawal.completedAt
                                    )}
                                </p>

                            </div>

                        </div>

                    </section>
                )}

            {/* =====================================================
                ADMIN ACTIONS
            ===================================================== */}

            {status === "pending" && withdrawal.userId && (
                <WithdrawalActions
                    withdrawalId={withdrawal.id}
                    status={withdrawal.status ?? ""}
                    amount={withdrawal.amount ?? 0}
                    freelancerName={getUserDisplayName(
                        user ?? undefined
                    )}
                />
            )}

        </div>
    );
}

