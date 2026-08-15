"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    FileWarning,
    Loader2,
    RefreshCw,
    ShieldCheck,
    User,
    Wallet,
    AlertCircle,
} from "lucide-react";

import {
    getAdminDispute,
    type AdminDispute,
} from "@/lib/admin/adminDisputeService";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
    resolveDispute,
    startDisputeReview,
    type AdminDisputeResolution,
} from "@/lib/admin/adminDisputeActionsService";

/* ==========================================================================
   PAGE
============================================================================= */

export default function AdminDisputeDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const disputeIdParam =
        params?.disputeId;

    const disputeId =
        Array.isArray(disputeIdParam)
            ? disputeIdParam[0]
            : disputeIdParam;

    const [
        dispute,
        setDispute,
    ] = useState<AdminDispute | null>(
        null
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        actionLoading,
        setActionLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );

    const [
        resolution,
        setResolution,
    ] = useState<
        AdminDisputeResolution | ""
    >("");

    const [
        resolutionNote,
        setResolutionNote,
    ] = useState("");

    const [
        refundAmount,
        setRefundAmount,
    ] = useState("");

    const [
        actionSuccess,
        setActionSuccess,
    ] = useState<string | null>(
        null
    );

    const [
        escrow,
        setEscrow,
    ] = useState<AdminEscrow | null>(
        null
    );

    const [
        escrowLoading,
        setEscrowLoading,
    ] = useState(false);

    const [
        escrowError,
        setEscrowError,
    ] = useState<string | null>(
        null
    );

    /* ---------------------------------------------------------------------- */
    /* Load dispute                                                            */
    /* ---------------------------------------------------------------------- */

    async function loadDispute() {
        if (!disputeId) {
            setError(
                "Dispute ID is missing."
            );

            setLoading(false);

            return;
        }

        try {
            setLoading(true);
            setError(null);
            setActionSuccess(null);

            const result =
                await getAdminDispute(
                    disputeId
                );

            if (!result) {
                setDispute(null);

                setError(
                    "Dispute not found."
                );

                return;
            }

            setDispute(result);

            /*
             * Clear resolution form whenever the dispute
             * is no longer under review.
             */
            if (
                result.status !==
                "under_review"
            ) {
                setResolution("");
                setResolutionNote("");
                setRefundAmount("");
            }
        } catch (loadError) {
            console.error(
                "Failed to load dispute:",
                loadError
            );

            setError(
                "Unable to load dispute details."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDispute();
    }, [disputeId]);

    /* ---------------------------------------------------------------------- */
    /* Load escrow                                                             */
    /* ---------------------------------------------------------------------- */

    async function loadEscrow(
        bookingId: string
    ) {
        if (!bookingId) {
            setEscrow(null);
            setEscrowError(
                "Booking ID is missing."
            );

            return;
        }

        try {
            setEscrowLoading(true);
            setEscrowError(null);

            const escrowRef =
                doc(
                    db,
                    "Escrows",
                    bookingId
                );

            const snapshot =
                await getDoc(
                    escrowRef
                );

            if (!snapshot.exists()) {
                setEscrow(null);

                setEscrowError(
                    "No escrow record was found for this booking."
                );

                return;
            }

            const data =
                snapshot.data();

            setEscrow({
                escrowId:
                    typeof data.escrowId ===
                    "string"
                        ? data.escrowId
                        : snapshot.id,

                bookingId:
                    typeof data.bookingId ===
                    "string"
                        ? data.bookingId
                        : bookingId,

                clientId:
                    typeof data.clientId ===
                    "string"
                        ? data.clientId
                        : "",

                freelancerId:
                    typeof data.freelancerId ===
                    "string"
                        ? data.freelancerId
                        : "",

                amount:
                    typeof data.amount ===
                    "number"
                        ? data.amount
                        : 0,

                serviceFee:
                    typeof data.serviceFee ===
                    "number"
                        ? data.serviceFee
                        : 0,

                netPay:
                    typeof data.netPay ===
                    "number"
                        ? data.netPay
                        : 0,

                status:
                    typeof data.status ===
                    "string"
                        ? data.status
                        : "unknown",

                released:
                    data.released === true,

                createdAt:
                    getTimestampDate(
                        data.createdAt
                    ),

                releasedAt:
                    getTimestampDate(
                        data.releasedAt
                    ),
            });
        } catch (loadError) {
            console.error(
                "Failed to load escrow:",
                loadError
            );

            setEscrow(null);

            setEscrowError(
                "Unable to load escrow information."
            );
        } finally {
            setEscrowLoading(false);
        }
    }

    useEffect(() => {
        if (dispute?.bookingId) {
            loadEscrow(
                dispute.bookingId
            );
        }
    }, [dispute?.bookingId]);

    /* ---------------------------------------------------------------------- */
    /* Start review                                                            */
    /* ---------------------------------------------------------------------- */

    async function handleStartReview() {
        if (!dispute) {
            return;
        }

        if (
            dispute.status !==
            "pending"
        ) {
            return;
        }

        try {
            setActionLoading(true);
            setError(null);
            setActionSuccess(null);

            const result =
                await startDisputeReview(
                    dispute.disputeId
                );

            if (!result.success) {
                throw new Error(
                    "Unable to start dispute review."
                );
            }

            const updated =
                await getAdminDispute(
                    dispute.disputeId
                );

            if (updated) {
                setDispute(updated);
            }

            setActionSuccess(
                "Dispute review has been started."
            );
        } catch (actionError) {
            console.error(
                "Failed to start dispute review:",
                actionError
            );

            setError(
                getErrorMessage(
                    actionError,
                    "Unable to start dispute review."
                )
            );
        } finally {
            setActionLoading(false);
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Resolve dispute                                                         */
    /* ---------------------------------------------------------------------- */

    async function handleResolveDispute() {
        if (!dispute) {
            return;
        }

        if (
            dispute.status !==
            "under_review"
        ) {
            return;
        }

        if (!resolution) {
            setError(
                "Please select a resolution."
            );

            return;
        }

        let parsedRefundAmount = 0;

        /* ================================================================
           REFUND CLIENT
        ================================================================= */

        if (
            resolution ===
            "refund_client"
        ) {
            if (!escrow) {
                setError(
                    "Escrow information is unavailable. Please refresh the page and try again."
                );

                return;
            }

            /*
             * Full refund automatically uses
             * the original escrow amount.
             */
            parsedRefundAmount =
                Number(
                    escrow.amount
                );

            if (
                !Number.isFinite(
                    parsedRefundAmount
                ) ||
                parsedRefundAmount <= 0
            ) {
                setError(
                    "A valid refund amount greater than zero is required."
                );

                return;
            }
        }

        /* ================================================================
           PARTIAL REFUND
        ================================================================= */

        if (
            resolution ===
            "partial_refund"
        ) {
            if (!escrow) {
                setError(
                    "Escrow information is unavailable. Please refresh the page and try again."
                );

                return;
            }

            parsedRefundAmount =
                Number(
                    refundAmount.trim()
                );

            if (
                !Number.isFinite(
                    parsedRefundAmount
                ) ||
                parsedRefundAmount <= 0
            ) {
                setError(
                    "A valid refund amount greater than zero is required."
                );

                return;
            }

            /*
             * Match the backend validation.
             *
             * Partial refund must be less than
             * the original escrow amount.
             */
            if (
                parsedRefundAmount >=
                Number(escrow.amount)
            ) {
                setError(
                    `Partial refund must be less than ${formatCurrency(
                        Number(escrow.amount)
                    )}.`
                );

                return;
            }

            /*
             * The partial refund also cannot exceed
             * the freelancer's current escrow net pay.
             */
            if (
                parsedRefundAmount >
                Number(escrow.netPay)
            ) {
                setError(
                    `Partial refund cannot exceed the freelancer escrow amount of ${formatCurrency(
                        Number(escrow.netPay)
                    )}.`
                );

                return;
            }
        }

        /* ================================================================
           PAY FREELANCER / NO ACTION
        ================================================================= */

        if (
            resolution ===
                "pay_freelancer" ||
            resolution ===
                "no_action"
        ) {
            parsedRefundAmount = 0;
        }

        /* ================================================================
           RESOLVE
        ================================================================= */

        try {
            setActionLoading(true);
            setError(null);
            setActionSuccess(null);

            const result =
                await resolveDispute(
                    dispute.disputeId,
                    resolution,
                    resolutionNote,
                    parsedRefundAmount
                );

            if (!result.success) {
                throw new Error(
                    "Unable to resolve dispute."
                );
            }

            /*
             * Reload the actual Firestore document.
             */
            const updated =
                await getAdminDispute(
                    dispute.disputeId
                );

            if (updated) {
                setDispute(updated);

                /*
                 * Reload escrow too because
                 * resolution changes escrow status/balances.
                 */
                await loadEscrow(
                    updated.bookingId
                );
            }

            setResolution("");
            setResolutionNote("");
            setRefundAmount("");

            setActionSuccess(
                "Dispute has been resolved successfully."
            );
        } catch (actionError) {
            console.error(
                "Failed to resolve dispute:",
                actionError
            );

            setError(
                getErrorMessage(
                    actionError,
                    "Unable to resolve dispute."
                )
            );
        } finally {
            setActionLoading(false);
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Loading                                                                 */
    /* ---------------------------------------------------------------------- */

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-24">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-500">
                            Loading dispute...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    /* ---------------------------------------------------------------------- */
    /* Not found                                                               */
    /* ---------------------------------------------------------------------- */

    if (!dispute) {
        return (
            <main className="min-h-screen bg-slate-50">
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-8">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/admin/disputes"
                                )
                            }
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                        >
                            <ArrowLeft className="h-4 w-4" />

                            Back to Disputes
                        </button>

                        <div className="mt-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                                    <FileWarning className="h-5 w-5 text-red-600" />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        Dispute Not Found
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {disputeId ||
                                            "Unknown dispute"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {error && (
                    <section className="mx-auto max-w-7xl px-6 py-8">
                        <ErrorAlert
                            message={error}
                            onRetry={
                                loadDispute
                            }
                        />
                    </section>
                )}
            </main>
        );
    }

    /*
     * IMPORTANT:
     *
     * Reports are stored in:
     *
     * dispute.reports[]
     *
     * We identify them using reportedByRole.
     */
    const clientReport =
        dispute.reports.find(
            (report) =>
                report.reportedByRole
                    .toLowerCase() ===
                "client"
        ) ?? null;

    const freelancerReport =
        dispute.reports.find(
            (report) =>
                report.reportedByRole
                    .toLowerCase() ===
                "freelancer"
        ) ?? null;

    /* ---------------------------------------------------------------------- */
    /* Main page                                                               */
    /* ---------------------------------------------------------------------- */

    return (
        <main className="min-h-screen bg-slate-50">

            {/* =============================================================
                HEADER
            ============================================================= */}

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-8">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/disputes"
                            )
                        }
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />

                        Back to Disputes
                    </button>

                    <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                NARP Administration
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-3">

                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Dispute Details
                                </h1>

                                <StatusBadge
                                    status={
                                        dispute.status
                                    }
                                />

                            </div>

                            <p className="mt-2 font-mono text-sm text-slate-500">
                                {dispute.disputeId}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={
                                loadDispute
                            }
                            disabled={
                                actionLoading
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw className="h-4 w-4" />

                            Refresh
                        </button>

                    </div>
                </div>
            </section>

            {/* =============================================================
                CONTENT
            ============================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-8">

                {/* =========================================================
                    ERROR
                ========================================================== */}

                {error && (
                    <div className="mb-6">
                        <ErrorAlert
                            message={error}
                            onRetry={
                                loadDispute
                            }
                        />
                    </div>
                )}

                {/* =========================================================
                    SUCCESS
                ========================================================== */}

                {actionSuccess && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />

                        <p className="text-sm font-semibold text-green-800">
                            {actionSuccess}
                        </p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* =====================================================
                        LEFT / MAIN CONTENT
                    ====================================================== */}

                    <div className="space-y-6 lg:col-span-2">

                        {/* =================================================
                            DISPUTE INFORMATION
                        ================================================== */}

                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-6 py-5">

                                <h2 className="font-bold text-slate-900">
                                    Dispute Information
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Information associated with this dispute.
                                </p>

                            </div>

                            <div className="px-6 py-6">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Category
                                    </p>

                                    <p className="mt-2 text-lg font-bold text-slate-900">
                                        {dispute.category ||
                                            "Not specified"}
                                    </p>
                                </div>

                                <div className="mt-7">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Description
                                    </p>

                                    <div className="mt-3 rounded-xl bg-slate-50 px-5 py-4">

                                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                            {dispute.description ||
                                                "No description provided."}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* =================================================
                            CLIENT REPORT
                        ================================================== */}

                        <ReportSection
                            title="Client Report"
                            role="client"
                            report={
                                clientReport
                            }
                        />

                        {/* =================================================
                            FREELANCER REPORT
                        ================================================== */}

                        <ReportSection
                            title="Freelancer Report"
                            role="freelancer"
                            report={
                                freelancerReport
                            }
                        />

                        {/* =================================================
                            ESCROW SUMMARY
                        ================================================== */}

                        <EscrowSummary
                            escrow={escrow}
                            loading={
                                escrowLoading
                            }
                            error={
                                escrowError
                            }
                            onRetry={() =>
                                loadEscrow(
                                    dispute.bookingId
                                )
                            }
                        />

                        {/* =================================================
                            PEOPLE
                        ================================================== */}

                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-6 py-5">

                                <h2 className="font-bold text-slate-900">
                                    People Involved
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Users associated with this dispute.
                                </p>

                            </div>

                            <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">

                                <PersonCard
                                    label="Reported By"
                                    value={
                                        dispute.reportedBy
                                    }
                                    secondary={
                                        dispute.reportedByRole
                                    }
                                />

                                <PersonCard
                                    label="Client"
                                    value={
                                        dispute.clientId
                                    }
                                />

                                <PersonCard
                                    label="Freelancer"
                                    value={
                                        dispute.freelancerId
                                    }
                                />

                                <PersonCard
                                    label="Booking"
                                    value={
                                        dispute.bookingId
                                    }
                                />

                            </div>

                        </section>

                        {/* =================================================
                            RESOLUTION DETAILS
                        ================================================== */}

                        {dispute.status ===
                            "resolved" && (
                            <section className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">

                                <div className="border-b border-green-100 bg-green-50 px-6 py-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        </div>

                                        <div>

                                            <h2 className="font-bold text-green-900">
                                                Resolution
                                            </h2>

                                            <p className="mt-1 text-sm text-green-700">
                                                This dispute has been resolved.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="space-y-6 px-6 py-6">

                                    <InfoField
                                        label="Resolution"
                                        value={formatResolution(
                                            dispute.resolution
                                        )}
                                    />

                                    <InfoField
                                        label="Resolution Note"
                                        value={
                                            dispute.resolutionNote ||
                                            "No resolution note provided."
                                        }
                                    />

                                    <InfoField
                                        label="Refund Amount"
                                        value={
                                            dispute.refundAmount !==
                                            null
                                                ? formatCurrency(
                                                      dispute.refundAmount
                                                  )
                                                : "No refund"
                                        }
                                    />

                                    <InfoField
                                        label="Reviewed By"
                                        value={
                                            dispute.reviewedBy ||
                                            "Unavailable"
                                        }
                                    />

                                    <InfoField
                                        label="Reviewed At"
                                        value={formatDate(
                                            dispute.reviewedAt
                                        )}
                                    />

                                </div>

                            </section>
                        )}

                    </div>

                    {/* =====================================================
                        RIGHT / ADMIN ACTIONS
                    ====================================================== */}

                    <div className="space-y-6">

                        {/* =================================================
                            STATUS
                        ================================================== */}

                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-6 py-5">

                                <h2 className="font-bold text-slate-900">
                                    Dispute Status
                                </h2>

                            </div>

                            <div className="px-6 py-6">

                                <StatusBadge
                                    status={
                                        dispute.status
                                    }
                                />

                                <div className="mt-5 space-y-4">

                                    <InfoField
                                        label="Created"
                                        value={formatDate(
                                            dispute.createdAt
                                        )}
                                    />

                                    <InfoField
                                        label="Last Updated"
                                        value={formatDate(
                                            dispute.updatedAt
                                        )}
                                    />

                                    {dispute.reviewedBy && (
                                        <InfoField
                                            label="Reviewed By"
                                            value={
                                                dispute.reviewedBy
                                            }
                                        />
                                    )}

                                    {dispute.reviewedAt && (
                                        <InfoField
                                            label="Reviewed At"
                                            value={formatDate(
                                                dispute.reviewedAt
                                            )}
                                        />
                                    )}

                                </div>

                            </div>

                        </section>

                        {/* =================================================
                            START REVIEW
                        ================================================== */}

                        {dispute.status ===
                            "pending" && (
                            <section className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">

                                <div className="border-b border-blue-100 bg-blue-50 px-6 py-5">

                                    <div className="flex items-start gap-3">

                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
                                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                                        </div>

                                        <div>

                                            <h2 className="font-bold text-blue-900">
                                                Start Review
                                            </h2>

                                            <p className="mt-1 text-sm leading-6 text-blue-700">
                                                Begin reviewing this dispute before making a resolution.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="px-6 py-6">

                                    <button
                                        type="button"
                                        onClick={
                                            handleStartReview
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {actionLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />

                                                Starting Review...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="h-4 w-4" />

                                                Start Dispute Review
                                            </>
                                        )}
                                    </button>

                                </div>

                            </section>
                        )}

                        {/* =================================================
                            RESOLVE
                        ================================================== */}

                        {dispute.status ===
                            "under_review" && (
                            <section className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">

                                <div className="border-b border-orange-100 bg-orange-50 px-6 py-5">

                                    <div className="flex items-start gap-3">

                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100">
                                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                                        </div>

                                        <div>

                                            <h2 className="font-bold text-orange-900">
                                                Resolve Dispute
                                            </h2>

                                            <p className="mt-1 text-sm leading-6 text-orange-700">
                                                Select the appropriate resolution and provide an administrative note.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="space-y-5 px-6 py-6">

                                    {/* Resolution */}

                                    <div>

                                        <label
                                            htmlFor="resolution"
                                            className="text-sm font-semibold text-slate-900"
                                        >
                                            Resolution
                                        </label>

                                        <select
                                            id="resolution"
                                            value={
                                                resolution
                                            }
                                            onChange={(
                                                event
                                            ) => {
                                                const value =
                                                    event
                                                        .target
                                                        .value as
                                                        | AdminDisputeResolution
                                                        | "";

                                                setResolution(
                                                    value
                                                );

                                                if (
                                                    value !==
                                                    "partial_refund"
                                                ) {
                                                    setRefundAmount(
                                                        ""
                                                    );
                                                }
                                            }}
                                            disabled={
                                                actionLoading
                                            }
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        >

                                            <option value="">
                                                Select a resolution
                                            </option>

                                            <option value="refund_client">
                                                Refund Client
                                            </option>

                                            <option value="pay_freelancer">
                                                Pay Freelancer
                                            </option>

                                            <option value="partial_refund">
                                                Partial Refund
                                            </option>

                                            <option value="no_action">
                                                No Action
                                            </option>

                                        </select>

                                    </div>

                                    {/* Refund Amount */}

                                    {(
                                        resolution ===
                                            "refund_client" ||
                                        resolution ===
                                            "partial_refund"
                                    ) && (
                                        <div>

                                            <label
                                                htmlFor="refundAmount"
                                                className="text-sm font-semibold text-slate-900"
                                            >
                                                Refund Amount
                                            </label>

                                            <div className="relative mt-2">

                                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                                                    ₱
                                                </span>

                                                <input
                                                    id="refundAmount"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        resolution ===
                                                        "refund_client"
                                                            ? escrow
                                                                ? escrow.amount
                                                                : ""
                                                            : refundAmount
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setRefundAmount(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ||
                                                        resolution ===
                                                            "refund_client"
                                                    }
                                                    placeholder="0.00"
                                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                                                />

                                            </div>

                                            {escrow && (
                                                <div className="mt-2 space-y-1">

                                                    <p className="text-xs text-slate-400">
                                                        Full refund reference:{" "}
                                                        <span className="font-semibold text-slate-600">
                                                            {formatCurrency(
                                                                escrow.amount
                                                            )}
                                                        </span>
                                                    </p>

                                                    {resolution ===
                                                        "partial_refund" && (
                                                        <p className="text-xs text-slate-400">
                                                            Maximum partial refund:{" "}
                                                            <span className="font-semibold text-slate-600">
                                                                {formatCurrency(
                                                                    Math.min(
                                                                        escrow.amount,
                                                                        escrow.netPay
                                                                    )
                                                                )}
                                                            </span>
                                                        </p>
                                                    )}

                                                </div>
                                            )}

                                        </div>
                                    )}

                                    {/* Resolution Note */}

                                    <div>

                                        <label
                                            htmlFor="resolutionNote"
                                            className="text-sm font-semibold text-slate-900"
                                        >
                                            Resolution Note
                                        </label>

                                        <textarea
                                            id="resolutionNote"
                                            value={
                                                resolutionNote
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setResolutionNote(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                            rows={6}
                                            placeholder="Explain why this resolution was selected..."
                                            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                        />

                                        <p className="mt-2 text-xs text-slate-400">
                                            This note will be stored with the dispute resolution.
                                        </p>

                                    </div>

                                    {/* Resolve button */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleResolveDispute
                                        }
                                        disabled={
                                            actionLoading ||
                                            !resolution
                                        }
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {actionLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />

                                                Resolving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4" />

                                                Resolve Dispute
                                            </>
                                        )}
                                    </button>

                                </div>

                            </section>
                        )}

                        {/* =================================================
                            RESOLVED MESSAGE
                        ================================================== */}

                        {dispute.status ===
                            "resolved" && (
                            <section className="rounded-2xl border border-green-200 bg-green-50 px-6 py-6">

                                <div className="flex items-start gap-3">

                                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />

                                    <div>

                                        <h2 className="font-bold text-green-900">
                                            Dispute Resolved
                                        </h2>

                                        <p className="mt-1 text-sm leading-6 text-green-700">
                                            No further administrative action is available for this dispute.
                                        </p>

                                    </div>

                                </div>

                            </section>
                        )}

                    </div>
                </div>
            </section>
        </main>
    );
}

/* ==========================================================================
   REPORT SECTION
============================================================================= */

function ReportSection({
    title,
    role,
    report,
}: {
    title: string;
    role: "client" | "freelancer";
    report: AdminDispute["reports"][number] | null;
}) {
    const isClient =
        role === "client";

    const iconBackground =
        isClient
            ? "bg-blue-50"
            : "bg-purple-50";

    const iconColor =
        isClient
            ? "text-blue-600"
            : "text-purple-600";

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-slate-200 px-6 py-5">

                <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconBackground}`}
                        >
                            <User
                                className={`h-5 w-5 ${iconColor}`}
                            />
                        </div>

                        <div>

                            <h2 className="font-bold text-slate-900">
                                {title}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {isClient
                                    ? "Report submitted by the client."
                                    : "Report submitted by the freelancer."}
                            </p>

                        </div>

                    </div>

                    {report && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Submitted
                        </span>
                    )}

                </div>

            </div>

            {/* No report */}

            {!report ? (
                <div className="px-6 py-10 text-center">

                    <FileWarning className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                        No report submitted by this party.
                    </p>

                </div>
            ) : (
                <div className="space-y-6 px-6 py-6">

                    {/* Reporter */}

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Reported By
                        </p>

                        <p className="mt-2 break-all font-mono text-sm font-medium text-slate-700">
                            {report.reportedBy ||
                                "Unavailable"}
                        </p>

                    </div>

                    {/* Category */}

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Category
                        </p>

                        <p className="mt-2 text-base font-bold text-slate-900">
                            {formatStatus(
                                report.category
                            )}
                        </p>

                    </div>

                    {/* Description */}

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Description
                        </p>

                        <div className="mt-3 rounded-xl bg-slate-50 px-5 py-4">

                            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                {report.description ||
                                    "No description provided."}
                            </p>

                        </div>

                    </div>

                    {/* Evidence */}

                    <div>

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Evidence
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Files submitted with this report.
                                </p>

                            </div>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {report.evidence.length}{" "}
                                file
                                {report.evidence.length ===
                                1
                                    ? ""
                                    : "s"}
                            </span>

                        </div>

                        <div className="mt-4">

                            {report.evidence.length ===
                            0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 px-5 py-8 text-center">

                                    <FileWarning className="mx-auto h-7 w-7 text-slate-300" />

                                    <p className="mt-3 text-sm text-slate-500">
                                        No evidence submitted.
                                    </p>

                                </div>
                            ) : (
                                <div className="space-y-3">

                                    {report.evidence.map(
                                        (
                                            evidence,
                                            index
                                        ) => (
                                            <EvidenceRow
                                                key={`${evidence.fileName || evidence.name || "evidence"}-${index}`}
                                                evidence={
                                                    evidence
                                                }
                                                index={
                                                    index
                                                }
                                            />
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                    {/* Submitted */}

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Submitted
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                            {formatDate(
                                report.createdAt
                            )}
                        </p>

                    </div>

                </div>
            )}

        </section>
    );
}

/* ==========================================================================
   ESCROW TYPES
============================================================================= */

type AdminEscrow = {
    escrowId: string;
    bookingId: string;
    clientId: string;
    freelancerId: string;
    amount: number;
    serviceFee: number;
    netPay: number;
    status: string;
    released: boolean;
    createdAt: Date | null;
    releasedAt: Date | null;
};

/* ==========================================================================
   ESCROW SUMMARY
============================================================================= */

function EscrowSummary({
    escrow,
    loading,
    error,
    onRetry,
}: {
    escrow: AdminEscrow | null;
    loading: boolean;
    error: string | null;
    onRetry: () => void;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <h2 className="font-bold text-slate-900">
                            Escrow Summary
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Payment currently associated with this disputed booking.
                        </p>

                    </div>

                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <Wallet className="h-5 w-5 text-blue-600" />
                    </div>

                </div>

            </div>

            <div className="px-6 py-6">

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2">

                        {Array.from({
                            length: 4,
                        }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl bg-slate-50 p-4"
                                >
                                    <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />

                                    <div className="mt-3 h-7 w-28 animate-pulse rounded bg-slate-200" />
                                </div>
                            )
                        )}

                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-4">

                        <div className="flex items-start gap-3">

                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />

                            <div className="min-w-0 flex-1">

                                <p className="text-sm font-semibold text-orange-900">
                                    Escrow information unavailable
                                </p>

                                <p className="mt-1 text-sm leading-6 text-orange-700">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        onRetry
                                    }
                                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-orange-700 shadow-sm transition hover:bg-orange-100"
                                >
                                    <RefreshCw className="h-4 w-4" />

                                    Retry
                                </button>

                            </div>

                        </div>

                    </div>
                ) : escrow ? (
                    <div className="space-y-5">

                        <div className="grid gap-4 sm:grid-cols-2">

                            <EscrowAmountCard
                                label="Total Paid"
                                amount={
                                    escrow.amount
                                }
                                emphasis
                            />

                            <EscrowAmountCard
                                label="Freelancer Net Pay"
                                amount={
                                    escrow.netPay
                                }
                            />

                            <EscrowAmountCard
                                label="Service Fee"
                                amount={
                                    escrow.serviceFee
                                }
                            />

                            <EscrowAmountCard
                                label="Currently Held"
                                amount={
                                    escrow.status ===
                                    "held"
                                        ? escrow.netPay
                                        : 0
                                }
                            />

                        </div>

                        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">

                            <div className="flex items-start gap-3">

                                <Wallet className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />

                                <div>

                                    <p className="text-sm font-bold text-blue-900">
                                        Refund reference
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-blue-800">
                                        The client originally paid{" "}
                                        <strong>
                                            {formatCurrency(
                                                escrow.amount
                                            )}
                                        </strong>
                                        . The freelancer's escrow share is{" "}
                                        <strong>
                                            {formatCurrency(
                                                escrow.netPay
                                            )}
                                        </strong>
                                        , with{" "}
                                        <strong>
                                            {formatCurrency(
                                                escrow.serviceFee
                                            )}
                                        </strong>{" "}
                                        recorded as the service fee.
                                    </p>

                                    <p className="mt-2 text-xs font-semibold text-blue-700">
                                        Full client refund reference:{" "}
                                        {formatCurrency(
                                            escrow.amount
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">

                            <InfoField
                                label="Escrow ID"
                                value={
                                    escrow.escrowId
                                }
                            />

                            <InfoField
                                label="Escrow Status"
                                value={formatStatus(
                                    escrow.status
                                )}
                            />

                            <InfoField
                                label="Created At"
                                value={formatDate(
                                    escrow.createdAt
                                )}
                            />

                            <InfoField
                                label="Released At"
                                value={formatDate(
                                    escrow.releasedAt
                                )}
                            />

                        </div>

                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">

                        <Wallet className="mx-auto h-8 w-8 text-slate-300" />

                        <p className="mt-3 text-sm font-medium text-slate-500">
                            No escrow record found.
                        </p>

                    </div>
                )}

            </div>

        </section>
    );
}

/* ==========================================================================
   ESCROW AMOUNT CARD
============================================================================= */

function EscrowAmountCard({
    label,
    amount,
    emphasis = false,
}: {
    label: string;
    amount: number;
    emphasis?: boolean;
}) {
    return (
        <div
            className={`rounded-xl border px-4 py-4 ${
                emphasis
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
            }`}
        >

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p
                className={`mt-2 text-2xl font-bold ${
                    emphasis
                        ? "text-blue-700"
                        : "text-slate-900"
                }`}
            >
                {formatCurrency(
                    amount
                )}
            </p>

        </div>
    );
}

/* ==========================================================================
   STATUS BADGE
============================================================================= */

function StatusBadge({
    status,
}: {
    status: string;
}) {
    const config =
        getStatusConfig(
            status
        );

    const Icon =
        config.icon;

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ${config.className}
            `}
        >
            <Icon className="h-3.5 w-3.5" />

            {config.label}
        </span>
    );
}

