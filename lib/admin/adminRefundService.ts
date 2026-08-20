// import {
//     httpsCallable,
// } from "firebase/functions";

// import {
//     collection,
//     getDocs,
//     limit,
//     orderBy,
//     query,
//     where,
//     type DocumentData,
//     type Timestamp,
// } from "firebase/firestore";

// import { functions, db } from "@/lib/firebase";

// /* ==========================================================================
//    TYPES
// ============================================================================= */

// export type AdminRefundRequestStatus =
//     | "pending"
//     | "approved"
//     | "completed";

// export type AdminRefundDispute = {
//     disputeId: string;
//     bookingId: string;
//     reportedBy: string | null;
//     reportedByRole: string | null;
//     clientId: string | null;
//     freelancerId: string | null;
//     category: string | null;
//     description: string | null;
//     status: string | null;
//     evidenceCount: number;
//     createdAt: Date | null;
//     updatedAt: Date | null;
// };

// export type AdminRefundRequest = {
//     bookingId: string;

//     clientId: string | null;
//     freelancerId: string | null;

//     bookingStatus: string | null;
//     paymentStatus: string | null;
//     refundStatus: string | null;

//     price: number | null;

//     cancellationReason: string | null;
//     cancelledAt: Date | null;
//     cancelledBy: string | null;

//     refundRequestedAt: Date | null;
//     refundRequestedBy: string | null;

//     refundApprovedAt: Date | null;
//     refundApprovedBy: string | null;

//     refundProcessedAt: Date | null;
//     refundProcessedBy: string | null;

//     refundReference: string | null;

//     hasActiveDispute: boolean;
//     activeDisputeCount: number;
//     activeDisputes: AdminRefundDispute[];

//     booking: Record<string, unknown>;
//     postJob: Record<string, unknown>;

//     escrow: Record<string, unknown> | null;
// };

// export type AdminRefundActionResult = {
//     success: boolean;
//     bookingId: string;

//     paymentStatus?: string;
//     refundStatus?: string;
//     escrowStatus?: string;

//     refundReference?: string;
//     refundedAmount?: number;

//     freelancerId?: string;

//     alreadyApproved?: boolean;
//     alreadyRefunded?: boolean;

//     message?: string;
// };

// /* ==========================================================================
//    HELPERS
// ============================================================================= */

// function toDate(
//     value: unknown
// ): Date | null {
//     if (
//         value &&
//         typeof value === "object" &&
//         "toDate" in value &&
//         typeof (
//             value as {
//                 toDate?: unknown;
//             }
//         ).toDate === "function"
//     ) {
//         return (
//             value as {
//                 toDate: () => Date;
//             }
//         ).toDate();
//     }

//     if (value instanceof Date) {
//         return value;
//     }

//     if (
//         value &&
//         typeof value === "object" &&
//         "_seconds" in value
//     ) {
//         const timestamp =
//             value as {
//                 _seconds?: number;
//                 _nanoseconds?: number;
//             };

//         if (
//             typeof timestamp._seconds ===
//             "number"
//         ) {
//             return new Date(
//                 timestamp._seconds * 1000 +
//                     Math.floor(
//                         (timestamp._nanoseconds ??
//                             0) /
//                             1000000
//                     )
//             );
//         }
//     }

//     return null;
// }

// function getString(
//     value: unknown
// ): string | null {
//     return typeof value === "string"
//         ? value
//         : null;
// }

// function getNumber(
//     value: unknown
// ): number | null {
//     if (
//         typeof value === "number" &&
//         Number.isFinite(value)
//     ) {
//         return value;
//     }

//     return null;
// }

// function getActiveDisputes(
//     value: unknown
// ): AdminRefundDispute[] {
//     if (!Array.isArray(value)) {
//         return [];
//     }

//     return value
//         .filter(
//             (
//                 item
//             ): item is Record<
//                 string,
//                 unknown
//             > =>
//                 item !== null &&
//                 typeof item === "object"
//         )
//         .map((item) => ({
//             disputeId:
//                 getString(
//                     item.disputeId
//                 ) ?? "",

//             bookingId:
//                 getString(
//                     item.bookingId
//                 ) ?? "",

//             reportedBy:
//                 getString(
//                     item.reportedBy
//                 ),

//             reportedByRole:
//                 getString(
//                     item.reportedByRole
//                 ),

//             clientId:
//                 getString(
//                     item.clientId
//                 ),

//             freelancerId:
//                 getString(
//                     item.freelancerId
//                 ),

//             category:
//                 getString(
//                     item.category
//                 ),

//             description:
//                 getString(
//                     item.description
//                 ),

//             status:
//                 getString(
//                     item.status
//                 ),

