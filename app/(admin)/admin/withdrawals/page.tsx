"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowDownToLine,
    Clock3,
    CheckCircle2,
    XCircle,
    RefreshCw,
    ChevronRight,
} from "lucide-react";

import {
    collection,
    getDoc,
    getDocs,
    orderBy,
    query,
    doc,
    Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type WithdrawalRequest = {
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
};

function normalizeStatus(status?: string) {
    return String(status ?? "")
        .trim()
        .toLowerCase();
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
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            });
    } catch {
        return "—";
    }
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

    return fullName || "Unknown Freelancer";
}

function StatusBadge({
    status,
}: {
    status?: string;
}) {
    const normalized =
        normalizeStatus(status);

    if (normalized === "pending") {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-amber-50
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-amber-700
                "
            >
                <Clock3 className="h-3.5 w-3.5" />
                Pending
            </span>
        );
    }

    if (
        normalized === "approved" ||
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
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-green-700
                "
            >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {normalized === "completed"
                    ? "Completed"
                    : "Approved"}
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
                    gap-1.5
                    rounded-full
                    bg-red-50
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-red-700
                "
            >
                <XCircle className="h-3.5 w-3.5" />

                {normalized === "rejected"
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
                px-3
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

export default function AdminWithdrawalsPage() {
    const [
        withdrawals,
        setWithdrawals,
    ] = useState<WithdrawalRequest[]>([]);

    const [
        users,
        setUsers,
    ] = useState<Record<string, UserData>>({});

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const loadWithdrawals =
        async () => {
            try {
                setLoading(true);
                setError("");

                /*
                 * =====================================================
                 * LOAD WITHDRAWAL REQUESTS
                 * =====================================================
                 */

                const withdrawalsRef =
                    collection(
                        db,
                        "WithdrawalRequests"
                    );

                let withdrawalSnapshot;

                try {
                    withdrawalSnapshot =
                        await getDocs(
                            query(
                                withdrawalsRef,
                                orderBy(
                                    "createdAt",
                                    "desc"
                                )
                            )
                        );
                } catch {
                    /*
                     * Fallback in case the createdAt
                     * ordering is unavailable.
                     */
                    withdrawalSnapshot =
                        await getDocs(
                            withdrawalsRef
                        );
                }

                const withdrawalData =
                    withdrawalSnapshot.docs.map(
                        (document) => {
                            const data =
                                document.data();

                            return {
                                id: document.id,

                                amount:
                                    typeof data.amount ===
                                        "number"
                                        ? data.amount
                                        : undefined,

                                completedAt:
                                    data.completedAt ??
                                    null,

                                createdAt:
                                    data.createdAt ??
                                    null,

                                gcashNumber:
                                    typeof data.gcashNumber ===
                                        "string"
                                        ? data.gcashNumber
                                        : undefined,

                                processedBy:
                                    typeof data.processedBy ===
                                        "string"
                                        ? data.processedBy
                                        : undefined,

                                status:
                                    typeof data.status ===
                                        "string"
                                        ? data.status
                                        : undefined,

                                userId:
                                    typeof data.userId ===
                                        "string"
                                        ? data.userId
                                        : undefined,
                            };
                        }
                    );

                setWithdrawals(
                    withdrawalData
                );

                /*
 * =====================================================
 * LOAD USERS
 * =====================================================
 *
 * WithdrawalRequests.userId is the document ID
 * of the corresponding Users document.
 *
 * Example:
 *
 * WithdrawalRequests
 * userId:
 * "8ndeHnInFhVffNuBp7QLtJDoiqM2"
 *
 *        ↓
 *
 * Users/8ndeHnInFhVffNuBp7QLtJDoiqM2
 *
 * So we can retrieve each user directly without
 * downloading the entire Users collection.
 */

                const userIds = Array.from(
                    new Set(
                        withdrawalData
                            .map(
                                (withdrawal) =>
                                    withdrawal.userId
                            )
                            .filter(
                                (
                                    userId
                                ): userId is string =>
                                    Boolean(userId)
                            )
                    )
                );

                const userMap: Record<
                    string,
                    UserData
                > = {};

                await Promise.all(
                    userIds.map(
                        async (userId) => {
                            try {
                                const userRef = doc(
                                    db,
                                    "Users",
                                    userId
                                );

                                const userSnapshot =
                                    await getDoc(userRef);

                                if (!userSnapshot.exists()) {
                                    return;
                                }

                                const data =
                                    userSnapshot.data();

                                userMap[userId] = {
                                    id: userId,

                                    name:
                                        typeof data.name ===
                                            "string"
                                            ? data.name
                                            : undefined,

                                    firstName:
                                        typeof data.firstName ===
                                            "string"
                                            ? data.firstName
                                            : undefined,

                                    lastName:
                                        typeof data.lastName ===
                                            "string"
                                            ? data.lastName
                                            : undefined,

                                    profileImageUrl:
                                        typeof data.profileImageUrl ===
                                            "string"
                                            ? data.profileImageUrl
                                            : undefined,
                                };
                            } catch (error) {
                                console.error(
                                    `Failed to load user ${userId}:`,
                                    error
                                );
                            }
                        }
                    )
                );

                setUsers(userMap);
            } catch (err) {
                console.error(
                    "Failed to load withdrawal requests:",
                    err
                );

                setError(
                    "Failed to load withdrawal requests."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadWithdrawals();
    }, []);

    /*
     * =====================================================
     * PENDING REQUESTS
     * =====================================================
     */

    const pendingWithdrawals =
        useMemo(() => {
            return withdrawals.filter(
                (withdrawal) =>
                    normalizeStatus(
                        withdrawal.status
                    ) === "pending"
            );
        }, [withdrawals]);

    /*
     * =====================================================
     * APPROVED / COMPLETED
     * =====================================================
     */

    const completedWithdrawals =
        useMemo(() => {
            return withdrawals.filter(
                (withdrawal) =>
                    [
                        "approved",
                        "completed",
                    ].includes(
                        normalizeStatus(
                            withdrawal.status
                        )
                    )
            );
        }, [withdrawals]);

    /*
     * =====================================================
     * TOTAL AMOUNT
     * =====================================================
     */

    const completedAmount =
        useMemo(() => {
            return completedWithdrawals.reduce(
                (
                    total,
                    withdrawal
                ) =>
                    total +
                    (typeof withdrawal.amount ===
                        "number"
                        ? withdrawal.amount
                        : 0),
                0
            );
        }, [completedWithdrawals]);

    return (
        <div className="space-y-8">

            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

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

                    <div className="flex items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/admin"
                            className="transition hover:text-slate-700"
                        >
                            Admin
                        </Link>

                        <ChevronRight className="h-4 w-4" />

                        <span className="text-slate-600">
                            Withdrawals
                        </span>

                    </div>

                    <h1
                        className="
                            mt-2
                            text-3xl
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        Withdrawal Requests
                    </h1>

                    <p
                        className="
                            mt-2
                            max-w-2xl
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        Review withdrawal requests
                        submitted by freelancers.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={
                        loadWithdrawals
                    }
                    disabled={loading}
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
                        className={`h-4 w-4 ${loading
                                ? "animate-spin"
                                : ""
                            }`}
                    />

                    Refresh
                </button>

            </div>

            {/* =====================================================
                SUMMARY CARDS
            ====================================================== */}

            <div
                className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                "
            >

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

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-amber-50
                            "
                        >
                            <Clock3 className="h-5 w-5 text-amber-600" />
                        </div>

                        <div>

                            <p className="text-sm text-slate-500">
                                Pending
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {
                                    pendingWithdrawals.length
                                }
                            </p>

                        </div>

                    </div>

                </div>

                {/* Completed */}

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

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-green-50
                            "
                        >
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>

                        <div>

                            <p className="text-sm text-slate-500">
                                Completed
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {
                                    completedWithdrawals.length
                                }
                            </p>

                        </div>

                    </div>

                </div>

                {/* Completed Amount */}

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
                            <ArrowDownToLine className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>

                            <p className="text-sm text-slate-500">
                                Completed Amount
                            </p>

                            <p className="text-2xl font-bold text-slate-900">
                                {formatAmount(
                                    completedAmount
                                )}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
                <div
                    className="
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

            {/* =====================================================
                PENDING WITHDRAWALS
            ====================================================== */}

            <section
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
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
                            <ArrowDownToLine className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Pending Withdrawal Requests
                            </h2>

                            <p className="text-sm text-slate-500">
                                Requests waiting for administrative review.
                            </p>

                        </div>

                    </div>

                </div>

                {loading ? (
                    <div className="px-6 py-16 text-center">

                        <RefreshCw className="mx-auto h-7 w-7 animate-spin text-slate-400" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading withdrawal requests...
                        </p>

                    </div>
                ) : pendingWithdrawals.length ===
                    0 ? (
                    <div className="px-6 py-16 text-center">

                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-slate-100
                            "
                        >
                            <CheckCircle2 className="h-7 w-7 text-slate-400" />
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-900">
                            No pending withdrawals
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            There are currently no
                            withdrawal requests waiting
                            for review.
                        </p>

                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">

                        {pendingWithdrawals.map(
                            (
                                withdrawal
                            ) => {
                                const user =
                                    withdrawal.userId
                                        ? users[
                                        withdrawal.userId
                                        ]
                                        : undefined;

                                return (
                                    <Link
                                        key={
                                            withdrawal.id
                                        }
                                        href={`/admin/withdrawals/${withdrawal.id}`}
                                        className="
                                            block
                                            px-6
                                            py-5
                                            transition
                                            hover:bg-slate-50
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-4
                                                lg:flex-row
                                                lg:items-center
                                                lg:justify-between
                                            "
                                        >

                                            <div className="flex min-w-0 items-center gap-4">

                                                {user?.profileImageUrl ? (
                                                    <img
                                                        src={
                                                            user.profileImageUrl
                                                        }
                                                        alt={getUserDisplayName(
                                                            user
                                                        )}
                                                        className="
                                                            h-11
                                                            w-11
                                                            flex-shrink-0
                                                            rounded-full
                                                            object-cover
                                                        "
                                                    />
                                                ) : (
                                                    <div
                                                        className="
                                                            flex
                                                            h-11
                                                            w-11
                                                            flex-shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            bg-slate-100
                                                            text-sm
                                                            font-bold
                                                            text-slate-500
                                                        "
                                                    >
                                                        {getUserDisplayName(
                                                            user
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="min-w-0">

                                                    <p className="truncate font-semibold text-slate-900">
                                                        {getUserDisplayName(
                                                            user
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        GCash:{" "}
                                                        {
                                                            withdrawal.gcashNumber ??
                                                            "—"
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="flex flex-wrap items-center gap-5">

                                                <div>

                                                    <span className="block text-xs text-slate-400">
                                                        Amount
                                                    </span>

                                                    <span className="font-semibold text-slate-900">
                                                        {formatAmount(
                                                            withdrawal.amount
                                                        )}
                                                    </span>

                                                </div>

                                                <div>

                                                    <span className="block text-xs text-slate-400">
                                                        Submitted
                                                    </span>

                                                    <span className="text-sm font-medium text-slate-700">
                                                        {formatDate(
                                                            withdrawal.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                                <StatusBadge
                                                    status={
                                                        withdrawal.status
                                                    }
                                                />

                                                <ChevronRight className="h-5 w-5 text-slate-300" />

                                            </div>

                                        </div>

                                    </Link>
                                );
                            }
                        )}

                    </div>
                )}

            </section>

        </div>
    );
}

