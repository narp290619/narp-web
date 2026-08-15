import {
    httpsCallable,
} from "firebase/functions";

import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where,
    type DocumentData,
    type Timestamp,
} from "firebase/firestore";

import { functions, db } from "@/lib/firebase";

/* ==========================================================================
   TYPES
============================================================================= */

export type AdminRefundRequestStatus =
    | "pending"
    | "approved"
    | "completed";

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

    clientId: string | null;
    freelancerId: string | null;

    bookingStatus: string | null;
    paymentStatus: string | null;
    refundStatus: string | null;

    price: number | null;

    cancellationReason: string | null;
    cancelledAt: Date | null;
    cancelledBy: string | null;

    refundRequestedAt: Date | null;
    refundRequestedBy: string | null;

    refundApprovedAt: Date | null;
    refundApprovedBy: string | null;

    refundProcessedAt: Date | null;
    refundProcessedBy: string | null;

    refundReference: string | null;

    hasActiveDispute: boolean;
    activeDisputeCount: number;
    activeDisputes: AdminRefundDispute[];

    booking: Record<string, unknown>;
    postJob: Record<string, unknown>;

    escrow: Record<string, unknown> | null;
};

export type AdminRefundActionResult = {
    success: boolean;
    bookingId: string;

    paymentStatus?: string;
    refundStatus?: string;
    escrowStatus?: string;

    refundReference?: string;
    refundedAmount?: number;

    freelancerId?: string;

    alreadyApproved?: boolean;
    alreadyRefunded?: boolean;

    message?: string;
};

/* ==========================================================================
   HELPERS
============================================================================= */

