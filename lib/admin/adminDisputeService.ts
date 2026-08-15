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

/* ==========================================================================
   TYPES
============================================================================= */

export type AdminDisputeStatus =
    | "pending"
    | "under_review"
    | "resolved";

/* --------------------------------------------------------------------------
   Evidence
----------------------------------------------------------------------------- */

export type AdminDisputeEvidence = {
    url?: string;
    downloadUrl?: string;

    type?: string;
    contentType?: string;

    name?: string;
    fileName?: string;
    originalName?: string;

    path?: string;

    sha256?: string;

    size?: number;
};

/* --------------------------------------------------------------------------
   Individual report
----------------------------------------------------------------------------- */

export type AdminDisputeReport = {
    reportedBy: string;

    reportedByRole:
        | "client"
        | "freelancer"
        | string;

    category: string;

    description: string;

    createdAt: Date | null;

    evidence: AdminDisputeEvidence[];
};

/* --------------------------------------------------------------------------
   Dispute
----------------------------------------------------------------------------- */

export type AdminDispute = {
    disputeId: string;

    bookingId: string;

    /*
     * Original/top-level report information.
     *
     * These are retained because your existing dispute documents
     * contain these fields.
     */
    reportedBy: string;

    reportedByRole: string;

    clientId: string;

    freelancerId: string;

    category: string;

    description: string;

    /*
     * IMPORTANT:
     *
     * All actual reports submitted by the parties are stored here.
     *
     * Each report has its OWN evidence array.
     */
    reports: AdminDisputeReport[];

    status: AdminDisputeStatus;

    reviewedBy: string | null;

    reviewedAt: Date | null;

    resolution: string | null;

    resolutionNote: string | null;

    refundAmount: number | null;

    createdAt: Date | null;

    updatedAt: Date | null;
};

/* ==========================================================================
   FIRESTORE HELPERS
============================================================================= */

/**
 * Convert a Firestore Timestamp into a JavaScript Date.
 */
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

/**
 * Safely get a string.
 */
function getString(
    value: unknown,
    fallback = ""
): string {
    return typeof value === "string"
        ? value
        : fallback;
}

/**
 * Safely get nullable string.
 */
function getNullableString(
    value: unknown
): string | null {
    return typeof value === "string"
        ? value
        : null;
}

/**
 * Safely get a number.
 */
function getNumber(
    value: unknown,
    fallback = 0
): number {
    if (
        typeof value === "number" &&
        Number.isFinite(value)
    ) {
        return value;
    }

    return fallback;
}

/**
 * Safely parse one evidence object.
 */
function mapEvidence(
    value: unknown
): AdminDisputeEvidence | null {
    if (
        value === null ||
        typeof value !== "object"
    ) {
        return null;
    }

    const item =
        value as Record<string, unknown>;

    return {
        url:
            typeof item.url === "string"
                ? item.url
                : undefined,

        downloadUrl:
            typeof item.downloadUrl === "string"
                ? item.downloadUrl
                : undefined,

        type:
            typeof item.type === "string"
                ? item.type
                : undefined,

        contentType:
            typeof item.contentType === "string"
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

        originalName:
            typeof item.originalName === "string"
                ? item.originalName
                : undefined,

        path:
            typeof item.path === "string"
                ? item.path
                : undefined,

        sha256:
            typeof item.sha256 === "string"
                ? item.sha256
                : undefined,

        size:
            typeof item.size === "number"
                ? item.size
                : undefined,
    };
}

/**
 * Safely parse one report.
 */
function mapReport(
    value: unknown
): AdminDisputeReport | null {
    if (
        value === null ||
        typeof value !== "object"
    ) {
        return null;
    }

    const report =
        value as Record<string, unknown>;

    /*
     * Evidence belongs to THIS report.
     */
    const rawEvidence =
        Array.isArray(report.evidence)
            ? report.evidence
            : [];

    const evidence =
        rawEvidence
            .map((item) =>
                mapEvidence(item)
            )
            .filter(
                (
                    item
                ): item is AdminDisputeEvidence =>
                    item !== null
            );

    return {
        reportedBy:
            getString(
                report.reportedBy
            ),

        reportedByRole:
            getString(
                report.reportedByRole
            ),

        category:
            getString(
                report.category
            ),

        description:
            getString(
                report.description
            ),

        createdAt:
            getTimestampDate(
                report.createdAt
            ),

        evidence,
    };
}

/* ==========================================================================
   MAP FIRESTORE DOCUMENT
============================================================================= */

function mapAdminDispute(
    document: {
        id: string;
        data: () => Record<string, unknown>;
    }
): AdminDispute {
    const data =
        document.data();

    /* ----------------------------------------------------------------------
       STATUS
    ---------------------------------------------------------------------- */

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

    /* ----------------------------------------------------------------------
       REPORTS
    ---------------------------------------------------------------------- */

    const rawReports =
        Array.isArray(data.reports)
            ? data.reports
            : [];

    const reports =
        rawReports
            .map((item) =>
                mapReport(item)
            )
            .filter(
                (
                    item
                ): item is AdminDisputeReport =>
                    item !== null
            );

    /* ----------------------------------------------------------------------
       RETURN
    ---------------------------------------------------------------------- */

    return {
        disputeId:
            getString(
                data.disputeId,
                document.id
            ),

        bookingId:
            getString(
                data.bookingId
            ),

        /*
         * Top-level dispute information.
         */
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

        /*
         * Individual reports.
         */
        reports,

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

        refundAmount:
            typeof data.refundAmount === "number"
                ? data.refundAmount
                : null,

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
   GET ALL DISPUTES
============================================================================= */

export async function getAdminDisputes(
    status?: AdminDisputeStatus
): Promise<AdminDispute[]> {
    const disputesRef =
        collection(
            db,
            "Disputes"
        );

    let disputesQuery;

    /* ----------------------------------------------------------------------
       Filter by status
    ---------------------------------------------------------------------- */

    if (status) {
        disputesQuery =
            query(
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
    }

    /* ----------------------------------------------------------------------
       All statuses
    ---------------------------------------------------------------------- */

    else {
        disputesQuery =
            query(
                disputesRef,

                orderBy(
                    "createdAt",
                    "desc"
                ),

                limit(50)
            );
    }

    /* ----------------------------------------------------------------------
       Execute query
    ---------------------------------------------------------------------- */

    const snapshot =
        await getDocs(
            disputesQuery
        );

    /* ----------------------------------------------------------------------
       Map documents
    ---------------------------------------------------------------------- */

    return snapshot.docs.map(
        (document) =>
            mapAdminDispute({
                id:
                    document.id,

                data: () =>
                    document.data(),
            })
    );
}

/* ==========================================================================
   GET SINGLE DISPUTE
============================================================================= */

export async function getAdminDispute(
    disputeId: string
): Promise<AdminDispute | null> {
    const trimmedId =
        disputeId.trim();

    if (!trimmedId) {
        return null;
    }

    /* ----------------------------------------------------------------------
       Reference
    ---------------------------------------------------------------------- */

    const disputeRef =
        doc(
            db,
            "Disputes",
            trimmedId
        );

    /* ----------------------------------------------------------------------
       Get document
    ---------------------------------------------------------------------- */

    const snapshot =
        await getDoc(
            disputeRef
        );

    /* ----------------------------------------------------------------------
       Not found
    ---------------------------------------------------------------------- */

    if (!snapshot.exists()) {
        return null;
    }

    /* ----------------------------------------------------------------------
       Map document
    ---------------------------------------------------------------------- */

    return mapAdminDispute({
        id:
            snapshot.id,

        data: () =>
            snapshot.data(),
    });
}