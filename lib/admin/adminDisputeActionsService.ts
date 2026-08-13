import {
    httpsCallable,
} from "firebase/functions";

import { functions } from "@/lib/firebase";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type AdminDisputeResolution =
    | "refund_client"
    | "pay_freelancer"
    | "partial_refund"
    | "no_action";

export type AdminDisputeActionResult = {
    success: boolean;

    dispute: {
        disputeId: string;
        bookingId: string;
        reportedBy: string;
        reportedByRole: string;
        clientId: string;
        freelancerId: string;
        category: string;
        description: string;
        evidence: unknown[];
        status: string;
        reviewedBy: string | null;
        reviewedAt: unknown;
        resolution: string | null;
        resolutionNote: string | null;
        refundAmount: number | null;
        createdAt: unknown;
        updatedAt: unknown;
    };
};

/* -------------------------------------------------------------------------- */
/* Start Dispute Review                                                       */
/* -------------------------------------------------------------------------- */

export async function startDisputeReview(
    disputeId: string
): Promise<AdminDisputeActionResult> {
    const normalizedDisputeId =
        disputeId.trim();

    if (!normalizedDisputeId) {
        throw new Error(
            "Dispute ID is required."
        );
    }

    const callable =
        httpsCallable<
            {
                disputeId: string;
            },
            AdminDisputeActionResult
        >(
            functions,
            "startDisputeReview"
        );

    const result =
        await callable({
            disputeId:
                normalizedDisputeId,
        });

    return result.data;
}

/* -------------------------------------------------------------------------- */
/* Resolve Dispute                                                            */
/* -------------------------------------------------------------------------- */

export async function resolveDispute(
    disputeId: string,
    resolution: AdminDisputeResolution,
    resolutionNote: string,
    parsedRefundAmount: number
): Promise<AdminDisputeActionResult> {
    const normalizedDisputeId =
        disputeId.trim();

    const normalizedResolutionNote =
        resolutionNote.trim();

    if (!normalizedDisputeId) {
        throw new Error(
            "Dispute ID is required."
        );
    }

    if (!resolution) {
        throw new Error(
            "Resolution is required."
        );
    }

    /* ---------------------------------------------------------------------- */
    /* Validate refund amount on the client before calling Firebase           */
    /* ---------------------------------------------------------------------- */

    if (
        resolution === "refund_client" ||
        resolution === "partial_refund"
    ) {
        if (
            !Number.isFinite(
                parsedRefundAmount
            ) ||
            parsedRefundAmount <= 0
        ) {
            throw new Error(
                "A valid refund amount greater than zero is required."
            );
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Callable                                                                */
    /* ---------------------------------------------------------------------- */

    const callable =
        httpsCallable<
            {
                disputeId: string;
                resolution: AdminDisputeResolution;
                resolutionNote: string;
                refundAmount: number | null;
            },
            AdminDisputeActionResult
        >(
            functions,
            "resolveDispute"
        );

    /* ---------------------------------------------------------------------- */
    /* Payload                                                                 */
    /* ---------------------------------------------------------------------- */

    const result =
        await callable({
            disputeId:
                normalizedDisputeId,

            resolution,

            resolutionNote:
                normalizedResolutionNote,

            refundAmount:
                resolution ===
                    "refund_client" ||
                resolution ===
                    "partial_refund"
                    ? parsedRefundAmount
                    : null,
        });

    return result.data;
}