//             evidenceCount:
//                 typeof item.evidenceCount ===
//                 "number"
//                     ? item.evidenceCount
//                     : 0,

//             createdAt:
//                 toDate(
//                     item.createdAt
//                 ),

//             updatedAt:
//                 toDate(
//                     item.updatedAt
//                 ),
//         }));
// }

// /* ==========================================================================
//    GET PENDING REFUND REQUESTS
// ============================================================================= */

// export async function getPendingRefundRequests(): Promise<
//     AdminRefundRequest[]
// > {
//     const callable =
//         httpsCallable<
//             Record<string, never>,
//             {
//                 success: boolean;
//                 count: number;
//                 refundRequests: Record<
//                     string,
//                     unknown
//                 >[];
//             }
//         >(
//             functions,
//             "getPendingRefundRequests"
//         );

//     const result =
//         await callable({});

//     const data =
//         result.data;

//     if (
//         !data ||
//         data.success !== true
//     ) {
//         throw new Error(
//             "Unable to load refund requests."
//         );
//     }

//     return (
//         data.refundRequests ?? []
//     ).map(
//         mapRefundRequest
//     );
// }

// /* ==========================================================================
//    GET APPROVED REFUNDS FOR MANUAL PROCESSING
// ============================================================================= */

// export async function getManualRefundRequests(): Promise<
//     AdminRefundRequest[]
// > {
//     /*
//      * Manual refund state:
//      *
//      * paymentStatus = refund_pending
//      * refundStatus  = approved
//      *
//      * These records have already been approved
//      * and are waiting for the administrator to
//      * actually process the external refund.
//      */

//     const bookingsQuery =
//         query(
//             collection(
//                 db,
//                 "Bookings"
//             ),
//             where(
//                 "paymentStatus",
//                 "==",
//                 "refund_pending"
//             ),
//             where(
//                 "refundStatus",
//                 "==",
//                 "approved"
//             ),
//             orderBy(
//                 "refundApprovedAt",
//                 "desc"
//             ),
//             limit(100)
//         );

//     const snapshot =
//         await getDocs(
//             bookingsQuery
//         );

//     const requests: AdminRefundRequest[] =
//         [];

//     for (
//         const bookingDoc of snapshot.docs
//     ) {
//         const booking =
//             bookingDoc.data();

//         const bookingId =
//             bookingDoc.id;

//         /*
//          * PostJobRequests uses the same
//          * booking ID in the current backend.
//          */

//         const postJobQuery =
//             query(
//                 collection(
//                     db,
//                     "PostJobRequests"
//                 ),
//                 where(
//                     "__name__",
//                     "==",
//                     bookingId
//                 ),
//                 limit(1)
//             );

//         const postJobSnapshot =
//             await getDocs(
//                 postJobQuery
//             );

//         if (
//             postJobSnapshot.empty
//         ) {
//             continue;
//         }

//         const postJobDoc =
//             postJobSnapshot.docs[0];

//         const postJob =
//             postJobDoc.data();

//         /*
//          * Both sides should be approved.
//          */

//         if (
//             postJob.paymentStatus !==
//                 "refund_pending" ||
//             postJob.refundStatus !==
//                 "approved"
//         ) {
//             continue;
//         }

//         /*
//          * Load escrow.
//          */

//         let escrow:
//             | Record<
//                   string,
//                   unknown
//               >
//             | null = null;

//         const escrowQuery =
//             query(
//                 collection(
//                     db,
//                     "Escrows"
//                 ),
//                 where(
//                     "__name__",
//                     "==",
//                     bookingId
//                 ),
//                 limit(1)
//             );

//         const escrowSnapshot =
//             await getDocs(
//                 escrowQuery
//             );

//         if (
//             !escrowSnapshot.empty
//         ) {
//             escrow =
//                 escrowSnapshot.docs[0].data();
//         }

//         /*
//          * Load active disputes.
//          */

//         const disputesQuery =
//             query(
//                 collection(
//                     db,
//                     "Disputes"
//                 ),
//                 where(
//                     "bookingId",
//                     "==",
//                     bookingId
//                 )
//             );

//         const disputesSnapshot =
//             await getDocs(
//                 disputesQuery
//             );

//         const activeDisputes: AdminRefundDispute[] =
//             disputesSnapshot.docs
//                 .map(
//                     (disputeDoc) => {
//                         const dispute =
//                             disputeDoc.data();

//                         return {
//                             disputeId:
//                                 disputeDoc.id,

//                             bookingId,

//                             reportedBy:
//                                 getString(
//                                     dispute.reportedBy
//                                 ),

//                             reportedByRole:
//                                 getString(
//                                     dispute.reportedByRole
//                                 ),

