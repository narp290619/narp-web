// "use client";

// import {
//     useEffect,
//     useMemo,
//     useState,
// } from "react";

// import {
//     AlertTriangle,
//     CheckCircle2,
//     Clock,
//     ExternalLink,
//     RefreshCw,
//     Search,
//     ShieldAlert,
//     User,
//     Wallet,
// } from "lucide-react";

// import {
//     approveRefundRequest,
//     getPendingRefundRequests,
//     type AdminRefundRequest,
// } from "@/lib/admin/adminRefundService";
// import Link from "next/link";

// export default function AdminRefundRequestsPage() {
//     const [
//         requests,
//         setRequests,
//     ] = useState<
//         AdminRefundRequest[]
//     >([]);

//     const [
//         loading,
//         setLoading,
//     ] = useState(true);

//     const [
//         actionLoading,
//         setActionLoading,
//     ] = useState<string | null>(
//         null
//     );

//     const [
//         search,
//         setSearch,
//     ] = useState("");

//     const [
//         error,
//         setError,
//     ] = useState<string | null>(
//         null
//     );

//     const [
//         success,
//         setSuccess,
//     ] = useState<string | null>(
//         null
//     );

//     async function loadRequests() {
//         try {
//             setLoading(true);
//             setError(null);

//             const result =
//                 await getPendingRefundRequests();

//             setRequests(result);
//         } catch (error) {
//             console.error(
//                 "Failed to load refund requests:",
//                 error
//             );

//             setError(
//                 getErrorMessage(
//                     error,
//                     "Unable to load refund requests."
//                 )
//             );
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         loadRequests();
//     }, []);

//     async function handleApprove(
//         request: AdminRefundRequest
//     ) {
//         if (
//             request.hasActiveDispute
//         ) {
//             setError(
//                 "This refund cannot be approved while an active dispute exists."
//             );

//             return;
//         }

//         const confirmed =
//             window.confirm(
//                 `Approve the refund request for booking ${request.bookingId}?\n\n` +
//                 `Amount: ${formatCurrency(
//                     request.price
//                 )}\n\n` +
//                 `This will authorize the refund and move it to Manual Refunds.`
//             );

//         if (!confirmed) {
//             return;
//         }

//         try {
//             setActionLoading(
//                 request.bookingId
//             );

//             setError(null);
//             setSuccess(null);

//             const result =
//                 await approveRefundRequest(
//                     request.bookingId
//                 );

//             if (
//                 !result.success
//             ) {
//                 throw new Error(
//                     result.message ??
//                     "Unable to approve refund."
//                 );
//             }

//             setSuccess(
//                 result.alreadyApproved
//                     ? "Refund request was already approved."
//                     : "Refund request approved. It is now waiting for manual refund processing."
//             );

//             await loadRequests();
//         } catch (error) {
//             console.error(
//                 "Failed to approve refund:",
//                 error
//             );

//             setError(
//                 getErrorMessage(
//                     error,
//                     "Unable to approve refund request."
//                 )
//             );
//         } finally {
//             setActionLoading(null);
//         }
//     }

//     const filteredRequests =
//         useMemo(() => {
//             const value =
//                 search
//                     .trim()
//                     .toLowerCase();

//             if (!value) {
//                 return requests;
//             }

//             return requests.filter(
//                 (request) =>
//                     request.bookingId
//                         .toLowerCase()
//                         .includes(value) ||

//                     (
//                         request.clientId ??
//                         ""
//                     )
//                         .toLowerCase()
//                         .includes(value) ||

//                     (
//                         request.freelancerId ??
//                         ""
//                     )
//                         .toLowerCase()
//                         .includes(value) ||

//                     (
//                         request.cancellationReason ??
//                         ""
//                     )
//                         .toLowerCase()
//                         .includes(value)
//             );
//         }, [
//             requests,
//             search,
//         ]);

//     return (
//         <main className="min-h-screen bg-slate-50">
//             {/* Header */}

//             <section className="border-b border-slate-200 bg-white">
//                 <div className="mx-auto max-w-7xl px-6 py-8">
//                     <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
//                         NARP Administration
//                     </p>

//                     <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//                         <div>
//                             <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//                                 Refund Requests
//                             </h1>

//                             <p className="mt-2 text-slate-500">
//                                 Review cancellation refund requests before authorizing manual refund processing.
//                             </p>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={
//                                 loadRequests
//                             }
//                             disabled={
//                                 loading
//                             }
//                             className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                             <RefreshCw
//                                 className={`h-4 w-4 ${loading
//                                         ? "animate-spin"
//                                         : ""
//                                     }`}
//                             />

//                             Refresh
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             <section className="mx-auto max-w-7xl px-6 py-8">
//                 {/* Summary */}

