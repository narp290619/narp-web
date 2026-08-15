"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    ExternalLink,
    RefreshCw,
    Search,
    ShieldAlert,
    User,
    Wallet,
} from "lucide-react";

import {
    approveRefundRequest,
    getPendingRefundRequests,
    type AdminRefundRequest,
} from "@/lib/admin/adminRefundService";
import Link from "next/link";

export default function AdminRefundRequestsPage() {
    const [
        requests,
        setRequests,
    ] = useState<
        AdminRefundRequest[]
    >([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        actionLoading,
        setActionLoading,
    ] = useState<string | null>(
        null
    );

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );

    const [
        success,
        setSuccess,
    ] = useState<string | null>(
        null
    );

    async function loadRequests() {
        try {
            setLoading(true);
            setError(null);

            const result =
                await getPendingRefundRequests();

            setRequests(result);
        } catch (error) {
            console.error(
                "Failed to load refund requests:",
                error
            );

            setError(
                getErrorMessage(
                    error,
                    "Unable to load refund requests."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    async function handleApprove(
        request: AdminRefundRequest
    ) {
        if (
            request.hasActiveDispute
        ) {
            setError(
                "This refund cannot be approved while an active dispute exists."
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Approve the refund request for booking ${request.bookingId}?\n\n` +
                `Amount: ${formatCurrency(
                    request.price
                )}\n\n` +
                `This will authorize the refund and move it to Manual Refunds.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(
                request.bookingId
            );

            setError(null);
            setSuccess(null);

            const result =
                await approveRefundRequest(
                    request.bookingId
                );

            if (
                !result.success
            ) {
                throw new Error(
                    result.message ??
                    "Unable to approve refund."
                );
            }

            setSuccess(
                result.alreadyApproved
                    ? "Refund request was already approved."
                    : "Refund request approved. It is now waiting for manual refund processing."
            );

            await loadRequests();
        } catch (error) {
            console.error(
                "Failed to approve refund:",
                error
            );

            setError(
                getErrorMessage(
                    error,
                    "Unable to approve refund request."
                )
            );
        } finally {
            setActionLoading(null);
        }
    }

    const filteredRequests =
        useMemo(() => {
            const value =
                search
                    .trim()
                    .toLowerCase();

            if (!value) {
                return requests;
            }

            return requests.filter(
                (request) =>
                    request.bookingId
                        .toLowerCase()
                        .includes(value) ||

                    (
                        request.clientId ??
                        ""
                    )
                        .toLowerCase()
                        .includes(value) ||

                    (
                        request.freelancerId ??
                        ""
                    )
                        .toLowerCase()
                        .includes(value) ||

                    (
                        request.cancellationReason ??
                        ""
                    )
                        .toLowerCase()
                        .includes(value)
            );
        }, [
            requests,
            search,
        ]);

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        NARP Administration
                    </p>

                    <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Refund Requests
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Review cancellation refund requests before authorizing manual refund processing.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                loadRequests
                            }
                            disabled={
                                loading
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-8">
                {/* Summary */}

                <div className="grid gap-4 md:grid-cols-3">
                    <SummaryCard
                        icon={
                            <Clock className="h-5 w-5 text-orange-600" />
                        }
                        label="Pending Requests"
                        value={
                            requests.length
                        }
                        className="bg-orange-50"
                    />

                    <SummaryCard
                        icon={
                            <Wallet className="h-5 w-5 text-blue-600" />
                        }
                        label="Total Requested"
                        value={formatCurrency(
                            requests.reduce(
                                (
                                    total,
                                    request
                                ) =>
                                    total +
                                    (
                                        request.price ??
                                        0
                                    ),
                                0
                            )
                        )}
                        className="bg-blue-50"
                    />

                    <SummaryCard
                        icon={
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                        }
                        label="Blocked by Dispute"
                        value={
                            requests.filter(
                                (
                                    request
                                ) =>
                                    request.hasActiveDispute
                            ).length
                        }
                        className="bg-red-50"
                    />
                </div>

                {/* Search */}

                <div className="mt-6">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search booking, client, freelancer, or cancellation reason..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {/* Messages */}

                {error && (
                    <Message
                        type="error"
                        message={
                            error
                        }
                        onClose={() =>
                            setError(
                                null
                            )
                        }
                    />
                )}

                {success && (
                    <Message
                        type="success"
                        message={
                            success
                        }
                        onClose={() =>
                            setSuccess(
                                null
                            )
                        }
                    />
                )}

                {/* Title */}

                <div className="mt-8">
                    <h2 className="text-lg font-bold text-slate-900">
                        Pending Refund Requests
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {loading
                            ? "Loading..."
                            : `${filteredRequests.length} request${filteredRequests.length ===
                                1
                                ? ""
                                : "s"
                            }`}
                    </p>
                </div>

                {/* Loading */}

                {loading && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {Array.from(
                            {
                                length: 5,
                            }
                        ).map(
                            (
                                _,
                                index
                            ) => (
                                <RefundSkeleton
                                    key={
                                        index
                                    }
                                />
                            )
                        )}
                    </div>
                )}

                {/* Empty */}

                {!loading &&
                    filteredRequests.length ===
                    0 && (
                        <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                            <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

                            <h3 className="mt-4 text-base font-bold text-slate-900">
                                No pending refund requests
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                All current refund requests have been processed or there are no new requests.
                            </p>
                        </div>
                    )}

                {/* List */}

                {!loading &&
                    filteredRequests.length >
                    0 && (
                        <div className="mt-5 space-y-4">
                            {filteredRequests.map(
                                (
                                    request
                                ) => (
                                    <RefundRequestCard
                                        key={
                                            request.bookingId
                                        }
                                        request={
                                            request
                                        }
                                        actionLoading={
                                            actionLoading ===
                                            request.bookingId
                                        }
                                        onApprove={() =>
                                            handleApprove(
                                                request
                                            )
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
            </section>
        </main>
    );
}

/* ==========================================================================
   CARD
============================================================================= */

function RefundRequestCard({
    request,
    actionLoading,
    onApprove,
}: {
    request: AdminRefundRequest;
    actionLoading: boolean;
    onApprove: () => void;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                                Refund Requested
                            </span>

                            {request.hasActiveDispute && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                                    <AlertTriangle className="h-3.5 w-3.5" />

                                    Active Dispute
                                </span>
                            )}
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-slate-900">
                            Booking{" "}
                            {request.bookingId}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            {request.cancellationReason ??
                                "No cancellation reason provided."}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-5 py-4 text-right">
                        <p className="text-xs font-medium text-slate-400">
                            Refund Amount
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {formatCurrency(
                                request.price
                            )}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoItem
                        icon={
                            <User className="h-4 w-4" />
                        }
                        label="Client"
                        value={
                            request.clientId ??
                            "—"
                        }
                    />

                    <InfoItem
                        icon={
                            <User className="h-4 w-4" />
                        }
                        label="Freelancer"
                        value={
                            request.freelancerId ??
                            "—"
                        }
                    />

                    <InfoItem
                        icon={
                            <Clock className="h-4 w-4" />
                        }
                        label="Requested"
                        value={formatDate(
                            request.refundRequestedAt
                        )}
                    />

                    <InfoItem
                        icon={
                            <Wallet className="h-4 w-4" />
                        }
                        label="Payment"
                        value={
                            request.paymentStatus ??
                            "—"
                        }
                    />
                </div>

                {request.hasActiveDispute && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />

                                <div>
                                    <p className="text-sm font-bold text-red-800">
                                        Refund approval blocked
                                    </p>

                                    <p className="mt-1 text-sm text-red-700">
                                        This booking has{" "}
                                        {request.activeDisputeCount} active dispute
                                        {request.activeDisputeCount === 1 ? "" : "s"}.
                                        Resolve the dispute before approving the refund.
                                    </p>

                                    {request.activeDisputes.length > 0 && (
                                        <p className="mt-2 text-xs text-red-600">
                                            Latest dispute:{" "}
                                            <span className="font-semibold">
                                                {request.activeDisputes[0].category ??
                                                    "Dispute"}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {request.activeDisputes.length > 0 && (
                                <Link
                                    href={`/admin/disputes/${request.activeDisputes[0].disputeId}`}
                                    className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-100"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    View Dispute
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                    <button
                        type="button"
                        onClick={
                            onApprove
                        }
                        disabled={
                            actionLoading ||
                            request.hasActiveDispute
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {actionLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}

                        {actionLoading
                            ? "Approving..."
                            : "Approve Refund"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ==========================================================================
   COMPONENTS
============================================================================= */

function SummaryCard({
    icon,
    label,
    value,
    className,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    className: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${className}`}
                >
                    {icon}
                </div>

                <div>
                    <p className="text-xs font-medium text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                {icon}

                {label}
            </div>

            <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                {value}
            </p>
        </div>
    );
}

function Message({
    type,
    message,
    onClose,
}: {
    type: "error" | "success";
    message: string;
    onClose: () => void;
}) {
    const error =
        type === "error";

    return (
        <div
            className={`mt-5 flex items-center justify-between rounded-xl border px-4 py-3 ${error
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-green-200 bg-green-50 text-green-800"
                }`}
        >
            <div className="flex items-center gap-3">
                {error ? (
                    <AlertTriangle className="h-5 w-5" />
                ) : (
                    <CheckCircle2 className="h-5 w-5" />
                )}

                <p className="text-sm font-semibold">
                    {message}
                </p>
            </div>

            <button
                type="button"
                onClick={
                    onClose
                }
                className="text-xs font-semibold underline"
            >
                Dismiss
            </button>
        </div>
    );
}

function RefundSkeleton() {
    return (
        <div className="flex gap-5 border-b border-slate-100 px-6 py-6 last:border-b-0">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

            <div className="flex-1">
                <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />

                <div className="mt-3 h-3 w-full max-w-xl animate-pulse rounded bg-slate-100" />

                <div className="mt-4 h-3 w-72 animate-pulse rounded bg-slate-100" />
            </div>
        </div>
    );
}

/* ==========================================================================
   HELPERS
============================================================================= */

function formatCurrency(
    value: number | null
) {
    if (
        value === null ||
        !Number.isFinite(value)
    ) {
        return "₱0.00";
    }

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
        }
    ).format(value);
}

function formatDate(
    date: Date | null
) {
    if (!date) {
        return "—";
    }

    return date.toLocaleString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    );
}

function getErrorMessage(
    error: unknown,
    fallback: string
) {
    if (
        error instanceof Error &&
        error.message
    ) {
        return error.message;
    }

    return fallback;
}