//                             clientId:
//                                 getString(
//                                     dispute.clientId
//                                 ),

//                             freelancerId:
//                                 getString(
//                                     dispute.freelancerId
//                                 ),

//                             category:
//                                 getString(
//                                     dispute.category
//                                 ),

//                             description:
//                                 getString(
//                                     dispute.description
//                                 ),

//                             status:
//                                 getString(
//                                     dispute.status
//                                 ),

//                             evidenceCount:
//                                 Array.isArray(
//                                     dispute.evidence
//                                 )
//                                     ? dispute.evidence.length
//                                     : 0,

//                             createdAt:
//                                 toDate(
//                                     dispute.createdAt
//                                 ),

//                             updatedAt:
//                                 toDate(
//                                     dispute.updatedAt
//                                 ),
//                         };
//                     }
//                 )
//                 .filter(
//                     (dispute) =>
//                         dispute.status ===
//                             "pending" ||
//                         dispute.status ===
//                             "under_review"
//                 );

//         requests.push({
//             bookingId,

//             clientId:
//                 getString(
//                     booking.clientId ??
//                         postJob.clientId
//                 ),

//             freelancerId:
//                 getString(
//                     booking.freelancerId ??
//                         postJob.freelancerId
//                 ),

//             bookingStatus:
//                 getString(
//                     booking.status
//                 ),

//             paymentStatus:
//                 getString(
//                     booking.paymentStatus
//                 ),

//             refundStatus:
//                 getString(
//                     booking.refundStatus
//                 ),

//             price:
//                 getNumber(
//                     booking.price ??
//                         postJob.price
//                 ),

//             cancellationReason:
//                 getString(
//                     booking.cancellationReason ??
//                         postJob.cancellationReason
//                 ),

//             cancelledAt:
//                 toDate(
//                     booking.cancelledAt ??
//                         postJob.cancelledAt
//                 ),

//             cancelledBy:
//                 getString(
//                     booking.cancelledBy ??
//                         postJob.cancelledBy
//                 ),

//             refundRequestedAt:
//                 toDate(
//                     booking.refundRequestedAt ??
//                         postJob.refundRequestedAt
//                 ),

//             refundRequestedBy:
//                 getString(
//                     booking.refundRequestedBy ??
//                         postJob.refundRequestedBy
//                 ),

//             refundApprovedAt:
//                 toDate(
//                     booking.refundApprovedAt ??
//                         postJob.refundApprovedAt
//                 ),

//             refundApprovedBy:
//                 getString(
//                     booking.refundApprovedBy ??
//                         postJob.refundApprovedBy
//                 ),

//             refundProcessedAt:
//                 toDate(
//                     booking.refundProcessedAt ??
//                         postJob.refundProcessedAt
//                 ),

//             refundProcessedBy:
//                 getString(
//                     booking.refundProcessedBy ??
//                         postJob.refundProcessedBy
//                 ),

//             refundReference:
//                 getString(
//                     booking.refundReference ??
//                         postJob.refundReference
//                 ),

//             hasActiveDispute:
//                 activeDisputes.length >
//                 0,

//             activeDisputeCount:
//                 activeDisputes.length,

//             activeDisputes,

//             booking: {
//                 id: bookingId,
//                 ...booking,
//             },

//             postJob: {
//                 id: bookingId,
//                 ...postJob,
//             },

//             escrow,
//         });
//     }

//     return requests;
// }

// /* ==========================================================================
//    APPROVE REFUND REQUEST
// ============================================================================= */

// export async function approveRefundRequest(
//     bookingId: string
// ): Promise<AdminRefundActionResult> {
//     const cleanBookingId =
//         bookingId.trim();

//     if (!cleanBookingId) {
//         throw new Error(
//             "Booking ID is required."
//         );
//     }

//     const callable =
//         httpsCallable<
//             {
//                 bookingId: string;
//             },
//             AdminRefundActionResult
//         >(
//             functions,
//             "approveRefundRequest"
//         );

//     const result =
//         await callable({
//             bookingId:
//                 cleanBookingId,
//         });

//     return result.data;
// }

// /* ==========================================================================
//    MARK BOOKING REFUNDED
// ============================================================================= */

// export async function markBookingRefunded(
//     bookingId: string,
//     refundReference: string
// ): Promise<AdminRefundActionResult> {
//     const cleanBookingId =
//         bookingId.trim();

//     const cleanRefundReference =
//         refundReference.trim();

//     if (!cleanBookingId) {
//         throw new Error(
//             "Booking ID is required."
//         );
//     }

//     if (!cleanRefundReference) {
//         throw new Error(
//             "Refund reference is required."
//         );
//     }