function toDate(
    value: unknown
): Date | null {
    if (
        value &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof (
            value as {
                toDate?: unknown;
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

    if (
        value &&
        typeof value === "object" &&
        "_seconds" in value
    ) {
        const timestamp =
            value as {
                _seconds?: number;
                _nanoseconds?: number;
            };

        if (
            typeof timestamp._seconds ===
            "number"
        ) {
            return new Date(
                timestamp._seconds * 1000 +
                    Math.floor(
                        (timestamp._nanoseconds ??
                            0) /
                            1000000
                    )
            );
        }
    }

    return null;
}

function getString(
    value: unknown
): string | null {
    return typeof value === "string"
        ? value
        : null;
}

function getNumber(
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

function getActiveDisputes(
    value: unknown
): AdminRefundDispute[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (
                item
            ): item is Record<
                string,
                unknown
            > =>
                item !== null &&
                typeof item === "object"
        )
        .map((item) => ({
            disputeId:
                getString(
                    item.disputeId
                ) ?? "",

            bookingId:
                getString(
                    item.bookingId
                ) ?? "",

            reportedBy:
                getString(
                    item.reportedBy
                ),

            reportedByRole:
                getString(
                    item.reportedByRole
                ),

            clientId:
                getString(
                    item.clientId
                ),

            freelancerId:
                getString(
                    item.freelancerId
                ),

            category:
                getString(
                    item.category
                ),

            description:
                getString(
                    item.description
                ),

            status:
                getString(
                    item.status
                ),

            evidenceCount:
                typeof item.evidenceCount ===
                "number"
                    ? item.evidenceCount
                    : 0,

            createdAt:
                toDate(
                    item.createdAt
                ),

            updatedAt:
                toDate(
                    item.updatedAt
                ),
        }));
}

/* ==========================================================================
   GET PENDING REFUND REQUESTS
============================================================================= */

export async function getPendingRefundRequests(): Promise<
    AdminRefundRequest[]
> {
    const callable =
        httpsCallable<
            Record<string, never>,
            {
                success: boolean;
                count: number;
                refundRequests: Record<
                    string,
                    unknown
                >[];
            }
        >(
            functions,
            "getPendingRefundRequests"
        );

    const result =
        await callable({});

    const data =
        result.data;

    if (
        !data ||
        data.success !== true
    ) {
        throw new Error(
            "Unable to load refund requests."
        );
    }

    return (
        data.refundRequests ?? []
    ).map(
        mapRefundRequest
    );
}

/* ==========================================================================
   GET APPROVED REFUNDS FOR MANUAL PROCESSING
============================================================================= */

export async function getManualRefundRequests(): Promise<
    AdminRefundRequest[]
> {
    /*
     * Manual refund state:
     *
     * paymentStatus = refund_pending
     * refundStatus  = approved
     *
     * These records have already been approved
     * and are waiting for the administrator to
     * actually process the external refund.
     */

    const bookingsQuery =
        query(
            collection(
                db,
                "Bookings"
            ),
            where(
                "paymentStatus",
                "==",
                "refund_pending"
            ),
            where(
                "refundStatus",
                "==",
                "approved"
            ),
            orderBy(
                "refundApprovedAt",
                "desc"
            ),
            limit(100)
        );

    const snapshot =
        await getDocs(
            bookingsQuery
        );

    const requests: AdminRefundRequest[] =
        [];

    for (
        const bookingDoc of snapshot.docs
    ) {
        const booking =
            bookingDoc.data();

        const bookingId =
            bookingDoc.id;

        /*
         * PostJobRequests uses the same
         * booking ID in the current backend.
         */

        const postJobQuery =
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
                postJobQuery
            );

        if (
            postJobSnapshot.empty
        ) {
            continue;
        }

        const postJobDoc =
            postJobSnapshot.docs[0];

        const postJob =
            postJobDoc.data();

        /*
         * Both sides should be approved.
         */

        if (
            postJob.paymentStatus !==
                "refund_pending" ||
            postJob.refundStatus !==
                "approved"
        ) {
            continue;
        }

        /*
         * Load escrow.
         */

        let escrow:
            | Record<
                  string,
                  unknown
              >
            | null = null;

        const escrowQuery =
            query(
                collection(
                    db,
                    "Escrows"
                ),
                where(
                    "__name__",
                    "==",
                    bookingId
                ),
                limit(1)
            );

        const escrowSnapshot =
            await getDocs(
                escrowQuery
            );

        if (
            !escrowSnapshot.empty
        ) {
            escrow =
                escrowSnapshot.docs[0].data();
        }

        /*
         * Load active disputes.
         */

        const disputesQuery =
            query(
                collection(
                    db,
                    "Disputes"
                ),
                where(
                    "bookingId",
                    "==",
                    bookingId
                )
            );

        const disputesSnapshot =
            await getDocs(
                disputesQuery
            );

        const activeDisputes: AdminRefundDispute[] =
            disputesSnapshot.docs
                .map(
                    (disputeDoc) => {
                        const dispute =
                            disputeDoc.data();

                        return {
                            disputeId:
                                disputeDoc.id,

                            bookingId,

                            reportedBy:
                                getString(
                                    dispute.reportedBy
                                ),

                            reportedByRole:
                                getString(
                                    dispute.reportedByRole
                                ),

                            clientId:
                                getString(
                                    dispute.clientId
                                ),

                            freelancerId:
                                getString(
                                    dispute.freelancerId
                                ),

                            category:
                                getString(
                                    dispute.category
                                ),

                            description:
                                getString(
                                    dispute.description
                                ),

                            status:
                                getString(
                                    dispute.status
                                ),

                            evidenceCount:
                                Array.isArray(
                                    dispute.evidence
                                )
                                    ? dispute.evidence.length
                                    : 0,

                            createdAt:
                                toDate(
                                    dispute.createdAt
                                ),

                            updatedAt:
                                toDate(
                                    dispute.updatedAt
                                ),
                        };
                    }
                )
                .filter(
                    (dispute) =>
                        dispute.status ===
                            "pending" ||
                        dispute.status ===
                            "under_review"
                );

        requests.push({
            bookingId,

            clientId:
                getString(
                    booking.clientId ??
                        postJob.clientId
                ),

            freelancerId:
                getString(
                    booking.freelancerId ??
                        postJob.freelancerId
                ),

            bookingStatus:
                getString(
                    booking.status
                ),

            paymentStatus:
                getString(
                    booking.paymentStatus
                ),

            refundStatus:
                getString(
                    booking.refundStatus
                ),

            price:
                getNumber(
                    booking.price ??
                        postJob.price
                ),

            cancellationReason:
                getString(
                    booking.cancellationReason ??
                        postJob.cancellationReason
                ),

            cancelledAt:
                toDate(
                    booking.cancelledAt ??
                        postJob.cancelledAt
                ),

            cancelledBy:
                getString(
                    booking.cancelledBy ??
                        postJob.cancelledBy
                ),

            refundRequestedAt:
                toDate(
                    booking.refundRequestedAt ??
                        postJob.refundRequestedAt
                ),

            refundRequestedBy:
                getString(
                    booking.refundRequestedBy ??
                        postJob.refundRequestedBy
                ),

            refundApprovedAt:
                toDate(
                    booking.refundApprovedAt ??
                        postJob.refundApprovedAt
                ),

            refundApprovedBy:
                getString(
                    booking.refundApprovedBy ??
                        postJob.refundApprovedBy
                ),

            refundProcessedAt:
                toDate(
                    booking.refundProcessedAt ??
                        postJob.refundProcessedAt
                ),

            refundProcessedBy:
                getString(
                    booking.refundProcessedBy ??
                        postJob.refundProcessedBy
                ),

            refundReference:
                getString(
                    booking.refundReference ??
                        postJob.refundReference
                ),

            hasActiveDispute:
                activeDisputes.length >
                0,

            activeDisputeCount:
                activeDisputes.length,

            activeDisputes,

            booking: {
                id: bookingId,
                ...booking,
            },

            postJob: {
                id: bookingId,
                ...postJob,
            },

            escrow,
        });
    }

    return requests;
}

/* ==========================================================================
   APPROVE REFUND REQUEST
============================================================================= */

export async function approveRefundRequest(
    bookingId: string
): Promise<AdminRefundActionResult> {
    const cleanBookingId =
        bookingId.trim();

    if (!cleanBookingId) {
        throw new Error(
            "Booking ID is required."
        );
    }

    const callable =
        httpsCallable<
            {
                bookingId: string;
            },
            AdminRefundActionResult
        >(
            functions,
            "approveRefundRequest"
        );

    const result =
        await callable({
            bookingId:
                cleanBookingId,
        });

    return result.data;
}

/* ==========================================================================
   MARK BOOKING REFUNDED
============================================================================= */

export async function markBookingRefunded(
    bookingId: string,
    refundReference: string
): Promise<AdminRefundActionResult> {
    const cleanBookingId =
        bookingId.trim();

    const cleanRefundReference =
        refundReference.trim();

    if (!cleanBookingId) {
        throw new Error(
            "Booking ID is required."
        );
    }

    if (!cleanRefundReference) {
        throw new Error(
            "Refund reference is required."
        );
    }

    const callable =
        httpsCallable<
            {
                bookingId: string;
                refundReference: string;
            },
            AdminRefundActionResult
        >(
            functions,
            "markBookingRefunded"
        );

    const result =
        await callable({
            bookingId:
                cleanBookingId,

            refundReference:
                cleanRefundReference,
        });

    return result.data;
}

/* ==========================================================================
   MAP REFUND REQUEST
============================================================================= */

function mapRefundRequest(
    value: Record<string, unknown>
): AdminRefundRequest {
    const booking =
        (
            value.booking ??
            {}
        ) as Record<
            string,
            unknown
        >;

    const postJob =
        (
            value.postJob ??
            {}
        ) as Record<
            string,
            unknown
        >;

    const activeDisputes =
        getActiveDisputes(
            value.activeDisputes
        );

    const escrow =
        value.escrow &&
        typeof value.escrow ===
            "object"
            ? (
                  value.escrow as Record<
                      string,
                      unknown
                  >
              )
            : null;

    return {
        bookingId:
            getString(
                value.bookingId
            ) ?? "",

        clientId:
            getString(
                value.clientId
            ),

        freelancerId:
            getString(
                value.freelancerId
            ),

        bookingStatus:
            getString(
                value.bookingStatus
            ),

        paymentStatus:
            getString(
                value.paymentStatus
            ),

        refundStatus:
            getString(
                value.refundStatus
            ),

        price:
            getNumber(
                value.price
            ),

        cancellationReason:
            getString(
                value.cancellationReason
            ),

        cancelledAt:
            toDate(
                value.cancelledAt
            ),

        cancelledBy:
            getString(
                value.cancelledBy
            ),

        refundRequestedAt:
            toDate(
                value.refundRequestedAt
            ),

        refundRequestedBy:
            getString(
                value.refundRequestedBy
            ),

        refundApprovedAt:
            toDate(
                value.refundApprovedAt
            ),

        refundApprovedBy:
            getString(
                value.refundApprovedBy
            ),

        refundProcessedAt:
            toDate(
                value.refundProcessedAt
            ),

        refundProcessedBy:
            getString(
                value.refundProcessedBy
            ),

        refundReference:
            getString(
                value.refundReference
            ),

        hasActiveDispute:
            value.hasActiveDispute ===
            true,

        activeDisputeCount:
            typeof value.activeDisputeCount ===
            "number"
                ? value.activeDisputeCount
                : activeDisputes.length,

        activeDisputes,

        booking,

        postJob,

        escrow,
    };
}