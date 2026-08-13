"use client";

import { useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    ChevronRight,
    Clock,
    FileWarning,
    RefreshCw,
    Search,
} from "lucide-react";

import {
    getAdminDisputes,
    type AdminDispute,
} from "@/lib/admin/adminDisputeService";

type DisputeStatus =
    | "all"
    | "pending"
    | "under_review"
    | "resolved";

const STATUS_TABS: {
    value: DisputeStatus;
    label: string;
}[] = [
    {
        value: "all",
        label: "All",
    },
    {
        value: "pending",
        label: "Pending",
    },
    {
        value: "under_review",
        label: "Under Review",
    },
    {
        value: "resolved",
        label: "Resolved",
    },
];

export default function AdminDisputesPage() {
    const [status, setStatus] =
        useState<DisputeStatus>("pending");

    const [disputes, setDisputes] =
        useState<AdminDispute[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState("");

    async function loadDisputes(
        selectedStatus: DisputeStatus = status
    ) {
        try {
            setLoading(true);
            setError(null);

            const result =
                await getAdminDisputes(
                    selectedStatus === "all"
                        ? undefined
                        : selectedStatus
                );

            setDisputes(result);
        } catch (error) {
            console.error(
                "Failed to load admin disputes:",
                error
            );

            setError(
                "Unable to load disputes."
            );

            setDisputes([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDisputes(status);
    }, [status]);

    const filteredDisputes =
        useMemo(() => {
            const value =
                search
                    .trim()
                    .toLowerCase();

            if (!value) {
                return disputes;
            }

            return disputes.filter(
                (dispute) =>
                    dispute.disputeId
                        .toLowerCase()
                        .includes(value) ||
                    dispute.bookingId
                        .toLowerCase()
                        .includes(value) ||
                    dispute.reportedBy
                        .toLowerCase()
                        .includes(value) ||
                    dispute.clientId
                        .toLowerCase()
                        .includes(value) ||
                    dispute.freelancerId
                        .toLowerCase()
                        .includes(value) ||
                    dispute.category
                        .toLowerCase()
                        .includes(value) ||
                    dispute.description
                        .toLowerCase()
                        .includes(value)
            );
        }, [disputes, search]);

    return (
        <main className="min-h-screen bg-slate-50">
            {/* =====================================================
                HEADER
            ====================================================== */}

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        NARP Administration
                    </p>

                    <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Disputes
                            </h1>

                            <p className="mt-2 text-slate-500">
                                Review and manage disputes submitted by users.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                loadDisputes(status)
                            }
                            disabled={loading}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                shadow-sm
                                transition
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
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

            {/* =====================================================
                CONTENT
            ====================================================== */}

            <section className="mx-auto max-w-7xl px-6 py-8">
                {/* =================================================
                    STATUS TABS
                ================================================== */}

                <div className="overflow-x-auto">
                    <div className="inline-flex min-w-full rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:min-w-0">
                        {STATUS_TABS.map(
                            (tab) => {
                                const active =
                                    status ===
                                    tab.value;

                                return (
                                    <button
                                        key={
                                            tab.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            setStatus(
                                                tab.value
                                            )
                                        }
                                        className={`
                                            whitespace-nowrap
                                            rounded-lg
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            transition
                                            ${
                                                active
                                                    ? "bg-blue-600 text-white shadow-sm"
                                                    : "text-slate-600 hover:bg-slate-100"
                                            }
                                        `}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* =================================================
                    SEARCH
                ================================================== */}

                <div className="mt-6">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search dispute, booking, user, or category..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                py-3
                                pl-11
                                pr-4
                                text-sm
                                text-slate-900
                                outline-none
                                shadow-sm
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />
                    </div>
                </div>

                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div
                        className="
                            mt-6
                            flex
                            flex-col
                            gap-4
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />

                            <div>
                                <p className="text-sm font-semibold text-red-800">
                                    Unable to load disputes
                                </p>

                                <p className="mt-1 text-sm text-red-700">
                                    {error}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                loadDisputes(status)
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-white
                                px-3
                                py-2
                                text-sm
                                font-semibold
                                text-red-700
                                shadow-sm
                                transition
                                hover:bg-red-100
                            "
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                        </button>
                    </div>
                )}

                {/* =================================================
                    SUMMARY
                ================================================== */}

                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {getStatusTitle(
                                status
                            )}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {loading
                                ? "Loading disputes..."
                                : `${filteredDisputes.length} dispute${
                                      filteredDisputes.length ===
                                      1
                                          ? ""
                                          : "s"
                                  }`}
                        </p>
                    </div>
                </div>

                {/* =================================================
                    LOADING
                ================================================== */}

                {loading && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {Array.from({
                            length: 5,
                        }).map(
                            (_, index) => (
                                <DisputeSkeleton
                                    key={index}
                                />
                            )
                        )}
                    </div>
                )}

                {/* =================================================
                    EMPTY
                ================================================== */}

                {!loading &&
                    filteredDisputes.length ===
                        0 && (
                        <div
                            className="
                                mt-5
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                px-6
                                py-16
                                text-center
                                shadow-sm
                            "
                        >
                            <FileWarning className="mx-auto h-10 w-10 text-slate-300" />

                            <h3 className="mt-4 text-base font-bold text-slate-900">
                                No disputes found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                There are no disputes matching the selected status or search.
                            </p>
                        </div>
                    )}

                {/* =================================================
                    DISPUTE LIST
                ================================================== */}

                {!loading &&
                    filteredDisputes.length >
                        0 && (
                        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="divide-y divide-slate-100">
                                {filteredDisputes.map(
                                    (
                                        dispute
                                    ) => (
                                        <DisputeRow
                                            key={
                                                dispute.disputeId
                                            }
                                            dispute={
                                                dispute
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}
            </section>
        </main>
    );
}

/* ==========================================================================
   DISPUTE ROW
============================================================================= */

function DisputeRow({
    dispute,
}: {
    dispute: AdminDispute;
}) {
    return (
        <button
            type="button"
            onClick={() => {
                window.location.href =
                    `/admin/disputes/${encodeURIComponent(
                        dispute.disputeId
                    )}`;
            }}
            className="
                group
                flex
                w-full
                flex-col
                gap-5
                px-6
                py-5
                text-left
                transition
                hover:bg-slate-50
                sm:flex-row
                sm:items-center
            "
        >
            {/* Icon */}

            <div
                className="
                    flex
                    h-11
                    w-11
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-50
                "
            >
                <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            {/* Main */}

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">
                        {dispute.category ||
                            "Dispute"}
                    </p>

                    <StatusBadge
                        status={
                            dispute.status
                        }
                    />
                </div>

                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {dispute.description ||
                        "No description provided."}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
                    <span>
                        Booking:{" "}
                        <span className="font-medium text-slate-500">
                            {dispute.bookingId ||
                                "—"}
                        </span>
                    </span>

                    <span>
                        Reported by:{" "}
                        <span className="font-medium text-slate-500">
                            {dispute.reportedBy ||
                                "—"}
                        </span>
                    </span>

                    <span>
                        {formatDate(
                            dispute.createdAt
                        )}
                    </span>
                </div>
            </div>

            {/* Evidence */}

            {dispute.evidence.length >
                0 && (
                <div className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 md:flex">
                    <FileWarning className="h-3.5 w-3.5" />

                    {dispute.evidence.length}{" "}
                    evidence
                    {dispute.evidence.length ===
                    1
                        ? ""
                        : "s"}
                </div>
            )}

            {/* Arrow */}

            <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500" />
        </button>
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
        getStatusConfig(status);

    const Icon = config.icon;

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
                icon: FileWarning,
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
   SKELETON
============================================================================= */

function DisputeSkeleton() {
    return (
        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />

            <div className="flex-1">
                <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />

                <div className="mt-2 h-3 w-full max-w-xl animate-pulse rounded bg-slate-100" />

                <div className="mt-3 h-3 w-72 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="h-5 w-5 animate-pulse rounded bg-slate-100" />
        </div>
    );
}

/* ==========================================================================
   HELPERS
============================================================================= */

function getStatusTitle(
    status: DisputeStatus
) {
    switch (status) {
        case "pending":
            return "Pending Disputes";

        case "under_review":
            return "Disputes Under Review";

        case "resolved":
            return "Resolved Disputes";

        default:
            return "All Disputes";
    }
}

function formatStatus(
    status: string
) {
    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
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