//     const callable =
//         httpsCallable<
//             {
//                 bookingId: string;
//                 refundReference: string;
//             },
//             AdminRefundActionResult
//         >(
//             functions,
//             "markBookingRefunded"
//         );

//     const result =
//         await callable({
//             bookingId:
//                 cleanBookingId,

//             refundReference:
//                 cleanRefundReference,
//         });

//     return result.data;
// }

// /* ==========================================================================
//    MAP REFUND REQUEST
// ============================================================================= */

// function mapRefundRequest(
//     value: Record<string, unknown>
// ): AdminRefundRequest {
//     const booking =
//         (
//             value.booking ??
//             {}
//         ) as Record<
//             string,
//             unknown
//         >;

//     const postJob =
//         (
//             value.postJob ??
//             {}
//         ) as Record<
//             string,
//             unknown
//         >;

//     const activeDisputes =
//         getActiveDisputes(
//             value.activeDisputes
//         );

//     const escrow =
//         value.escrow &&
//         typeof value.escrow ===
//             "object"
//             ? (
//                   value.escrow as Record<
//                       string,
//                       unknown
//                   >
//               )
//             : null;

//     return {
//         bookingId:
//             getString(
//                 value.bookingId
//             ) ?? "",

//         clientId:
//             getString(
//                 value.clientId
//             ),

//         freelancerId:
//             getString(
//                 value.freelancerId
//             ),

//         bookingStatus:
//             getString(
//                 value.bookingStatus
//             ),

//         paymentStatus:
//             getString(
//                 value.paymentStatus
//             ),

//         refundStatus:
//             getString(
//                 value.refundStatus
//             ),

//         price:
//             getNumber(
//                 value.price
//             ),

//         cancellationReason:
//             getString(
//                 value.cancellationReason
//             ),

//         cancelledAt:
//             toDate(
//                 value.cancelledAt
//             ),

//         cancelledBy:
//             getString(
//                 value.cancelledBy
//             ),

//         refundRequestedAt:
//             toDate(
//                 value.refundRequestedAt
//             ),

//         refundRequestedBy:
//             getString(
//                 value.refundRequestedBy
//             ),

//         refundApprovedAt:
//             toDate(
//                 value.refundApprovedAt
//             ),

//         refundApprovedBy:
//             getString(
//                 value.refundApprovedBy
//             ),

//         refundProcessedAt:
//             toDate(
//                 value.refundProcessedAt
//             ),

//         refundProcessedBy:
//             getString(
//                 value.refundProcessedBy
//             ),

//         refundReference:
//             getString(
//                 value.refundReference
//             ),

//         hasActiveDispute:
//             value.hasActiveDispute ===
//             true,

//         activeDisputeCount:
//             typeof value.activeDisputeCount ===
//             "number"
//                 ? value.activeDisputeCount
//                 : activeDisputes.length,

//         activeDisputes,

//         booking,

//         postJob,

//         escrow,
//     };
// }


import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import {
    getFunctions,
    httpsCallable,
} from "firebase/functions";

import { db } from "@/lib/firebase";

/* ==========================================================================
   TYPES
============================================================================= */

export type AdminRefundStatus =
    | "pending"
    | "approved"
    | "completed"
    | "rejected"
    | "cancelled"
    | string;

export type AdminRefundDispute = {
    disputeId: string;
    bookingId: string;

    reportedBy: string | null;
    reportedByRole: string | null;

    clientId: string | null;
    freelancerId: string | null;

    category: string | null;
    description: string | null;

    status: string | null;

    evidenceCount: number;

    createdAt: Date | null;
    updatedAt: Date | null;
};

export type AdminRefundRequest = {
    bookingId: string;

    /* ----------------------------------------------------------------------
       USERS
    ---------------------------------------------------------------------- */

    clientId: string | null;
    freelancerId: string | null;

    /* ----------------------------------------------------------------------
       BOOKING
    ---------------------------------------------------------------------- */

    bookingStatus: string | null;

    paymentStatus: string | null;

    /* ----------------------------------------------------------------------
       REFUND
    ---------------------------------------------------------------------- */

    refundStatus: AdminRefundStatus | null;

    refundAmount: number | null;

    refundAmountSource:
    | "escrow.amount"
    | "booking.price"
    | "postJob.price"
    | "paymentReceipt.serviceAmount"
    | null;

    refundRequestedAt: Date | null;
    refundRequestedBy: string | null;

    refundApprovedAt: Date | null;
    refundApprovedBy: string | null;

    refundCompletedAt: Date | null;
    refundCompletedBy: string | null;

    refundReference: string | null;

    /* ----------------------------------------------------------------------
       PRICE
    ---------------------------------------------------------------------- */

    price: number | null;

    /* ----------------------------------------------------------------------
       CANCELLATION
    ---------------------------------------------------------------------- */

    cancellationReason: string | null;

    cancelledAt: Date | null;

    cancelledBy: string | null;

    /* ----------------------------------------------------------------------
       DISPUTES
    ---------------------------------------------------------------------- */

    hasActiveDispute: boolean;

    activeDisputeCount: number;

    activeDisputes: AdminRefundDispute[];

    /* ----------------------------------------------------------------------
       ORIGINAL DOCUMENTS
    ---------------------------------------------------------------------- */

    booking: Record<string, unknown>;

    postJob: Record<string, unknown>;

    escrow: {
        id: string;
        amount: number | string | null;
        netPay: number | string | null;
        status: string | null;
    };
};