//                 <div className="grid gap-4 md:grid-cols-3">
//                     <SummaryCard
//                         icon={
//                             <Clock className="h-5 w-5 text-orange-600" />
//                         }
//                         label="Pending Requests"
//                         value={
//                             requests.length
//                         }
//                         className="bg-orange-50"
//                     />

//                     <SummaryCard
//                         icon={
//                             <Wallet className="h-5 w-5 text-blue-600" />
//                         }
//                         label="Total Requested"
//                         value={formatCurrency(
//                             requests.reduce(
//                                 (
//                                     total,
//                                     request
//                                 ) =>
//                                     total +
//                                     (
//                                         request.price ??
//                                         0
//                                     ),
//                                 0
//                             )
//                         )}
//                         className="bg-blue-50"
//                     />

//                     <SummaryCard
//                         icon={
//                             <ShieldAlert className="h-5 w-5 text-red-600" />
//                         }
//                         label="Blocked by Dispute"
//                         value={
//                             requests.filter(
//                                 (
//                                     request
//                                 ) =>
//                                     request.hasActiveDispute
//                             ).length
//                         }
//                         className="bg-red-50"
//                     />
//                 </div>

//                 {/* Search */}

//                 <div className="mt-6">
//                     <div className="relative">
//                         <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(
//                                 event
//                             ) =>
//                                 setSearch(
//                                     event.target.value
//                                 )
//                             }
//                             placeholder="Search booking, client, freelancer, or cancellation reason..."
//                             className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                         />
//                     </div>
//                 </div>

//                 {/* Messages */}

//                 {error && (
//                     <Message
//                         type="error"
//                         message={
//                             error
//                         }
//                         onClose={() =>
//                             setError(
//                                 null
//                             )
//                         }
//                     />
//                 )}

//                 {success && (
//                     <Message
//                         type="success"
//                         message={
//                             success
//                         }
//                         onClose={() =>
//                             setSuccess(
//                                 null
//                             )
//                         }
//                     />
//                 )}

//                 {/* Title */}

//                 <div className="mt-8">
//                     <h2 className="text-lg font-bold text-slate-900">
//                         Pending Refund Requests
//                     </h2>

//                     <p className="mt-1 text-sm text-slate-500">
//                         {loading
//                             ? "Loading..."
//                             : `${filteredRequests.length} request${filteredRequests.length ===
//                                 1
//                                 ? ""
//                                 : "s"
//                             }`}
//                     </p>
//                 </div>

//                 {/* Loading */}

//                 {loading && (
//                     <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//                         {Array.from(
//                             {
//                                 length: 5,
//                             }
//                         ).map(
//                             (
//                                 _,
//                                 index
//                             ) => (
//                                 <RefundSkeleton
//                                     key={
//                                         index
//                                     }
//                                 />
//                             )
//                         )}
//                     </div>
//                 )}

//                 {/* Empty */}

//                 {!loading &&
//                     filteredRequests.length ===
//                     0 && (
//                         <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
//                             <CheckCircle2 className="mx-auto h-10 w-10 text-green-300" />

//                             <h3 className="mt-4 text-base font-bold text-slate-900">
//                                 No pending refund requests
//                             </h3>

//                             <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
//                                 All current refund requests have been processed or there are no new requests.
//                             </p>
//                         </div>
//                     )}

//                 {/* List */}

//                 {!loading &&
//                     filteredRequests.length >
//                     0 && (
//                         <div className="mt-5 space-y-4">
//                             {filteredRequests.map(
//                                 (
//                                     request
//                                 ) => (
//                                     <RefundRequestCard
//                                         key={
//                                             request.bookingId
//                                         }
//                                         request={
//                                             request
//                                         }
//                                         actionLoading={
//                                             actionLoading ===
//                                             request.bookingId
//                                         }
//                                         onApprove={() =>
//                                             handleApprove(
//                                                 request
//                                             )
//                                         }
//                                     />
//                                 )
//                             )}
//                         </div>
//                     )}
//             </section>
//         </main>
//     );
// }

// /* ==========================================================================
//    CARD
// ============================================================================= */

// function RefundRequestCard({
//     request,
//     actionLoading,
//     onApprove,
// }: {
//     request: AdminRefundRequest;
//     actionLoading: boolean;
//     onApprove: () => void;
// }) {
//     return (
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//             <div className="p-6">
//                 <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
//                     <div className="min-w-0 flex-1">
//                         <div className="flex flex-wrap items-center gap-2">
//                             <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
//                                 Refund Requested
//                             </span>

//                             {request.hasActiveDispute && (
//                                 <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
//                                     <AlertTriangle className="h-3.5 w-3.5" />

//                                     Active Dispute
//                                 </span>
//                             )}
//                         </div>

