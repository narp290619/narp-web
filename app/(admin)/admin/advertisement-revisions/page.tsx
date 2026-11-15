
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    collection,
    doc,
    getDocs,
    getDoc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import {
    BadgeCheck,
    RefreshCw,
    Clock,
    CheckCircle2,
    XCircle,
    Image as ImageIcon,
    AlertCircle,
    History,
    Eye,
    Building2,
    UserRound,
} from "lucide-react";

import { appCheck, db, functions } from "@/lib/firebase";
import { getInstallationId } from "@/lib/session";
import { getToken } from "firebase/app-check";

type Data = Record<string, unknown>;

type RevisionItem = {
    id: string;
    advertisementId: string;
    advertiserId: string;
    advertiserType: string;
    status: string;
    title: string;
    description: string;
    businessName?: string;
    businessDescription?: string;
    imageChanged: boolean;
    imageStoragePath?: string;
    submittedAt: Date | null;
    data: Data;
    advertisement: Data;
};

type HistoryItem = {
    id: string;
    status: string;
    title: string;
    submittedAt: Date | null;
    rejectionReason?: string;
};

function getString(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function getDate(value: unknown): Date | null {
    if (
        value &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof (value as { toDate?: unknown }).toDate === "function"
    ) {
        return (value as { toDate: () => Date }).toDate();
    }

    return value instanceof Date ? value : null;
}

function formatDate(value: Date | null) {
    if (!value) return "—";

    return value.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function formatCurrency(value: unknown) {
    if (typeof value !== "number") return "—";

    return value.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });
}

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    const styles =
        normalized === "approved"
            ? "bg-green-50 text-green-700"
            : normalized === "rejected"
                ? "bg-red-50 text-red-700"
                : "bg-orange-50 text-orange-700";

    const Icon =
        normalized === "approved"
            ? CheckCircle2
            : normalized === "rejected"
                ? XCircle
                : Clock;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}
        >
            <Icon className="h-3.5 w-3.5" />
            {status.replaceAll("_", " ")}
        </span>
    );
}

function DetailField({
    label,
    value,
}: {
    label: string;
    value: unknown;
}) {
    const display =
        typeof value === "string" && value.trim()
            ? value
            : "—";

    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-800">
                {display}
            </p>
        </div>
    );
}

function ImagePreview({
    src,
    label,
}: {
    src: string;
    label: string;
}) {
    return (
        <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
                {label}
            </p>

            {src ? (
                <a
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                    <img
                        src={src}
                        alt={label}
                        className="h-56 w-full object-contain"
                    />
                    <span className="flex items-center justify-center gap-2 border-t border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
                        <Eye className="h-3.5 w-3.5" />
                        Open full image
                    </span>
                </a>
            ) : (
                <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        No image available
                    </span>
                </div>
            )}
        </div>
    );
}