/* ==========================================================================
   CALLABLE FUNCTION RESULT TYPES
============================================================================= */

export type ApproveRefundRequestResult = {
    success: boolean;

    alreadyRefunded?: boolean;

    bookingId: string;

    paymentStatus?: string;

    refundStatus?: string;

    refundAmount?: number;

    clientId?: string;

    freelancerId?: string;

    escrowStatus?: string;

    refundMethod?: string;

    message?: string;
};

/* ==========================================================================
   FIREBASE FUNCTIONS
============================================================================= */

const functions = getFunctions(
    undefined,
    "asia-southeast1"
);

/* ==========================================================================
   HELPERS
============================================================================= */

function getTimestampDate(
    value: unknown
): Date | null {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    if (value instanceof Timestamp) {
        return value.toDate();
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "toDate" in value &&
        typeof (
            value as {
                toDate?: unknown;
            }
        ).toDate === "function"
    ) {
        try {
            return (
                value as {
                    toDate: () => Date;
                }
            ).toDate();
        } catch {
            return null;
        }
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "_seconds" in value
    ) {
        const firestoreTimestamp =
            value as {
                _seconds?: unknown;
                _nanoseconds?: unknown;
            };

        if (
            typeof firestoreTimestamp._seconds ===
            "number"
        ) {
            const seconds =
                firestoreTimestamp._seconds;

            const nanoseconds =
                typeof firestoreTimestamp._nanoseconds ===
                    "number"
                    ? firestoreTimestamp._nanoseconds
                    : 0;

            return new Date(
                seconds * 1000 +
                Math.floor(
                    nanoseconds / 1_000_000
                )
            );
        }
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "seconds" in value
    ) {
        const firestoreTimestamp =
            value as {
                seconds?: unknown;
                nanoseconds?: unknown;
            };

        if (
            typeof firestoreTimestamp.seconds ===
            "number"
        ) {
            const seconds =
                firestoreTimestamp.seconds;

            const nanoseconds =
                typeof firestoreTimestamp.nanoseconds ===
                    "number"
                    ? firestoreTimestamp.nanoseconds
                    : 0;

            return new Date(
                seconds * 1000 +
                Math.floor(
                    nanoseconds / 1_000_000
                )
            );
        }
    }

    return null;
}

/* -------------------------------------------------------------------------- */

function getString(
    value: unknown,
    fallback: string | null = null
): string | null {
    return typeof value === "string"
        ? value
        : fallback;
}

/* -------------------------------------------------------------------------- */

function getNumber(
    value: unknown,
    fallback: number | null = null
): number | null {
    return typeof value === "number" &&
        Number.isFinite(value)
        ? value
        : fallback;
}

/* -------------------------------------------------------------------------- */

function getObject(
    value: unknown
): Record<string, unknown> {
    if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {
        return value as Record<string, unknown>;
    }

    return {};
}

/* -------------------------------------------------------------------------- */

function getArray(
    value: unknown
): unknown[] {
    return Array.isArray(value)
        ? value
        : [];
}

/* ==========================================================================
   MAP ACTIVE DISPUTE
============================================================================= */

function mapActiveDispute(
    value: unknown,
    fallbackBookingId: string
): AdminRefundDispute | null {
    const data =
        getObject(value);

    const disputeId =
        getString(
            data.disputeId
        );

    if (!disputeId) {
        return null;
    }

    return {
        disputeId,

        bookingId:
            getString(
                data.bookingId,
                fallbackBookingId
            ) ?? fallbackBookingId,

        reportedBy:
            getString(
                data.reportedBy
            ),

        reportedByRole:
            getString(
                data.reportedByRole
            ),

        clientId:
            getString(
                data.clientId
            ),

        freelancerId:
            getString(
                data.freelancerId
            ),

        category:
            getString(
                data.category
            ),

        description:
            getString(
                data.description
            ),

        status:
            getString(
                data.status
            ),

        evidenceCount:
            typeof data.evidenceCount ===
                "number"
                ? data.evidenceCount
                : 0,

        createdAt:
            getTimestampDate(
                data.createdAt
            ),

        updatedAt:
            getTimestampDate(
                data.updatedAt
            ),
    };
}