//                         <h3 className="mt-3 text-lg font-bold text-slate-900">
//                             Booking{" "}
//                             {request.bookingId}
//                         </h3>

//                         <p className="mt-1 text-sm text-slate-500">
//                             {request.cancellationReason ??
//                                 "No cancellation reason provided."}
//                         </p>
//                     </div>

//                     <div className="rounded-xl bg-slate-50 px-5 py-4 text-right">
//                         <p className="text-xs font-medium text-slate-400">
//                             Refund Amount
//                         </p>

//                         <p className="mt-1 text-2xl font-bold text-slate-900">
//                             {formatCurrency(
//                                 request.price
//                             )}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
//                     <InfoItem
//                         icon={
//                             <User className="h-4 w-4" />
//                         }
//                         label="Client"
//                         value={
//                             request.clientId ??
//                             "—"
//                         }
//                     />

//                     <InfoItem
//                         icon={
//                             <User className="h-4 w-4" />
//                         }
//                         label="Freelancer"
//                         value={
//                             request.freelancerId ??
//                             "—"
//                         }
//                     />

//                     <InfoItem
//                         icon={
//                             <Clock className="h-4 w-4" />
//                         }
//                         label="Requested"
//                         value={formatDate(
//                             request.refundRequestedAt
//                         )}
//                     />

//                     <InfoItem
//                         icon={
//                             <Wallet className="h-4 w-4" />
//                         }
//                         label="Payment"
//                         value={
//                             request.paymentStatus ??
//                             "—"
//                         }
//                     />
//                 </div>

//                 {request.hasActiveDispute && (
//                     <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
//                         <div className="flex items-start justify-between gap-4">
//                             <div className="flex items-start gap-3">
//                                 <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />

//                                 <div>
//                                     <p className="text-sm font-bold text-red-800">
//                                         Refund approval blocked
//                                     </p>

//                                     <p className="mt-1 text-sm text-red-700">
//                                         This booking has{" "}
//                                         {request.activeDisputeCount} active dispute
//                                         {request.activeDisputeCount === 1 ? "" : "s"}.
//                                         Resolve the dispute before approving the refund.
//                                     </p>

//                                     {request.activeDisputes.length > 0 && (
//                                         <p className="mt-2 text-xs text-red-600">
//                                             Latest dispute:{" "}
//                                             <span className="font-semibold">
//                                                 {request.activeDisputes[0].category ??
//                                                     "Dispute"}
//                                             </span>
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>

//                             {request.activeDisputes.length > 0 && (
//                                 <Link
//                                     href={`/admin/disputes/${request.activeDisputes[0].disputeId}`}
//                                     className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-100"
//                                 >
//                                     <ExternalLink className="h-4 w-4" />
//                                     View Dispute
//                                 </Link>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
//                     <button
//                         type="button"
//                         onClick={
//                             onApprove
//                         }
//                         disabled={
//                             actionLoading ||
//                             request.hasActiveDispute
//                         }
//                         className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//                     >
//                         {actionLoading ? (
//                             <RefreshCw className="h-4 w-4 animate-spin" />
//                         ) : (
//                             <CheckCircle2 className="h-4 w-4" />
//                         )}

//                         {actionLoading
//                             ? "Approving..."
//                             : "Approve Refund"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// /* ==========================================================================
//    COMPONENTS
// ============================================================================= */

// function SummaryCard({
//     icon,
//     label,
//     value,
//     className,
// }: {
//     icon: React.ReactNode;
//     label: string;
//     value: string | number;
//     className: string;
// }) {
//     return (
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="flex items-center gap-4">
//                 <div
//                     className={`flex h-11 w-11 items-center justify-center rounded-xl ${className}`}
//                 >
//                     {icon}
//                 </div>

//                 <div>
//                     <p className="text-xs font-medium text-slate-400">
//                         {label}
//                     </p>