export default function AdvertisementRevisionsPage() {
    const [items, setItems] = useState<RevisionItem[]>([]);
    const [selectedId, setSelectedId] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [previewUrl, setPreviewUrl] = useState("");
    const [previewError, setPreviewError] = useState("");

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [rejecting, setRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const [search, setSearch] = useState("");

    const selected = useMemo(
        () => items.find((item) => item.id === selectedId) ?? null,
        [items, selectedId]
    );

    const filteredItems = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return items;

        return items.filter((item) =>
            [
                item.id,
                item.advertisementId,
                item.advertiserId,
                item.title,
                item.businessName,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(term)
        );
    }, [items, search]);


    const loadQueue = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            // Load advertisements using the existing admin access rules.
            const advertisementsSnapshot = await getDocs(
                collection(db, "Advertisements")
            );

            // Only advertisements with a pending revision are relevant.
            const pendingAdvertisements =
                advertisementsSnapshot.docs.filter((advertisementDoc) => {
                    const data = advertisementDoc.data();

                    return (
                        typeof data.pendingRevisionId === "string" &&
                        data.pendingRevisionId.trim().length > 0
                    );
                });

            // Fetch each pending revision from its actual parent document.
            const results: (RevisionItem | null)[] = await Promise.all(
                pendingAdvertisements.map(async (advertisementDoc) => {
                    const advertisementData = advertisementDoc.data();
                    const advertisementId = advertisementDoc.id;
                    const revisionId = getString(
                        advertisementData.pendingRevisionId
                    );

                    const revisionRef = doc(
                        db,
                        "Advertisements",
                        advertisementId,
                        "Revisions",
                        revisionId
                    );

                    const revisionSnapshot = await getDoc(revisionRef);

                    if (!revisionSnapshot.exists()) {
                        console.warn(
                            "Pending revision document not found:",
                            advertisementId,
                            revisionId
                        );

                        return null;
                    }

                    const revisionData = revisionSnapshot.data();

                    // Confirm that the revision still belongs to this ad.
                    if (
                        revisionData.advertisementId !== advertisementId ||
                        revisionData.revisionId !== revisionId ||
                        revisionData.status !== "pending_review"
                    ) {
                        console.warn(
                            "Pending revision pointer does not match revision:",
                            advertisementId,
                            revisionId
                        );

                        return null;
                    }

                    return {
                        id: revisionSnapshot.id,
                        advertisementId,
                        advertiserId: getString(
                            revisionData.advertiserId
                        ),
                        advertiserType: getString(
                            revisionData.advertiserType
                        ),
                        status: getString(revisionData.status),
                        title: getString(revisionData.title),
                        description: getString(
                            revisionData.description
                        ),
                        businessName: getString(
                            revisionData.businessName
                        ),
                        businessDescription: getString(
                            revisionData.businessDescription
                        ),
                        imageChanged:
                            revisionData.imageChanged === true,
                        imageStoragePath: getString(
                            revisionData.imageStoragePath
                        ),
                        submittedAt: getDate(
                            revisionData.submittedAt
                        ),
                        data: revisionData,
                        advertisement: advertisementData,
                    } satisfies RevisionItem;
                })
            );

            const loaded = results.filter(
                (item): item is RevisionItem => item !== null
            );

            loaded.sort(
                (a, b) =>
                    (b.submittedAt?.getTime() ?? 0) -
                    (a.submittedAt?.getTime() ?? 0)
            );

            setItems(loaded);

            setSelectedId((current) => {
                if (
                    current &&
                    loaded.some((item) => item.id === current)
                ) {
                    return current;
                }

                return loaded[0]?.id ?? "";
            });
        } catch (err) {
            console.error(
                "Failed to load advertisement revisions:",
                err
            );

            setError(
                err instanceof Error
                    ? `Unable to load revisions: ${err.message}`
                    : "Unable to load advertisement revisions. Check your admin access and Firestore rules."
            );
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        void loadQueue();
    }, [loadQueue]);

    useEffect(() => {
        let cancelled = false;

        async function loadPreview() {
            setPreviewUrl("");
            setPreviewError("");

            if (!selected?.imageChanged) return;

            try {
                setPreviewLoading(true);

                const callable = httpsCallable<
                    {
                        advertisementId: string;
                        revisionId: string;
                        installationId: string;
                        clientPlatform: "web";
                    },
                    {
                        success: boolean;
                        url: string;
                        expiresAt: number;
                    }
                >(
                    functions,
                    "getAdvertisementRevisionImageUrl"
                );

                const result = await callable({
                    advertisementId: selected.advertisementId,
                    revisionId: selected.id,
                    installationId: getInstallationId(),
                    clientPlatform: "web",
                });

                if (!cancelled) {
                    setPreviewUrl(result.data.url);
                }
            } catch (err: unknown) {
                console.error(
                    "Failed to load revision image preview:",
                    err
                );

                if (!cancelled) {
                    const firebaseError = err as {
                        code?: string;
                        message?: string;
                    };

                    setPreviewError(
                        `Preview failed: ${firebaseError.code ?? 'unknown'} - ${firebaseError.message ?? 'Unknown error'
                        }`
                    );
                }
            } finally {
                if (!cancelled) {
                    setPreviewLoading(false);
                }
            }
        }

        void loadPreview();

        return () => {
            cancelled = true;
        };
    }, [selected]);

    useEffect(() => {
        let cancelled = false;

        async function loadHistory() {
            setHistory([]);

            if (!selected?.advertisementId) return;

            try {
                const historyRef = collection(
                    db,
                    "Advertisements",
                    selected.advertisementId,
                    "Revisions"
                );

                const snapshot = await getDocs(historyRef);

                const records: HistoryItem[] =
                    snapshot.docs.map((document) => {
                        const data = document.data();

                        return {
                            id: document.id,
                            status: getString(data.status),
                            title: getString(data.title),
                            submittedAt: getDate(
                                data.submittedAt
                            ),
                            rejectionReason: getString(
                                data.rejectionReason
                            ),
                        };
                    });

                records.sort(
                    (a, b) =>
                        (b.submittedAt?.getTime() ?? 0) -
                        (a.submittedAt?.getTime() ?? 0)
                );

                if (!cancelled) {
                    setHistory(records);
                }
            } catch (err) {
                console.error(
                    "Failed to load revision history:",
                    err
                );
            }
        }

        void loadHistory();

        return () => {
            cancelled = true;
        };
    }, [selected]);


    async function approveRevision() {
        if (!selected || actionLoading) return;

        const confirmed = window.confirm(
            "Approve this revision and publish its proposed changes?"
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);
            setError("");
            setNotice("");

            const callable = httpsCallable(
                functions,
                "approveAdvertisementRevision"
            );

            await callable({
                advertisementId: selected.advertisementId,
                revisionId: selected.id,
                installationId: getInstallationId(),
                clientPlatform: "web",
            });

            setNotice(
                "Advertisement revision approved and published successfully."
            );

            setRejecting(false);
            setRejectionReason("");

            await loadQueue();
        } catch (err: unknown) {
            console.error(
                "Failed to approve advertisement revision:",
                err
            );

            const firebaseError = err as {
                code?: unknown;
                message?: unknown;
            };

            const errorCode =
                typeof firebaseError.code === "string"
                    ? firebaseError.code
                    : "unknown";

            const errorMessage =
                typeof firebaseError.message === "string"
                    ? firebaseError.message
                    : "An unexpected error occurred.";

            console.error("Approval error code:", errorCode);
            console.error("Approval error message:", errorMessage);

            setError(
                `Approval failed (${errorCode}): ${errorMessage}`
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function rejectRevision() {
        if (!selected || actionLoading) return;

        const reason = rejectionReason.trim();

        if (reason.length < 5 || reason.length > 1000) {
            setError(
                "The rejection reason must contain between 5 and 1,000 characters."
            );
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setNotice("");

            const callable = httpsCallable(
                functions,
                "rejectAdvertisementRevision"
            );

            await callable({
                advertisementId: selected.advertisementId,
                revisionId: selected.id,
                rejectionReason: reason,
                installationId: getInstallationId(),
                clientPlatform: "web",
            });

            setNotice(
                "Revision rejected. The existing published advertisement remains unchanged."
            );

            setRejecting(false);
            setRejectionReason("");

            await loadQueue();
        } catch (err) {
            console.error(
                "Failed to reject advertisement revision:",
                err
            );

            setError(
                "Unable to reject this revision. Refresh and try again."
            );
        } finally {
            setActionLoading(false);
        }
    }

    const current = selected?.advertisement;
    const proposed = selected?.data;

    const currentTitle = getString(current?.title);
    const currentDescription = getString(
        current?.description
    );

    const currentImageUrl = getString(current?.imageUrl);

    const currentBusinessName = getString(
        current?.businessName
    );

    const currentBusinessDescription = getString(
        current?.businessDescription
    );

    const proposedImageUrl = selected?.imageChanged
        ? previewUrl
        : currentImageUrl;

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                                <BadgeCheck className="h-5 w-5 text-blue-600" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Advertisement Revision Review
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review proposed changes before they are published.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadQueue()}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${loading ? "animate-spin" : ""
                                    }`}
                            />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                {notice && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                        {notice}
                    </div>
                )}

                {error && (
                    <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Pending Revisions
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {items.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Currently Displayed
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {filteredItems.length}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
                    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 p-4">
                            <h2 className="font-bold text-slate-900">
                                Pending Queue
                            </h2>

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search advertisement..."
                                className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
                            />
                        </div>

                        <div className="max-h-[750px] overflow-y-auto">
                            {loading ? (
                                <div className="space-y-3 p-4">
                                    {Array.from({ length: 4 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="h-24 animate-pulse rounded-xl bg-slate-100"
                                            />
                                        )
                                    )}
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="px-5 py-14 text-center">
                                    <CheckCircle2 className="mx-auto h-9 w-9 text-slate-300" />
                                    <p className="mt-3 text-sm font-semibold text-slate-700">
                                        No pending revisions
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        New submissions will appear here.
                                    </p>
                                </div>
                            ) : (
                                filteredItems.map((item) => (
                                    <button
                                        key={`${item.advertisementId}_${item.id}`}
                                        type="button"
                                        onClick={() => {
                                            setSelectedId(item.id);
                                            setRejecting(false);
                                            setError("");
                                            setNotice("");
                                        }}
                                        className={`block w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${selectedId === item.id
                                            ? "bg-blue-50"
                                            : "bg-white"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                                                {item.title || "Untitled advertisement"}
                                            </p>

                                            <span className="flex-shrink-0 rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-700">
                                                Pending
                                            </span>
                                        </div>

                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            {item.businessName ||
                                                item.advertiserId}
                                        </p>

                                        <p className="mt-2 text-xs text-slate-400">
                                            Ad ID: {item.advertisementId}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {formatDate(item.submittedAt)}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </aside>

                    <section className="min-w-0 space-y-6">
                        {!selected ? (
                            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
                                <Eye className="mx-auto h-10 w-10 text-slate-300" />
                                <h2 className="mt-4 font-semibold text-slate-800">
                                    Select a revision to review
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Choose an item from the pending queue.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                Revision Details
                                            </h2>
                                            <p className="mt-1 break-all text-xs text-slate-400">
                                                Revision ID: {selected.id}
                                            </p>
                                            <p className="mt-1 break-all text-xs text-slate-400">
                                                Advertisement ID: {selected.advertisementId}
                                            </p>
                                        </div>

                                        <StatusBadge status={selected.status} />
                                    </div>

                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        <DetailField
                                            label="Advertiser ID"
                                            value={selected.advertiserId}
                                        />
                                        <DetailField
                                            label="Advertiser Type"
                                            value={selected.advertiserType}
                                        />
                                        <DetailField
                                            label="Submitted"
                                            value={formatDate(selected.submittedAt)}
                                        />
                                        <DetailField
                                            label="Current Campaign Status"
                                            value={getString(current?.status)}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 xl:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-5">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Currently Published
                                            </p>
                                            <h3 className="mt-1 text-lg font-bold text-slate-900">
                                                Existing Version
                                            </h3>
                                        </div>

                                        <div className="space-y-5">
                                            <DetailField
                                                label="Title"
                                                value={currentTitle}
                                            />

                                            <DetailField
                                                label="Description"
                                                value={currentDescription}
                                            />

                                            {selected.advertiserType === "business" && (
                                                <>
                                                    <DetailField
                                                        label="Business Name"
                                                        value={currentBusinessName}
                                                    />
                                                    <DetailField
                                                        label="Business Description"
                                                        value={currentBusinessDescription}
                                                    />
                                                </>
                                            )}

                                            <ImagePreview
                                                src={currentImageUrl}
                                                label="Current Banner"
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
                                        <div className="mb-5">
                                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                                Proposed Changes
                                            </p>
                                            <h3 className="mt-1 text-lg font-bold text-slate-900">
                                                Submitted Revision
                                            </h3>
                                        </div>

                                        <div className="space-y-5">
                                            <DetailField
                                                label="Title"
                                                value={selected.title}
                                            />

                                            <DetailField
                                                label="Description"
                                                value={selected.description}
                                            />

                                            {selected.advertiserType === "business" && (
                                                <>
                                                    <DetailField
                                                        label="Business Name"
                                                        value={selected.businessName}
                                                    />
                                                    <DetailField
                                                        label="Business Description"
                                                        value={selected.businessDescription}
                                                    />
                                                </>
                                            )}

                                            {selected.imageChanged ? (
                                                previewLoading ? (
                                                    <div className="flex h-56 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
                                                        Loading replacement image...
                                                    </div>
                                                ) : previewError ? (
                                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                                        {previewError}
                                                    </div>
                                                ) : (
                                                    <ImagePreview
                                                        src={proposedImageUrl}
                                                        label="Replacement Banner"
                                                    />
                                                )
                                            ) : (
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        No image change
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        The existing banner will be retained.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <h3 className="font-bold text-slate-900">
                                        Campaign Information
                                    </h3>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        <DetailField
                                            label="Package"
                                            value={getString(current?.packageName)}
                                        />
                                        <DetailField
                                            label="Price"
                                            value={formatCurrency(current?.price)}
                                        />
                                        <DetailField
                                            label="Duration"
                                            value={
                                                typeof current?.durationDays === "number"
                                                    ? `${current.durationDays} days`
                                                    : "—"
                                            }
                                        />
                                        <DetailField
                                            label="Placement"
                                            value={getString(current?.placement)}
                                        />
                                        <DetailField
                                            label="Start Date"
                                            value={formatDate(getDate(current?.startAt))}
                                        />
                                        <DetailField
                                            label="End Date"
                                            value={formatDate(getDate(current?.endAt))}
                                        />
                                        <DetailField
                                            label="Payment Status"
                                            value={getString(current?.paymentStatus)}
                                        />
                                    </div>

                                    <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                                        Package, price, duration, placement, payment status, and campaign dates are not changed by revision approval.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <History className="h-5 w-5 text-slate-500" />
                                        <h3 className="font-bold text-slate-900">
                                            Revision History
                                        </h3>
                                    </div>

                                    {history.length === 0 ? (
                                        <p className="mt-4 text-sm text-slate-500">
                                            No revision history available.
                                        </p>
                                    ) : (
                                        <div className="mt-4 divide-y divide-slate-100">
                                            {history.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="py-4 first:pt-0 last:pb-0"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {item.title || "Untitled revision"}
                                                        </p>
                                                        <StatusBadge status={item.status} />
                                                    </div>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {formatDate(item.submittedAt)}
                                                    </p>

                                                    {item.rejectionReason && (
                                                        <p className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                                                            Rejection reason: {item.rejectionReason}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <h3 className="font-bold text-slate-900">
                                        Review Decision
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Approving publishes the proposed version. Rejecting preserves the existing published version.
                                    </p>

                                    {rejecting && (
                                        <div className="mt-5">
                                            <label
                                                htmlFor="rejectionReason"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Reason for rejection
                                            </label>

                                            <textarea
                                                id="rejectionReason"
                                                value={rejectionReason}
                                                onChange={(event) =>
                                                    setRejectionReason(
                                                        event.target.value
                                                    )
                                                }
                                                rows={4}
                                                maxLength={1000}
                                                placeholder="Explain why this proposed revision cannot be approved..."
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                                            />

                                            <p className="mt-1 text-right text-xs text-slate-400">
                                                {rejectionReason.trim().length}/1000
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                        {rejecting ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setRejecting(false);
                                                        setRejectionReason("");
                                                        setError("");
                                                    }}
                                                    disabled={actionLoading}
                                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => void rejectRevision()}
                                                    disabled={
                                                        actionLoading ||
                                                        rejectionReason.trim().length < 5
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    {actionLoading ? "Processing..." : "Confirm Rejection"}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setRejecting(true)}
                                                    disabled={actionLoading}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Reject Revision
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => void approveRevision()}
                                                    disabled={
                                                        actionLoading ||
                                                        previewLoading ||
                                                        (selected.imageChanged && !previewUrl)
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    {actionLoading ? "Processing..." : "Approve Revision"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