/* ==========================================================================
   MAP REFUND REQUEST
============================================================================= */

function mapAdminRefundRequest(
    value: unknown
): AdminRefundRequest {
    const data =
        getObject(value);

    const bookingId =
        getString(
            data.bookingId,
            ""
        ) ?? "";

    const booking =
        getObject(
            data.booking
        );

    const postJob =
        getObject(
            data.postJob
        );

    const rawActiveDisputes =
        getArray(
            data.activeDisputes
        );

    const activeDisputes =
        rawActiveDisputes
            .map((item) =>
                mapActiveDispute(
                    item,
                    bookingId
                )
            )
            .filter(
                (
                    dispute
                ): dispute is AdminRefundDispute =>
                    dispute !== null
            );

    const activeDisputeCount =
        typeof data.activeDisputeCount ===
            "number"
            ? data.activeDisputeCount
            : activeDisputes.length;

    const hasActiveDispute =
        typeof data.hasActiveDispute ===
            "boolean"
            ? data.hasActiveDispute
            : activeDisputeCount > 0;

    const refundStatus =
        getString(
            data.refundStatus
        );

    /*
     * The Cloud Function is the source of truth for refundAmount.
     *
     * We do NOT automatically calculate it here because the backend
     * may have business rules that determine the exact amount.
     */
    const refundAmount =
        getNumber(
            data.refundAmount
        );

    /* ----------------------------------------------------------------------
   REFUND AMOUNT SOURCE
---------------------------------------------------------------------- */

    const refundAmountSource =
        data.refundAmountSource === "escrow.amount"
            ? "escrow.amount"
            : data.refundAmountSource === "booking.price"
                ? "booking.price"
                : data.refundAmountSource === "postJob.price"
                    ? "postJob.price"
                    : data.refundAmountSource ===
                        "paymentReceipt.serviceAmount"
                        ? "paymentReceipt.serviceAmount"
                        : null;

    /* ----------------------------------------------------------------------
       ESCROW
    ---------------------------------------------------------------------- */

    const rawEscrow =
        getObject(data.escrow);

    const escrow = {
        id:
            getString(
                rawEscrow.id
            ) ?? "",

        amount:
            typeof rawEscrow.amount === "number" ||
                typeof rawEscrow.amount === "string"
                ? rawEscrow.amount
                : null,

        netPay:
            typeof rawEscrow.netPay === "number" ||
                typeof rawEscrow.netPay === "string"
                ? rawEscrow.netPay
                : null,

        status:
            getString(
                rawEscrow.status
            ),
    };

    return {
        bookingId,

        /* ------------------------------------------------------------------
           USERS
        ------------------------------------------------------------------ */

        clientId:
            getString(
                data.clientId
            ) ??
            getString(
                booking.clientId
            ) ??
            getString(
                postJob.clientId
            ),

        freelancerId:
            getString(
                data.freelancerId
            ) ??
            getString(
                booking.freelancerId
            ) ??
            getString(
                postJob.freelancerId
            ),

        /* ------------------------------------------------------------------
           BOOKING
        ------------------------------------------------------------------ */

        bookingStatus:
            getString(
                data.bookingStatus
            ) ??
            getString(
                booking.status
            ),

        paymentStatus:
            getString(
                data.paymentStatus
            ) ??
            getString(
                booking.paymentStatus
            ),

        /* ------------------------------------------------------------------
           REFUND
        ------------------------------------------------------------------ */

        refundStatus,

        refundAmount,

        refundAmountSource,

        refundRequestedAt:
            getTimestampDate(
                data.refundRequestedAt
            ) ??
            getTimestampDate(
                booking.refundRequestedAt
            ) ??
            getTimestampDate(
                postJob.refundRequestedAt
            ),

        refundRequestedBy:
            getString(
                data.refundRequestedBy
            ) ??
            getString(
                booking.refundRequestedBy
            ) ??
            getString(
                postJob.refundRequestedBy
            ),

        refundApprovedAt:
            getTimestampDate(
                data.refundApprovedAt
            ) ??
            getTimestampDate(
                booking.refundApprovedAt
            ) ??
            getTimestampDate(
                postJob.refundApprovedAt
            ),

        refundApprovedBy:
            getString(
                data.refundApprovedBy
            ) ??
            getString(
                booking.refundApprovedBy
            ) ??
            getString(
                postJob.refundApprovedBy
            ),

        refundCompletedAt:
            getTimestampDate(
                data.refundCompletedAt
            ) ??
            getTimestampDate(
                booking.refundCompletedAt
            ) ??
            getTimestampDate(
                postJob.refundCompletedAt
            ) ??
            getTimestampDate(
                booking.refundProcessedAt
            ) ??
            getTimestampDate(
                postJob.refundProcessedAt
            ),

        refundCompletedBy:
            getString(
                data.refundCompletedBy
            ) ??
            getString(
                booking.refundCompletedBy
            ) ??
            getString(
                postJob.refundCompletedBy
            ) ??
            getString(
                booking.refundProcessedBy
            ) ??
            getString(
                postJob.refundProcessedBy
            ),

        refundReference:
            getString(
                data.refundReference
            ) ??
            getString(
                booking.refundReference
            ) ??
            getString(
                postJob.refundReference
            ),

        /* ------------------------------------------------------------------
           PRICE
        ------------------------------------------------------------------ */

        price:
            getNumber(
                data.price
            ) ??
            getNumber(
                booking.price
            ) ??
            getNumber(
                postJob.price
            ),

        /* ------------------------------------------------------------------
           CANCELLATION
        ------------------------------------------------------------------ */

        cancellationReason:
            getString(
                data.cancellationReason
            ) ??
            getString(
                booking.cancellationReason
            ) ??
            getString(
                postJob.cancellationReason
            ),

        cancelledAt:
            getTimestampDate(
                data.cancelledAt
            ) ??
            getTimestampDate(
                booking.cancelledAt
            ) ??
            getTimestampDate(
                postJob.cancelledAt
            ),

        cancelledBy:
            getString(
                data.cancelledBy
            ) ??
            getString(
                booking.cancelledBy
            ) ??
            getString(
                postJob.cancelledBy
            ),

        /* ------------------------------------------------------------------
           DISPUTES
        ------------------------------------------------------------------ */

        hasActiveDispute,

        activeDisputeCount,

        activeDisputes,

        /* ------------------------------------------------------------------
           ORIGINAL DOCUMENTS
        ------------------------------------------------------------------ */

        booking,

        postJob,

        escrow,
    };
}