function getStatusConfig(
    status: string
) {
    switch (status) {
        case "pending":
            return {
                label: "Pending",
                icon: Clock,
                className:
                    "bg-orange-50 text-orange-700",
            };

        case "under_review":
            return {
                label: "Under Review",
                icon: AlertTriangle,
                className:
                    "bg-blue-50 text-blue-700",
            };

        case "resolved":
            return {
                label: "Resolved",
                icon: CheckCircle2,
                className:
                    "bg-green-50 text-green-700",
            };

        default:
            return {
                label: formatStatus(
                    status
                ),
                icon: FileWarning,
                className:
                    "bg-slate-100 text-slate-600",
            };
    }
}

/* ==========================================================================
   PERSON CARD
============================================================================= */

function PersonCard({
    label,
    value,
    secondary,
}: {
    label: string;
    value: string;
    secondary?: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">

            <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    <User className="h-4 w-4 text-slate-500" />
                </div>

                <div className="min-w-0">

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 break-all font-mono text-xs font-medium text-slate-700">
                        {value || "—"}
                    </p>

                    {secondary && (
                        <p className="mt-1 text-xs text-slate-400">
                            {secondary}
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

/* ==========================================================================
   EVIDENCE ROW
============================================================================= */

function EvidenceRow({
    evidence,
    index,
}: {
    evidence: AdminDispute["reports"][number]["evidence"][number];
    index: number;
}) {
    const fileName =
        evidence.originalName ||
        evidence.fileName ||
        evidence.name ||
        `Evidence ${index + 1}`;

    const url =
        evidence.downloadUrl ||
        evidence.url;

    const contentType =
        evidence.contentType ||
        evidence.type ||
        "";

    const isImage =
        contentType.startsWith(
            "image/"
        );

    const isVideo =
        contentType.startsWith(
            "video/"
        );

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">

            {/* Preview */}

            {isImage && url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                >
                    <img
                        src={url}
                        alt={fileName}
                        className="h-full w-full object-cover"
                    />
                </a>
            ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">

                    {isVideo ? (
                        <span className="text-lg">
                            🎥
                        </span>
                    ) : (
                        <FileWarning className="h-5 w-5 text-slate-500" />
                    )}

                </div>
            )}

            {/* Information */}

            <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-slate-900">
                    {fileName}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                    {contentType ||
                        "Evidence file"}
                </p>

                {typeof evidence.size ===
                    "number" && (
                    <p className="mt-1 text-xs text-slate-400">
                        {formatFileSize(
                            evidence.size
                        )}
                    </p>
                )}

            </div>

            {/* Actions */}

            {url && (
                <div className="flex flex-wrap gap-2">

                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />

                        Open
                    </a>

                    <a
                        href={url}
                        download
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                        <Download className="h-3.5 w-3.5" />

                        Download
                    </a>

                </div>
            )}

        </div>
    );
}

/* ==========================================================================
   INFO FIELD
============================================================================= */

function InfoField({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-medium text-slate-700">
                {value}
            </p>

        </div>
    );
}

/* ==========================================================================
   ERROR ALERT
============================================================================= */

function ErrorAlert({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />

                <div>

                    <p className="text-sm font-semibold text-red-800">
                        Something went wrong
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                        {message}
                    </p>

                </div>

            </div>

            <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-100"
            >
                <RefreshCw className="h-4 w-4" />

                Retry
            </button>

        </div>
    );
}

/* ==========================================================================
   HELPERS
============================================================================= */

function getTimestampDate(
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

function formatCurrency(
    amount: number
) {
    return `₱${amount.toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;
}

function formatFileSize(
    bytes: number
) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    }

    if (
        bytes <
        1024 * 1024 * 1024
    ) {
        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    }

    return `${(
        bytes /
        (1024 *
            1024 *
            1024)
    ).toFixed(1)} GB`;
}

function formatStatus(
    status: string
) {
    return status
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}

function formatResolution(
    resolution: string | null
) {
    if (!resolution) {
        return "Not specified";
    }

    switch (resolution) {
        case "refund_client":
            return "Refund Client";

        case "pay_freelancer":
            return "Pay Freelancer";

        case "partial_refund":
            return "Partial Refund";

        case "no_action":
            return "No Action";

        default:
            return formatStatus(
                resolution
            );
    }
}

function formatDate(
    date: Date | null
) {
    if (!date) {
        return "Date unavailable";
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
        error &&
        typeof error === "object"
    ) {
        const firebaseError =
            error as {
                code?: string;
                message?: string;
            };

        if (
            typeof firebaseError.message ===
                "string" &&
            firebaseError.message.trim()
        ) {
            return firebaseError.message;
        }
    }

    if (
        error instanceof Error &&
        error.message
    ) {
        return error.message;
    }

    return fallback;
}