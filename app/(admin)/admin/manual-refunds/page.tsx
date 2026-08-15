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
    Wallet,
} from "lucide-react";

import {
    getManualRefundRequests,
    markBookingRefunded,
    type AdminRefundRequest,
} from "@/lib/admin/adminRefundService";

export default function AdminManualRefundsPage() {
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

    const [
        referenceModal,
        setReferenceModal,
    ] = useState<AdminRefundRequest | null>(
        null
    );

    const [
        refundReference,
        setRefundReference,
    ] = useState("");

    async function loadRequests() {
        try {
            setLoading(true);
            setError(null);

            const result =
                await getManualRefundRequests();

            setRequests(result);
        } catch (error) {
            console.error(
                "Failed to load manual refunds:",
                error
            );

            setError(
                getErrorMessage(
                    error,
                    "Unable to load manual refunds."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    function openRefundModal(
        request: AdminRefundRequest
    ) {
        setReferenceModal(
            request
        );

        setRefundReference("");
        setError(null);
        setSuccess(null);
    }

    function closeRefundModal() {
        if (
            actionLoading !== null
        ) {
            return;
        }

        setReferenceModal(
            null
        );

        setRefundReference("");
    }

    async function handleMarkRefunded() {
        if (
            !referenceModal
        ) {
            return;
        }

        const reference =
            refundReference.trim();

        if (!reference) {
            setError(
                "Please enter the refund reference."
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Confirm that the client refund for booking ${referenceModal.bookingId} has actually been sent?\n\n` +
                    `Refund reference: ${reference}`
            );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(
                referenceModal.bookingId
            );

            setError(null);
            setSuccess(null);

            const result =
                await markBookingRefunded(
                    referenceModal.bookingId,
                    reference
                );

            if (
                !result.success
            ) {
                throw new Error(
                    result.message ??
                        "Unable to mark booking as refunded."
                );
            }

            setReferenceModal(
                null
            );

            setRefundReference("");

            setSuccess(
                result.alreadyRefunded
                    ? "This booking was already marked as refunded."
                    : `Refund recorded successfully. Reference: ${reference}`
            );

            await loadRequests();
        } catch (error) {
            console.error(
                "Failed to mark booking refunded:",
                error
            );

            setError(
                getErrorMessage(
                    error,
                    "Unable to record the manual refund."
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
                                Manual Refunds
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Complete approved refunds after the actual client payment has been sent.
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
                                className={`h-4 w-4 ${
                                    loading
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

                <div className="grid gap-4 md:grid-cols-2">
                    <SummaryCard
                        icon={
                            <Clock className="h-5 w-5 text-blue-600" />
                        }
                        label="Awaiting Manual Refund"
                        value={
                            requests.length
                        }
                        className="bg-blue-50"
                    />

                    <SummaryCard
                        icon={
                            <Wallet className="h-5 w-5 text-orange-600" />
                        }
                        label="Total Awaiting Refund"
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
                        className="bg-orange-50"
                    />
                </div>

                {/* Important notice */}

                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                    <div className="flex items-start gap-3">
                        <Wallet className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />

                        <div>
                            <p className="text-sm font-bold text-blue-900">
                                Manual refund required
                            </p>

                            <p className="mt-1 text-sm leading-6 text-blue-800">
                                These refunds have already been approved. The client has not been marked as refunded yet. Complete the actual refund through the configured payment method, then enter the refund reference below.
                            </p>
                        </div>
                    </div>
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
                            placeholder="Search booking, client, or freelancer..."
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
                        Approved Refunds
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {loading
                            ? "Loading..."
                            : `${filteredRequests.length} refund${
                                  filteredRequests.length ===
                                  1
                                      ? ""
                                      : "s"
                              } awaiting processing`}
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
                                No refunds awaiting manual processing
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                Approved refunds will appear here until they are manually processed.
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
                                    <ManualRefundCard
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
                                        onProcess={() =>
                                            openRefundModal(
                                                request
                                            )
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
            </section>

            {/* Refund Modal */}

            {referenceModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Record Manual Refund
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Booking{" "}
                                    {
                                        referenceModal.bookingId
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeRefundModal
                                }
                                disabled={
                                    actionLoading !==
                                    null
                                }
                                className="text-sm font-semibold text-slate-400 hover:text-slate-700"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-6 rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Refund amount
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {formatCurrency(
                                    referenceModal.price
                                )}
                            </p>
                        </div>

                        <div className="mt-5">
                            <label className="text-sm font-semibold text-slate-700">
                                Refund Reference
                            </label>

                            <p className="mt-1 text-xs text-slate-400">
                                Enter the reference/transaction ID from the payment method used to refund the client.
                            </p>

                            <input
                                type="text"
                                value={
                                    refundReference
                                }
                                onChange={(
                                    event
                                ) =>
                                    setRefundReference(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. PAYMONGO-REF-123456"
                                className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />

                                <p className="text-sm leading-6 text-orange-800">
                                    Only click confirm after the client has actually received the refund.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={
                                    closeRefundModal
                                }
                                disabled={
                                    actionLoading !==
                                    null
                                }
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleMarkRefunded
                                }
                                disabled={
                                    actionLoading !==
                                        null ||
                                    !refundReference.trim()
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {actionLoading !==
                                null ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                )}

                                Confirm Refund
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

/* ==========================================================================
   CARD
============================================================================= */

function ManualRefundCard({
    request,
    actionLoading,
    onProcess,
}: {
    request: AdminRefundRequest;
    actionLoading: boolean;
    onProcess: () => void;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                Approved
                            </span>

                            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                                Manual Refund
                            </span>
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-slate-900">
                            Booking{" "}
                            {request.bookingId}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Approved on{" "}
                            {formatDate(
                                request.refundApprovedAt
                            )}
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
                        label="Client"
                        value={
                            request.clientId ??
                            "—"
                        }
                    />

                    <InfoItem
                        label="Freelancer"
                        value={
                            request.freelancerId ??
                            "—"
                        }
                    />

                    <InfoItem
                        label="Payment"
                        value={
                            request.paymentStatus ??
                            "—"
                        }
                    />

                    <InfoItem
                        label="Refund"
                        value={
                            request.refundStatus ??
                            "—"
                        }
                    />
                </div>

                {request.escrow && (
                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-slate-500" />

                            <p className="text-sm font-bold text-slate-700">
                                Escrow
                            </p>
                        </div>

                        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-slate-400">
                                    Status
                                </p>

                                <p className="font-semibold text-slate-700">
                                    {String(
                                        request.escrow.status ??
                                            "—"
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Amount
                                </p>

                                <p className="font-semibold text-slate-700">
                                    {formatCurrency(
                                        toNumber(
                                            request.escrow.amount
                                        )
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Net Pay
                                </p>

                                <p className="font-semibold text-slate-700">
                                    {formatCurrency(
                                        toNumber(
                                            request.escrow.netPay
                                        )
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
                    <button
                        type="button"
                        onClick={
                            onProcess
                        }
                        disabled={
                            actionLoading
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {actionLoading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}

                        Record Manual Refund
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
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

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
            className={`mt-5 flex items-center justify-between rounded-xl border px-4 py-3 ${
                error
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

function toNumber(
    value: unknown
): number | null {
    if (
        typeof value === "number" &&
        Number.isFinite(value)
    ) {
        return value;
    }

    return null;
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