/* ==========================================================================
   GET PENDING REFUND REQUESTS
============================================================================= */

/**
 * Gets refund requests that are currently pending.
 *
 * The Cloud Function already performs the important server-side validation:
 *
 * - booking is cancelled
 * - payment is held
 * - refund status is pending
 * - PostJobRequests is valid
 * - active disputes are detected
 *
 * The web service therefore treats the Cloud Function result as authoritative.
 */
export async function getPendingRefundRequests(): Promise<
    AdminRefundRequest[]
> {
    const getPendingRefundRequestsFn =
        httpsCallable<
            Record<string, never>,
            {
                success: boolean;
                count?: number;
                refundRequests?: unknown[];
            }
        >(
            functions,
            "getPendingRefundRequests"
        );

    const result =
        await getPendingRefundRequestsFn(
            {}
        );

    const data =
        result.data;

    if (
        !data ||
        data.success !== true
    ) {
        throw new Error(
            "Unable to load pending refund requests."
        );
    }

    const rawRequests =
        Array.isArray(
            data.refundRequests
        )
            ? data.refundRequests
            : [];

    return rawRequests
        .map(
            mapAdminRefundRequest
        );
}

/* ==========================================================================
   APPROVE REFUND REQUEST
============================================================================= */

/**
 * Approves a normal refund request.
 *
 * IMPORTANT:
 *
 * The actual refund logic happens inside the Cloud Function.
 *
 * The current backend flow is:
 *
 * pending
 *    ↓
 * approveRefundRequest
 *    ↓
 * refundAmount credited to client wallet
 *    ↓
 * refund completed
 *
 * The web application must NOT modify wallet balances directly.
 */
export async function approveRefundRequest(
    bookingId: string
): Promise<ApproveRefundRequestResult> {
    const cleanBookingId =
        bookingId.trim();

    if (!cleanBookingId) {
        throw new Error(
            "Booking ID is required."
        );
    }

    const approveRefundRequestFn =
        httpsCallable<
            {
                bookingId: string;
            },
            ApproveRefundRequestResult
        >(
            functions,
            "approveRefundRequest"
        );

    const result =
        await approveRefundRequestFn({
            bookingId:
                cleanBookingId,
        });

    const data =
        result.data;

    if (
        !data ||
        data.success !== true
    ) {
        throw new Error(
            data?.message ??
            "Unable to approve refund request."
        );
    }

    return data;
}

/* ==========================================================================
   GET COMPLETED REFUNDS
============================================================================= */

