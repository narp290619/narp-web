import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type AdminDisputeStatus =
    | "pending"
    | "under_review"
    | "resolved";

export type AdminDisputeEvidence = {
    url?: string;
    downloadUrl?: string;
    type?: string;
    contentType?: string;
    name?: string;
    fileName?: string;
};

export type AdminDispute = {
    disputeId: string;

    bookingId: string;

    reportedBy: string;

    reportedByRole: string;

    clientId: string;

    freelancerId: string;

    category: string;

    description: string;

    evidence: AdminDisputeEvidence[];

    status: AdminDisputeStatus;

    reviewedBy: string | null;

    reviewedAt: Date | null;

    resolution: string | null;

    resolutionNote: string | null;

    createdAt: Date | null;

    updatedAt: Date | null;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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

function getString(
    value: unknown,
    fallback = ""
): string {
    return typeof value === "string"
        ? value
        : fallback;
}

function getNullableString(
    value: unknown
): string | null {
    return typeof value === "string"
        ? value
        : null;
}

/* -------------------------------------------------------------------------- */
/* Map Firestore document                                                     */
/* -------------------------------------------------------------------------- */

function mapAdminDispute(
    document: {
        id: string;
        data: () => Record<string, unknown>;
    }
): AdminDispute {
    const data = document.data();

    const rawStatus =
        getString(
            data.status,
            "pending"
        );

    const status: AdminDisputeStatus =
        rawStatus === "under_review"
            ? "under_review"
            : rawStatus === "resolved"
                ? "resolved"
                : "pending";

    const rawEvidence =
        Array.isArray(data.evidence)
            ? data.evidence
            : [];

    const evidence: AdminDisputeEvidence[] =
        rawEvidence
            .filter(
                (
                    item
                ): item is Record<string, unknown> =>
                    item !== null &&
                    typeof item === "object"
            )
            .map((item) => ({
                url:
                    typeof item.url === "string"
                        ? item.url
                        : undefined,

                downloadUrl:
                    typeof item.downloadUrl ===
                    "string"
                        ? item.downloadUrl
                        : undefined,

                type:
                    typeof item.type === "string"
                        ? item.type
                        : undefined,

                contentType:
                    typeof item.contentType ===
                    "string"
                        ? item.contentType
                        : undefined,

                name:
                    typeof item.name === "string"
                        ? item.name
                        : undefined,

                fileName:
                    typeof item.fileName === "string"
                        ? item.fileName
                        : undefined,
            }));

    return {
        disputeId:
            getString(
                data.disputeId,
                document.id
            ),

        bookingId:
            getString(data.bookingId),

        reportedBy:
            getString(data.reportedBy),

        reportedByRole:
            getString(data.reportedByRole),

        clientId:
            getString(data.clientId),

        freelancerId:
            getString(data.freelancerId),

        category:
            getString(data.category),

        description:
            getString(data.description),

        evidence,

        status,

        reviewedBy:
            getNullableString(
                data.reviewedBy
            ),

        reviewedAt:
            getTimestampDate(
                data.reviewedAt
            ),

        resolution:
            getNullableString(
                data.resolution
            ),

        resolutionNote:
            getNullableString(
                data.resolutionNote
            ),

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

/* -------------------------------------------------------------------------- */
/* Get all disputes                                                           */
/* -------------------------------------------------------------------------- */

export async function getAdminDisputes(
    status?: AdminDisputeStatus
): Promise<AdminDispute[]> {
    const disputesRef =
        collection(
            db,
            "Disputes"
        );

    let disputesQuery;

    if (status) {
        disputesQuery = query(
            disputesRef,
            where(
                "status",
                "==",
                status
            ),
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(50)
        );
    } else {
        disputesQuery = query(
            disputesRef,
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(50)
        );
    }

    const snapshot =
        await getDocs(
            disputesQuery
        );

    return snapshot.docs.map(
        (document) =>
            mapAdminDispute({
                id: document.id,
                data: () =>
                    document.data(),
            })
    );
}

/* -------------------------------------------------------------------------- */
/* Get single dispute                                                         */
/* -------------------------------------------------------------------------- */

export async function getAdminDispute(
    disputeId: string
): Promise<AdminDispute | null> {
    if (!disputeId.trim()) {
        return null;
    }

    const disputeRef =
        doc(
            db,
            "Disputes",
            disputeId
        );

    const snapshot =
        await getDoc(
            disputeRef
        );

    if (!snapshot.exists()) {
        return null;
    }

    return mapAdminDispute({
        id: snapshot.id,
        data: () =>
            snapshot.data(),
    });
}