//                     <p className="mt-1 text-xl font-bold text-slate-900">
//                         {value}
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function InfoItem({
//     icon,
//     label,
//     value,
// }: {
//     icon: React.ReactNode;
//     label: string;
//     value: string;
// }) {
//     return (
//         <div>
//             <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
//                 {icon}

//                 {label}
//             </div>

//             <p className="mt-1 truncate text-sm font-semibold text-slate-700">
//                 {value}
//             </p>
//         </div>
//     );
// }

// function Message({
//     type,
//     message,
//     onClose,
// }: {
//     type: "error" | "success";
//     message: string;
//     onClose: () => void;
// }) {
//     const error =
//         type === "error";

//     return (
//         <div
//             className={`mt-5 flex items-center justify-between rounded-xl border px-4 py-3 ${error
//                     ? "border-red-200 bg-red-50 text-red-800"
//                     : "border-green-200 bg-green-50 text-green-800"
//                 }`}
//         >
//             <div className="flex items-center gap-3">
//                 {error ? (
//                     <AlertTriangle className="h-5 w-5" />
//                 ) : (
//                     <CheckCircle2 className="h-5 w-5" />
//                 )}

//                 <p className="text-sm font-semibold">
//                     {message}
//                 </p>
//             </div>

//             <button
//                 type="button"
//                 onClick={
//                     onClose
//                 }
//                 className="text-xs font-semibold underline"
//             >
//                 Dismiss
//             </button>
//         </div>
//     );
// }

// function RefundSkeleton() {
//     return (
//         <div className="flex gap-5 border-b border-slate-100 px-6 py-6 last:border-b-0">
//             <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

//             <div className="flex-1">
//                 <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />

//                 <div className="mt-3 h-3 w-full max-w-xl animate-pulse rounded bg-slate-100" />

//                 <div className="mt-4 h-3 w-72 animate-pulse rounded bg-slate-100" />
//             </div>
//         </div>
//     );
// }

// /* ==========================================================================
//    HELPERS
// ============================================================================= */

// function formatCurrency(
//     value: number | null
// ) {
//     if (
//         value === null ||
//         !Number.isFinite(value)
//     ) {
//         return "₱0.00";
//     }

//     return new Intl.NumberFormat(
//         "en-PH",
//         {
//             style: "currency",
//             currency: "PHP",
//         }
//     ).format(value);
// }

// function formatDate(
//     date: Date | null
// ) {
//     if (!date) {
//         return "—";
//     }

//     return date.toLocaleString(
//         "en-PH",
//         {
//             month: "short",
//             day: "numeric",
//             year: "numeric",
//             hour: "numeric",
//             minute: "2-digit",
//         }
//     );
// }

// function getErrorMessage(
//     error: unknown,
//     fallback: string
// ) {
//     if (
//         error instanceof Error &&
//         error.message
//     ) {
//         return error.message;
//     }

//     return fallback;
// }


"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import Link from "next/link";

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Eye,
    FileWarning,
    Loader2,
    RefreshCw,
    Search,
    ShieldAlert,
    Wallet,
    XCircle,
} from "lucide-react";

import {
    approveRefundRequest,
    getPendingRefundRequests,
    type AdminRefundRequest,
} from "@/lib/admin/adminRefundService";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatCurrency(
    amount: number | null | undefined
): string {
    if (
        typeof amount !== "number" ||
        !Number.isFinite(amount)
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

function toDate(
    value: unknown
): Date | null {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    if (
        typeof value === "object" &&
        value !== null
    ) {
        const candidate =
            value as {
                toDate?: () => Date;
                seconds?: number;
                _seconds?: number;
                nanoseconds?: number;
                _nanoseconds?: number;
            };

        if (
            typeof candidate.toDate ===
            "function"
        ) {
            try {
                return candidate.toDate();
            } catch {
                return null;
            }
        }

        const seconds =
            typeof candidate.seconds === "number"
                ? candidate.seconds
                : typeof candidate._seconds ===
                    "number"
                    ? candidate._seconds
                    : null;

        const nanoseconds =
            typeof candidate.nanoseconds ===
                "number"
                ? candidate.nanoseconds
                : typeof candidate._nanoseconds ===
                    "number"
                    ? candidate._nanoseconds
                    : 0;

        if (
            seconds !== null &&
            Number.isFinite(seconds)
        ) {
            return new Date(
                seconds * 1000 +
                Math.floor(
                    nanoseconds / 1000000
                )
            );
        }
    }

    return null;
}

function formatDate(
    value: unknown
): string {
    const date = toDate(value);

    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-PH",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    ).format(date);
}

function getShortId(
    value: string | null | undefined
): string {
    if (!value) {
        return "—";
    }

    if (value.length <= 18) {
        return value;
    }

    return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function RefundRequestsPage() {

    /* ---------------------------------------------------------------------- */
    /* State                                                                  */
    /* ---------------------------------------------------------------------- */

    const [
        refundRequests,
        setRefundRequests,
    ] = useState<AdminRefundRequest[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        selectedRequest,
        setSelectedRequest,
    ] = useState<AdminRefundRequest | null>(
        null
    );

    const [
        approvingBookingId,
        setApprovingBookingId,
    ] = useState<string | null>(
        null
    );

    /* ---------------------------------------------------------------------- */
    /* Load requests                                                          */
    /* ---------------------------------------------------------------------- */

    const loadRefundRequests =
        useCallback(
            async (
                isRefresh = false
            ) => {

                try {

                    if (isRefresh) {
                        setRefreshing(true);
                    } else {
                        setLoading(true);
                    }

                    setError(null);

                    const result =
                        await getPendingRefundRequests();

                    setRefundRequests(
                        result
                    );

                } catch (err) {

                    console.error(
                        "Failed to load refund requests:",
                        err
                    );

                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load refund requests."
                    );

                } finally {

                    setLoading(false);
                    setRefreshing(false);
                }
            },
            []
        );

    /* ---------------------------------------------------------------------- */
    /* Initial load                                                           */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        void loadRefundRequests();
    }, [loadRefundRequests]);

    /* ---------------------------------------------------------------------- */
    /* Filtered requests                                                      */
    /* ---------------------------------------------------------------------- */

    const filteredRequests =
        useMemo(() => {

            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            if (!normalizedSearch) {
                return refundRequests;
            }

            return refundRequests.filter(
                (request) => {

                    const values = [
                        request.bookingId,
                        request.clientId,
                        request.freelancerId,
                        request.cancellationReason,
                    ];

                    return values.some(
                        (value) =>
                            String(
                                value ?? ""
                            )
                                .toLowerCase()
                                .includes(
                                    normalizedSearch
                                )
                    );
                }
            );

        }, [
            refundRequests,
            search,
        ]);

    /* ---------------------------------------------------------------------- */
    /* Statistics                                                             */
    /* ---------------------------------------------------------------------- */

    const totalPending =
        refundRequests.length;

    const totalRefundAmount =
        refundRequests.reduce(
            (
                total,
                request
            ) =>
                total +
                (
                    typeof request.refundAmount ===
                    "number"
                        ? request.refundAmount
                        : 0
                ),
            0
        );

    const requestsWithDisputes =
        refundRequests.filter(
            (request) =>
                request.hasActiveDispute
        ).length;

    const requestsReadyForApproval =
        refundRequests.filter(
            (request) =>
                !request.hasActiveDispute
        ).length;

    /* ---------------------------------------------------------------------- */
    /* Approve refund                                                         */
    /* ---------------------------------------------------------------------- */

    const handleApproveRefund =
        async (
            request: AdminRefundRequest
        ) => {

            if (
                request.hasActiveDispute
            ) {
                window.alert(
                    "This refund cannot be approved while an active dispute exists."
                );

                return;
            }

            const refundAmount =
                request.price ?? 0;

            const confirmed =
                window.confirm(
                    [
                        "Approve this refund?",
                        "",
                        `Booking: ${request.bookingId}`,
                        `Refund amount: ${formatCurrency(refundAmount)}`,
                        "",
                        "The refund will be credited directly to the client's available wallet balance.",
                        "",
                        "The freelancer's escrow-held amount will be reversed.",
                        "",
                        "This action cannot be undone.",
                    ].join("\n")
                );

            if (!confirmed) {
                return;
            }

            try {

                setApprovingBookingId(
                    request.bookingId
                );

                setError(null);

                const result =
                    await approveRefundRequest(
                        request.bookingId
                    );

                if (
                    !result.success
                ) {
                    throw new Error(
                        result.message ??
                        "Refund approval failed."
                    );
                }

                /*
                 * Remove the completed request
                 * immediately from the pending list.
                 */
                setRefundRequests(
                    (current) =>
                        current.filter(
                            (item) =>
                                item.bookingId !==
                                request.bookingId
                        )
                );

                setSelectedRequest(
                    null
                );

                window.alert(
                    result.message ??
                    "Refund successfully credited to the client's wallet."
                );

            } catch (err) {

                console.error(
                    "Failed to approve refund:",
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to approve refund."
                );

            } finally {

                setApprovingBookingId(
                    null
                );
            }
        };

    /* ---------------------------------------------------------------------- */
    /* Loading                                                                */
    /* ---------------------------------------------------------------------- */

    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="flex flex-col items-center gap-3">

                    <Loader2
                        className="h-8 w-8 animate-spin text-orange-500"
                    />

                    <p className="text-sm text-slate-500">
                        Loading refund requests...
                    </p>

                </div>

            </div>
        );
    }

    /* ---------------------------------------------------------------------- */
    /* Render                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* ========================================================== */}
                {/* HEADER                                                       */}
                {/* ========================================================== */}

                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <div className="mb-2 flex items-center gap-2">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">

                                <Wallet className="h-5 w-5 text-orange-600" />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Refund Requests
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Review cancelled bookings and approve client wallet refunds.
                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            void loadRefundRequests(true)
                        }
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <RefreshCw
                            className={`h-4 w-4 ${
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Refresh

                    </button>

                </div>

                {/* ========================================================== */}
                {/* ERROR                                                        */}
                {/* ========================================================== */}

                {error && (

                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                        <div className="flex-1">

                            <p className="font-semibold text-red-800">
                                Unable to complete the request
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setError(null)
                            }
                            className="text-red-500 hover:text-red-700"
                        >
                            <XCircle className="h-5 w-5" />
                        </button>

                    </div>

                )}

                {/* ========================================================== */}
                {/* STAT CARDS                                                   */}
                {/* ========================================================== */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Pending Requests"
                        value={String(
                            totalPending
                        )}
                        icon={
                            <Clock3 className="h-5 w-5 text-amber-600" />
                        }
                        iconBackground="bg-amber-100"
                    />

                    <StatCard
                        title="Pending Refund Value"
                        value={formatCurrency(
                            totalRefundAmount
                        )}
                        icon={
                            <Wallet className="h-5 w-5 text-blue-600" />
                        }
                        iconBackground="bg-blue-100"
                    />

                    <StatCard
                        title="Ready for Approval"
                        value={String(
                            requestsReadyForApproval
                        )}
                        icon={
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        }
                        iconBackground="bg-emerald-100"
                    />

                    <StatCard
                        title="Blocked by Dispute"
                        value={String(
                            requestsWithDisputes
                        )}
                        icon={
                            <ShieldAlert className="h-5 w-5 text-red-600" />
                        }
                        iconBackground="bg-red-100"
                    />

                </div>

                {/* ========================================================== */}
                {/* SEARCH                                                        */}
                {/* ========================================================== */}

                <div className="mb-4 flex flex-col gap-3 sm:flex-row">

                    <div className="relative flex-1">

                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search booking, client, freelancer..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />

                    </div>

                    <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">

                        Showing{" "}

                        <span className="mx-1 font-semibold text-slate-900">
                            {filteredRequests.length}
                        </span>

                        request
                        {filteredRequests.length === 1
                            ? ""
                            : "s"}

                    </div>

                </div>

                {/* ========================================================== */}
                {/* ACTIVE DISPUTE NOTICE                                       */}
                {/* ========================================================== */}

                {requestsWithDisputes > 0 && (

                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

                        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <div>

                            <p className="font-semibold text-amber-900">
                                Some refunds require dispute resolution
                            </p>

                            <p className="mt-1 text-sm text-amber-800">
                                Refund requests with an active dispute cannot be approved until the dispute is resolved.
                            </p>

                        </div>

                    </div>

                )}

                {/* ========================================================== */}
                {/* EMPTY STATE                                                  */}
                {/* ========================================================== */}

                {filteredRequests.length === 0 ? (

                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">

                            <CheckCircle2 className="h-7 w-7 text-emerald-600" />

                        </div>

                        <h2 className="text-lg font-semibold text-slate-900">
                            No pending refund requests
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            There are currently no refund requests waiting for admin approval.
                        </p>

                    </div>

                ) : (

                    /* ====================================================== */
                    /* TABLE                                                   */
                    /* ====================================================== */

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1100px]">

                                <thead className="border-b border-slate-200 bg-slate-50">

                                    <tr>

                                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Booking
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Client
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Freelancer
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Refund
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Requested
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {filteredRequests.map(
                                        (
                                            request
                                        ) => {

                                            const isApproving =
                                                approvingBookingId ===
                                                request.bookingId;

                                            return (

                                                <tr
                                                    key={
                                                        request.bookingId
                                                    }
                                                    className="transition hover:bg-slate-50/70"
                                                >

                                                    {/* BOOKING */}

                                                    <td className="px-5 py-4">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedRequest(
                                                                    request
                                                                )
                                                            }
                                                            className="text-left"
                                                        >

                                                            <p className="font-semibold text-slate-900 hover:text-orange-600">
                                                                {getShortId(
                                                                    request.bookingId
                                                                )}
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-400">
                                                                Cancelled
                                                            </p>

                                                        </button>

                                                    </td>

                                                    {/* CLIENT */}

                                                    <td className="px-5 py-4">

                                                        <p className="font-medium text-slate-800">
                                                            {getShortId(
                                                                request.clientId
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Client
                                                        </p>

                                                    </td>

                                                    {/* FREELANCER */}

                                                    <td className="px-5 py-4">

                                                        <p className="font-medium text-slate-800">
                                                            {getShortId(
                                                                request.freelancerId
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Freelancer
                                                        </p>

                                                    </td>

                                                    {/* REFUND */}

                                                    <td className="px-5 py-4">

                                                        <p className="font-bold text-slate-900">
                                                            {formatCurrency(
                                                                request.refundAmount
                                                            )}
                                                        </p>

                                                        <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">

                                                            <Wallet className="h-3.5 w-3.5" />

                                                            Client wallet

                                                        </div>

                                                    </td>

                                                    {/* REQUESTED */}

                                                    <td className="px-5 py-4">

                                                        <p className="text-sm text-slate-700">
                                                            {formatDate(
                                                                request.refundRequestedAt
                                                            )}
                                                        </p>

                                                    </td>

                                                    {/* STATUS */}

                                                    <td className="px-5 py-4">

                                                        {request.hasActiveDispute ? (

                                                            <div>

                                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">

                                                                    <ShieldAlert className="h-3.5 w-3.5" />

                                                                    Dispute active

                                                                </span>

                                                                {request.activeDisputeCount >
                                                                    0 && (

                                                                    <p className="mt-1 text-xs text-slate-400">

                                                                        {
                                                                            request.activeDisputeCount
                                                                        }{" "}
                                                                        active dispute
                                                                        {request.activeDisputeCount ===
                                                                        1
                                                                            ? ""
                                                                            : "s"}

                                                                    </p>

                                                                )}

                                                            </div>

                                                        ) : (

                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">

                                                                <CheckCircle2 className="h-3.5 w-3.5" />

                                                                Ready

                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* ACTION */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center justify-end gap-2">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedRequest(
                                                                        request
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                                            >

                                                                <Eye className="h-3.5 w-3.5" />

                                                                View

                                                            </button>

                                                            {request.hasActiveDispute ? (

                                                                request.activeDisputes?.[0]
                                                                    ?.disputeId ? (

                                                                    <Link
                                                                        href={`/admin/disputes/${request.activeDisputes[0].disputeId}`}
                                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                                                                    >

                                                                        <FileWarning className="h-3.5 w-3.5" />

                                                                        View Active Dispute

                                                                    </Link>

                                                                ) : (

                                                                    <button
                                                                        type="button"
                                                                        disabled
                                                                        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-400"
                                                                    >

                                                                        <FileWarning className="h-3.5 w-3.5" />

                                                                        Active Dispute

                                                                    </button>

                                                                )

                                                            ) : (

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isApproving
                                                                    }
                                                                    onClick={() =>
                                                                        void handleApproveRefund(
                                                                            request
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                                >

                                                                    {isApproving ? (

                                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />

                                                                    ) : (

                                                                        <CheckCircle2 className="h-3.5 w-3.5" />

                                                                    )}

                                                                    {isApproving
                                                                        ? "Processing..."
                                                                        : "Approve Refund"}

                                                                </button>

                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}

            </div>

            {/* ============================================================ */}
            {/* DETAILS MODAL                                                 */}
            {/* ============================================================ */}

            {selectedRequest && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedRequest(
                                null
                            );
                        }
                    }}
                >

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">

                            <div>

                                <div className="flex items-center gap-2">

                                    <Wallet className="h-5 w-5 text-orange-500" />

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Refund Request
                                    </h2>

                                </div>

                                <p className="mt-1 text-xs text-slate-400">
                                    Booking{" "}
                                    {selectedRequest.bookingId}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedRequest(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >

                                <XCircle className="h-5 w-5" />

                            </button>

                        </div>

                        <div className="space-y-6 p-6">

                            {/* REFUND SUMMARY */}

                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">

                                        <Wallet className="h-5 w-5 text-emerald-600" />

                                    </div>

                                    <div className="flex-1">

                                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                                            Refund to Client Wallet
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-emerald-900">
                                            {formatCurrency(
                                                selectedRequest.refundAmount
                                            )}
                                        </p>

                                        <p className="mt-1 text-sm text-emerald-700">
                                            Approval will immediately credit this amount to the client's available wallet balance.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* BOOKING INFO */}

                            <DetailSection title="Booking">

                                <DetailRow
                                    label="Booking ID"
                                    value={
                                        selectedRequest.bookingId
                                    }
                                />

                                <DetailRow
                                    label="Booking status"
                                    value="Cancelled"
                                />

                                <DetailRow
                                    label="Payment status"
                                    value={
                                        selectedRequest.paymentStatus ??
                                        "held"
                                    }
                                />

                                <DetailRow
                                    label="Refund status"
                                    value={
                                        selectedRequest.refundStatus ??
                                        "pending"
                                    }
                                />

                            </DetailSection>

                            {/* PEOPLE */}

                            <DetailSection title="Participants">

                                <DetailRow
                                    label="Client ID"
                                    value={
                                        selectedRequest.clientId
                                    }
                                />

                                <DetailRow
                                    label="Freelancer ID"
                                    value={
                                        selectedRequest.freelancerId
                                    }
                                />

                            </DetailSection>

                            {/* CANCELLATION */}

                            <DetailSection title="Cancellation">

                                <DetailRow
                                    label="Reason"
                                    value={
                                        selectedRequest.cancellationReason ??
                                        "No reason provided"
                                    }
                                />

                                <DetailRow
                                    label="Cancelled at"
                                    value={formatDate(
                                        selectedRequest.cancelledAt
                                    )}
                                />

                                <DetailRow
                                    label="Cancelled by"
                                    value={
                                        selectedRequest.cancelledBy ??
                                        "—"
                                    }
                                />

                                <DetailRow
                                    label="Refund requested"
                                    value={formatDate(
                                        selectedRequest.refundRequestedAt
                                    )}
                                />

                            </DetailSection>

                            {/* DISPUTES */}

                            <DetailSection title="Dispute Status">

                                {selectedRequest.hasActiveDispute ? (

                                    <div className="space-y-3">

                                        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                                            <div className="flex items-start gap-3">

                                                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                                                <div>

                                                    <p className="font-semibold text-red-800">
                                                        Refund approval blocked
                                                    </p>

                                                    <p className="mt-1 text-sm text-red-700">
                                                        This booking has an active dispute. Resolve the dispute before approving the refund.
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        {selectedRequest.activeDisputes?.map(
                                            (
                                                dispute
                                            ) => (

                                                <div
                                                    key={
                                                        dispute.disputeId
                                                    }
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                >

                                                    <div className="flex items-start justify-between gap-4">

                                                        <div>

                                                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                                Dispute
                                                            </p>

                                                            <p className="mt-1 font-semibold text-slate-900">
                                                                {getShortId(
                                                                    dispute.disputeId
                                                                )}
                                                            </p>

                                                        </div>

                                                        <span className="rounded-lg bg-red-100 px-2.5 py-1 text-xs font-bold capitalize text-red-700">
                                                            {String(
                                                                dispute.status
                                                            ).replace(
                                                                "_",
                                                                " "
                                                            )}
                                                        </span>

                                                    </div>

                                                    {dispute.category && (

                                                        <p className="mt-3 text-sm font-medium text-slate-700">
                                                            {dispute.category}
                                                        </p>

                                                    )}

                                                    {dispute.description && (

                                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                                            {
                                                                dispute.description
                                                            }
                                                        </p>

                                                    )}

                                                    <div className="mt-4 flex flex-wrap items-center gap-2">

                                                        {dispute.evidenceCount >
                                                            0 && (

                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">

                                                                <FileWarning className="h-3.5 w-3.5" />

                                                                {
                                                                    dispute.evidenceCount
                                                                }{" "}
                                                                evidence

                                                            </span>

                                                        )}

                                                        <Link
                                                            href={`/admin/disputes/${dispute.disputeId}`}
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                                                        >

                                                            <Eye className="h-3.5 w-3.5" />

                                                            View Active Dispute

                                                        </Link>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                ) : (

                                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                                        <div>

                                            <p className="font-semibold text-emerald-800">
                                                No active dispute
                                            </p>

                                            <p className="mt-1 text-sm text-emerald-700">
                                                This refund is eligible for approval.

                                            </p>

                                        </div>

                                    </div>

                                )}

                            </DetailSection>

                            {/* ACTION */}

                            <div className="border-t border-slate-200 pt-5">

                                {selectedRequest.hasActiveDispute ? (

                                    <div className="space-y-3">

                                        <div className="flex items-center gap-2 text-sm font-semibold text-red-700">

                                            <ShieldAlert className="h-4 w-4" />

                                            Approval unavailable while dispute is active.

                                        </div>

                                        {selectedRequest.activeDisputes?.[0]
                                            ?.disputeId && (

                                            <Link
                                                href={`/admin/disputes/${selectedRequest.activeDisputes[0].disputeId}`}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                                            >

                                                <FileWarning className="h-4 w-4" />

                                                View Active Dispute

                                            </Link>

                                        )}

                                    </div>

                                ) : (

                                    <button
                                        type="button"
                                        disabled={
                                            approvingBookingId ===
                                            selectedRequest.bookingId
                                        }
                                        onClick={() =>
                                            void handleApproveRefund(
                                                selectedRequest
                                            )
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {approvingBookingId ===
                                        selectedRequest.bookingId ? (

                                            <Loader2 className="h-4 w-4 animate-spin" />

                                        ) : (

                                            <CheckCircle2 className="h-4 w-4" />

                                        )}

                                        {approvingBookingId ===
                                        selectedRequest.bookingId
                                            ? "Processing Refund..."
                                            : `Approve Refund — ${formatCurrency(
                                                selectedRequest.refundAmount
                                            )}`}

                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
    title,
    value,
    icon,
    iconBackground,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    iconBackground: string;
}) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value}
                    </p>

                </div>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBackground}`}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Detail Section                                                             */
/* -------------------------------------------------------------------------- */

function DetailSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {

    return (

        <section>

            <h3 className="mb-3 text-sm font-bold text-slate-900">
                {title}
            </h3>

            <div className="overflow-hidden rounded-xl border border-slate-200">
                {children}
            </div>

        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Detail Row                                                                 */
/* -------------------------------------------------------------------------- */

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {

    return (

        <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </span>

            <span className="break-all text-sm font-medium text-slate-700 sm:text-right">
                {value}
            </span>

        </div>
    );
}