/**
 * Gets completed refunds directly from Bookings.
 *
 * This is useful for the admin Refund Requests page after the normal
 * refund flow has already completed.
 *
 * We intentionally query Bookings only and do not require a composite
 * index involving refundStatus + refundProcessedAt.
 */
export async function getCompletedRefunds(): Promise<
    AdminRefundRequest[]
> {
    const bookingsRef =
        collection(
            db,
            "Bookings"
        );

    const completedQuery =
        query(
            bookingsRef,
            where(
                "refundStatus",
                "==",
                "completed"
            ),
            orderBy(
                "refundProcessedAt",
                "desc"
            ),
            limit(50)
        );

    const snapshot =
        await getDocs(
            completedQuery
        );

    /*
     * We need the corresponding PostJobRequests document because the
     * refund state is mirrored there.
     */
    const requests =
        await Promise.all(
            snapshot.docs.map(
                async (
                    bookingDoc
                ) => {
                    const booking =
                        bookingDoc.data();

                    const bookingId =
                        bookingDoc.id;

                    const postJobRef =
                        query(
                            collection(
                                db,
                                "PostJobRequests"
                            ),
                            where(
                                "__name__",
                                "==",
                                bookingId
                            ),
                            limit(1)
                        );

                    const postJobSnapshot =
                        await getDocs(
                            postJobRef
                        );

                    const postJob =
                        postJobSnapshot.empty
                            ? {}
                            : postJobSnapshot
                                .docs[0]
                                .data();

                    /*
                     * We don't have the Cloud Function's active dispute
                     * summary here, so completed refunds are considered
                     * non-blocked for display purposes.
                     *
                     * Historical disputes can still be inspected from
                     * the Disputes page.
                     */
                    return mapAdminRefundRequest({
                        bookingId,

                        clientId:
                            booking.clientId ??
                            postJob.clientId ??
                            null,

                        freelancerId:
                            booking.freelancerId ??
                            postJob.freelancerId ??
                            null,

                        bookingStatus:
                            booking.status ??
                            null,

                        paymentStatus:
                            booking.paymentStatus ??
                            null,

                        refundStatus:
                            booking.refundStatus ??
                            null,

                        refundAmount:
                            booking.refundAmount ??
                            null,

                        refundRequestedAt:
                            booking.refundRequestedAt ??
                            postJob.refundRequestedAt ??
                            null,

                        refundRequestedBy:
                            booking.refundRequestedBy ??
                            postJob.refundRequestedBy ??
                            null,

                        refundApprovedAt:
                            booking.refundApprovedAt ??
                            postJob.refundApprovedAt ??
                            null,

                        refundApprovedBy:
                            booking.refundApprovedBy ??
                            postJob.refundApprovedBy ??
                            null,

                        refundCompletedAt:
                            booking.refundCompletedAt ??
                            booking.refundProcessedAt ??
                            postJob.refundCompletedAt ??
                            postJob.refundProcessedAt ??
                            null,

                        refundCompletedBy:
                            booking.refundCompletedBy ??
                            booking.refundProcessedBy ??
                            postJob.refundCompletedBy ??
                            postJob.refundProcessedBy ??
                            null,

                        refundReference:
                            booking.refundReference ??
                            postJob.refundReference ??
                            null,

                        price:
                            typeof booking.price ===
                                "number"
                                ? booking.price
                                : typeof postJob.price ===
                                    "number"
                                    ? postJob.price
                                    : null,

                        cancellationReason:
                            booking.cancellationReason ??
                            postJob.cancellationReason ??
                            null,

                        cancelledAt:
                            booking.cancelledAt ??
                            postJob.cancelledAt ??
                            null,

                        cancelledBy:
                            booking.cancelledBy ??
                            postJob.cancelledBy ??
                            null,

                        hasActiveDispute:
                            false,

                        activeDisputeCount:
                            0,

                        activeDisputes:
                            [],

                        booking: {
                            id: bookingId,
                            ...booking,
                        },

                        postJob: {
                            id: bookingId,
                            ...postJob,
                        },
                    });
                }
            )
        );

    return requests;
}

/* ==========================================================================
   GET REFUND REQUEST BY BOOKING ID
============================================================================= */

/**
 * Convenience helper for pages/details that need to reload a specific
 * refund request from the pending list.
 */
export async function getRefundRequestByBookingId(
    bookingId: string
): Promise<AdminRefundRequest | null> {
    const cleanBookingId =
        bookingId.trim();

    if (!cleanBookingId) {
        return null;
    }

    const requests =
        await getPendingRefundRequests();

    return (
        requests.find(
            (request) =>
                request.bookingId ===
                cleanBookingId
        ) ?? null
    );
}
