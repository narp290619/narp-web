"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";

import {
    AlertTriangle,
    Ban,
    CheckCircle2,
    Clock3,
    Eye,
    FileWarning,
    RefreshCw,
    Search,
    ShieldAlert,
    User,
    X,
} from "lucide-react";

import { db, auth } from "@/lib/firebase";

/*

* =====================================================
* TYPES
* =====================================================
  */

type AdminReport = {
    id: string;


    createdAt?: Timestamp | null;

    message?: string;
    reason?: string;

    reportedUserBanned?: boolean;
    reportedUserId?: string;
    reportedUserName?: string;
    reportedUserPhoto?: string;

    reporterUserId?: string;
    reporterUserName?: string;

    reviewedAt?: Timestamp | null;
    reviewedBy?: string;

    status?: string;


};

/*

* =====================================================
* HELPERS
* =====================================================
  */

function formatDate(
    timestamp?: Timestamp | null
) {
    if (!timestamp) {
        return "—";
    }


    try {
        return timestamp
            .toDate()
            .toLocaleString(
                "en-SG",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );
    } catch {
        return "—";
    }


}

function formatStatus(
    status?: string
) {
    if (!status) {
        return "Unknown";
    }


    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );


}

function getStatusClasses(
    status?: string
) {
    switch (
    status?.toLowerCase()
    ) {
        case "pending":
            return "bg-amber-50 text-amber-700 ring-amber-600/20";


        case "reviewed":
            return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

        case "ignored":
            return "bg-slate-100 text-slate-600 ring-slate-500/20";

        case "rejected":
            return "bg-red-50 text-red-700 ring-red-600/20";

        default:
            return "bg-slate-100 text-slate-600 ring-slate-500/20";
    }


}

/*

* =====================================================
* PAGE
* =====================================================
  */

export default function AdminReportsPage() {


    const [
        reports,
        setReports,
    ] = useState<AdminReport[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

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
        actionError,
        setActionError,
    ] = useState<string | null>(
        null
    );

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [
        reasonFilter,
        setReasonFilter,
    ] = useState("all");

    const [
        userStatusFilter,
        setUserStatusFilter,
    ] = useState("all");

    const [
        selectedReport,
        setSelectedReport,
    ] = useState<AdminReport | null>(
        null
    );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const pageSize = 10;

    /*
     * =====================================================
     * LOAD REPORTS
     * =====================================================
     */

    const loadReports =
        async (
            showRefresh = false
        ) => {

            try {

                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError(null);

                const reportsQuery =
                    query(
                        collection(
                            db,
                            "AdminReports"
                        ),
                        orderBy(
                            "createdAt",
                            "desc"
                        )
                    );

                const snapshot =
                    await getDocs(
                        reportsQuery
                    );

                const loadedReports =
                    snapshot.docs.map(
                        (reportDoc) => ({
                            id: reportDoc.id,
                            ...reportDoc.data(),
                        }) as AdminReport
                    );

                setReports(
                    loadedReports
                );

            } catch (err) {

                console.error(
                    "Failed to load admin reports:",
                    err
                );

                setError(
                    "Unable to load reports. Please try again."
                );

            } finally {

                setLoading(false);
                setRefreshing(false);

            }
        };

    useEffect(() => {

        loadReports();

    }, []);

    /*
     * =====================================================
     * UNIQUE REASONS
     * =====================================================
     */

    const reasons =
        useMemo(() => {

            const values =
                reports
                    .map(
                        (report) =>
                            report.reason?.trim()
                    )
                    .filter(
                        (
                            reason
                        ): reason is string =>
                            Boolean(reason)
                    );

            return Array.from(
                new Set(values)
            ).sort();

        }, [
            reports,
        ]);

    /*
     * =====================================================
     * FILTER REPORTS
     * =====================================================
     */

    const filteredReports =
        useMemo(() => {

            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return reports.filter(
                (report) => {

                    /*
                     * STATUS
                     */

                    if (
                        statusFilter !==
                        "all" &&
                        report.status
                            ?.toLowerCase() !==
                        statusFilter
                    ) {
                        return false;
                    }

                    /*
                     * REASON
                     */

                    if (
                        reasonFilter !==
                        "all" &&
                        report.reason !==
                        reasonFilter
                    ) {
                        return false;
                    }

                    /*
                     * USER STATUS
                     */

                    if (
                        userStatusFilter ===
                        "banned" &&
                        report.reportedUserBanned !==
                        true
                    ) {
                        return false;
                    }

                    if (
                        userStatusFilter ===
                        "active" &&
                        report.reportedUserBanned ===
                        true
                    ) {
                        return false;
                    }

                    /*
                     * SEARCH
                     */

                    if (
                        normalizedSearch
                    ) {

                        const searchableText =
                            [
                                report.reporterUserName,
                                report.reporterUserId,
                                report.reportedUserName,
                                report.reportedUserId,
                                report.reason,
                                report.message,
                                report.status,
                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();

                        if (
                            !searchableText.includes(
                                normalizedSearch
                            )
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );

        }, [
            reports,
            search,
            statusFilter,
            reasonFilter,
            userStatusFilter,
        ]);

    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredReports.length /
                pageSize
            )
        );

    const safeCurrentPage =
        Math.min(
            currentPage,
            totalPages
        );

    const paginatedReports =
        filteredReports.slice(
            (
                safeCurrentPage - 1
            ) * pageSize,
            safeCurrentPage *
            pageSize
        );

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        statusFilter,
        reasonFilter,
        userStatusFilter,
    ]);

    /*
     * =====================================================
     * SUMMARY
     * =====================================================
     */

    const totalReports =
        reports.length;

    const pendingReports =
        reports.filter(
            (report) =>
                report.status
                    ?.toLowerCase() ===
                "pending"
        ).length;

    const reviewedReports =
        reports.filter(
            (report) =>
                report.status
                    ?.toLowerCase() ===
                "reviewed"
        ).length;

    const ignoredReports =
        reports.filter(
            (report) =>
                report.status
                    ?.toLowerCase() ===
                "ignored"
        ).length;

    const bannedUsers =
        reports.filter(
            (report) =>
                report.reportedUserBanned ===
                true
        ).length;

    /*
     * =====================================================
     * CLOSE REPORT
     * =====================================================
     */

    const closeReport =
        () => {

            if (actionLoading) {
                return;
            }

            setSelectedReport(
                null
            );

            setActionError(
                null
            );
        };

    /*
     * =====================================================
     * BAN USER
     * =====================================================
     */

    const banUser =
        async (
            report: AdminReport
        ) => {

            if (
                !report.reportedUserId
            ) {

                setActionError(
                    "The reported user ID is missing."
                );

                return;
            }

            const currentUser =
                auth.currentUser;

            if (!currentUser) {

                setActionError(
                    "You must be signed in as an administrator."
                );

                return;
            }

            const confirmed =
                window.confirm(
                    `Are you sure you want to ban ${report.reportedUserName || "this user"}?`
                );

            if (!confirmed) {
                return;
            }

            try {

                setActionLoading(
                    true
                );

                setActionError(
                    null
                );

                /*
                 * UPDATE USER
                 *
                 * Same behavior as Flutter:
                 *
                 * Users/{reportedUserId}
                 * banned = true
                 */

                await updateDoc(
                    doc(
                        db,
                        "Users",
                        report.reportedUserId
                    ),
                    {
                        banned: true,
                    }
                );

                /*
                 * UPDATE REPORT
                 *
                 * Same behavior as Flutter.
                 */

                await updateDoc(
                    doc(
                        db,
                        "AdminReports",
                        report.id
                    ),
                    {
                        reportedUserBanned:
                            true,

                        reviewedAt:
                            serverTimestamp(),

                        reviewedBy:
                            currentUser.uid,

                        status:
                            "reviewed",
                    }
                );

                /*
                 * REFRESH DATA
                 */

                await loadReports(
                    true
                );

                /*
                 * UPDATE SELECTED REPORT
                 */

                setSelectedReport(
                    (current) =>
                        current
                            ? {
                                ...current,

                                reportedUserBanned:
                                    true,

                                status:
                                    "reviewed",

                                reviewedBy:
                                    currentUser.uid,
                            }
                            : null
                );

            } catch (err) {

                console.error(
                    "Failed to ban user:",
                    err
                );

                setActionError(
                    "Failed to ban the user. Please try again."
                );

            } finally {

                setActionLoading(
                    false
                );

            }
        };

    /*
     * =====================================================
     * REMOVE BAN
     * =====================================================
     */

    const removeBan =
        async (
            report: AdminReport
        ) => {

            if (
                !report.reportedUserId
            ) {

                setActionError(
                    "The reported user ID is missing."
                );

                return;
            }

            const confirmed =
                window.confirm(
                    `Are you sure you want to remove the ban from ${report.reportedUserName || "this user"}?`
                );

            if (!confirmed) {
                return;
            }

            try {

                setActionLoading(
                    true
                );

                setActionError(
                    null
                );

                /*
                 * UPDATE USER
                 *
                 * Same behavior as Flutter.
                 */

                await updateDoc(
                    doc(
                        db,
                        "Users",
                        report.reportedUserId
                    ),
                    {
                        banned: false,
                    }
                );

                /*
                 * UPDATE REPORT
                 *
                 * Same behavior as Flutter.
                 */

                await updateDoc(
                    doc(
                        db,
                        "AdminReports",
                        report.id
                    ),
                    {
                        reportedUserBanned:
                            false,
                    }
                );

                /*
                 * REFRESH
                 */

                await loadReports(
                    true
                );

                /*
                 * UPDATE PANEL
                 */

                setSelectedReport(
                    (current) =>
                        current
                            ? {
                                ...current,

                                reportedUserBanned:
                                    false,
                            }
                            : null
                );

            } catch (err) {

                console.error(
                    "Failed to remove ban:",
                    err
                );

                setActionError(
                    "Failed to remove the ban. Please try again."
                );

            } finally {

                setActionLoading(
                    false
                );

            }
        };

    /*
     * =====================================================
     * IGNORE REPORT
     * =====================================================
     */

    const ignoreReport =
        async (
            report: AdminReport
        ) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to ignore this report?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setActionLoading(
                    true
                );

                setActionError(
                    null
                );

                /*
                 * Same behavior as Flutter:
                 *
                 * status = ignored
                 * reviewedAt = server timestamp
                 */

                await updateDoc(
                    doc(
                        db,
                        "AdminReports",
                        report.id
                    ),
                    {
                        status:
                            "ignored",

                        reviewedAt:
                            serverTimestamp(),
                    }
                );

                /*
                 * REFRESH
                 */

                await loadReports(
                    true
                );

                /*
                 * UPDATE PANEL
                 */

                setSelectedReport(
                    (current) =>
                        current
                            ? {
                                ...current,

                                status:
                                    "ignored",
                            }
                            : null
                );

            } catch (err) {

                console.error(
                    "Failed to ignore report:",
                    err
                );

                setActionError(
                    "Failed to ignore the report. Please try again."
                );

            } finally {

                setActionLoading(
                    false
                );

            }
        };

    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    return (
        <div className="min-h-[calc(100vh-7rem)] bg-slate-50">

            {/* =================================================
            HEADER
        ================================================== */}

            <div className="border-b border-slate-200 bg-white">

                <div className="px-6 py-6 lg:px-8">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">

                                    <AlertTriangle className="h-5 w-5" />

                                </div>

                                <div>

                                    <h1 className="text-xl font-bold text-slate-900">
                                        Reports
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Review reports submitted by NARP users.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                loadReports(
                                    true
                                )
                            }
                            disabled={
                                refreshing ||
                                actionLoading
                            }
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
                            disabled:opacity-60
                        "
                        >

                            <RefreshCw
                                className={`h-4 w-4 ${refreshing
                                        ? "animate-spin"
                                        : ""
                                    }`}
                            />

                            Refresh

                        </button>

                    </div>

                </div>

            </div>

            {/* =================================================
            CONTENT
        ================================================== */}

            <div className="px-6 py-6 lg:px-8">

                {/* =================================================
                ERROR
            ================================================== */}

                {error && (

                    <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                        <div className="flex items-center gap-3">

                            <FileWarning className="h-5 w-5 text-red-600" />

                            <p className="text-sm font-medium text-red-700">
                                {error}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                loadReports()
                            }
                            className="text-sm font-semibold text-red-700 hover:text-red-900"
                        >
                            Try again
                        </button>

                    </div>

                )}

                {/* =================================================
                SUMMARY CARDS
            ================================================== */}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

                    {/* TOTAL */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Total Reports
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {totalReports}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                <FileWarning className="h-5 w-5" />

                            </div>

                        </div>

                    </div>

                    {/* PENDING */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Pending
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {pendingReports}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                                <Clock3 className="h-5 w-5" />

                            </div>

                        </div>

                    </div>

                    {/* REVIEWED */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Reviewed
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {reviewedReports}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                <CheckCircle2 className="h-5 w-5" />

                            </div>

                        </div>

                    </div>

                    {/* IGNORED */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Ignored
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {ignoredReports}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">

                                <ShieldAlert className="h-5 w-5" />

                            </div>

                        </div>

                    </div>

                    {/* BANNED */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Users Banned
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {bannedUsers}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">

                                <Ban className="h-5 w-5" />

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                TABLE
            ================================================== */}

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* FILTER BAR */}

                    <div className="border-b border-slate-200 p-4">

                        <div className="grid gap-3 lg:grid-cols-4">

                            {/* SEARCH */}

                            <div className="relative lg:col-span-1">

                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search reports..."
                                    className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    pl-10
                                    pr-4
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                                />

                            </div>

                            {/* STATUS */}

                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                className="
                                h-11
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                text-sm
                                font-medium
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                            >

                                <option value="all">
                                    All Statuses
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="reviewed">
                                    Reviewed
                                </option>

                                <option value="ignored">
                                    Ignored
                                </option>

                                <option value="rejected">
                                    Rejected
                                </option>

                            </select>

                            {/* REASON */}

                            <select
                                value={
                                    reasonFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setReasonFilter(
                                        event.target.value
                                    )
                                }
                                className="
                                h-11
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                text-sm
                                font-medium
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                            >

                                <option value="all">
                                    All Reasons
                                </option>

                                {reasons.map(
                                    (
                                        reason
                                    ) => (

                                        <option
                                            key={
                                                reason
                                            }
                                            value={
                                                reason
                                            }
                                        >
                                            {reason}
                                        </option>

                                    )
                                )}

                            </select>

                            {/* USER STATUS */}

                            <select
                                value={
                                    userStatusFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setUserStatusFilter(
                                        event.target.value
                                    )
                                }
                                className="
                                h-11
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                text-sm
                                font-medium
                                text-slate-700
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                            >

                                <option value="all">
                                    All User Status
                                </option>

                                <option value="active">
                                    Active Users
                                </option>

                                <option value="banned">
                                    Banned Users
                                </option>

                            </select>

                        </div>

                        <div className="mt-3 flex items-center justify-between">

                            <p className="text-xs text-slate-500">

                                Showing{" "}

                                <span className="font-semibold text-slate-700">
                                    {filteredReports.length}
                                </span>{" "}

                                report
                                {filteredReports.length ===
                                    1
                                    ? ""
                                    : "s"}

                            </p>

                            {(search ||
                                statusFilter !==
                                "all" ||
                                reasonFilter !==
                                "all" ||
                                userStatusFilter !==
                                "all") && (

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch(
                                                ""
                                            );

                                            setStatusFilter(
                                                "all"
                                            );

                                            setReasonFilter(
                                                "all"
                                            );

                                            setUserStatusFilter(
                                                "all"
                                            );
                                        }}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                                    >
                                        Clear filters
                                    </button>

                                )}

                        </div>

                    </div>

                    {/* LOADING */}

                    {loading ? (

                        <div className="flex min-h-[350px] items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                                <p className="mt-4 text-sm font-medium text-slate-500">
                                    Loading reports...
                                </p>

                            </div>

                        </div>

                    ) : paginatedReports.length ===
                        0 ? (

                        /* EMPTY */

                        <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                                <ShieldAlert className="h-7 w-7" />

                            </div>

                            <h3 className="mt-4 text-base font-semibold text-slate-900">
                                No reports found
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-slate-500">
                                There are no reports matching your current search or filters.
                            </p>

                        </div>

                    ) : (

                        /* TABLE */

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1000px]">

                                <thead className="bg-slate-50">

                                    <tr className="border-b border-slate-200">

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Reporter
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Reported User
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Reason
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            User
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Submitted
                                        </th>

                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {paginatedReports.map(
                                        (
                                            report
                                        ) => (

                                            <tr
                                                key={
                                                    report.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >

                                                {/* REPORTER */}

                                                <td className="px-6 py-4">

                                                    <div>

                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {report.reporterUserName ||
                                                                "Unknown user"}
                                                        </p>

                                                        <p className="mt-1 max-w-[160px] truncate text-xs text-slate-400">
                                                            {report.reporterUserId ||
                                                                "No user ID"}
                                                        </p>

                                                    </div>

                                                </td>

                                                {/* REPORTED USER */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {report.reportedUserPhoto ? (

                                                            <img
                                                                src={
                                                                    report.reportedUserPhoto
                                                                }
                                                                alt={
                                                                    report.reportedUserName ||
                                                                    "Reported user"
                                                                }
                                                                className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
                                                            />

                                                        ) : (

                                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                                                                <User className="h-4 w-4" />

                                                            </div>

                                                        )}

                                                        <div>

                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {report.reportedUserName ||
                                                                    "Unknown user"}
                                                            </p>

                                                            <p className="mt-1 max-w-[160px] truncate text-xs text-slate-400">
                                                                {report.reportedUserId ||
                                                                    "No user ID"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* REASON */}

                                                <td className="px-6 py-4">

                                                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">

                                                        {report.reason ||
                                                            "Not specified"}

                                                    </span>

                                                </td>

                                                {/* STATUS */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
                                                            report.status
                                                        )}`}
                                                    >

                                                        {formatStatus(
                                                            report.status
                                                        )}

                                                    </span>

                                                </td>

                                                {/* USER STATUS */}

                                                <td className="px-6 py-4">

                                                    {report.reportedUserBanned ? (

                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">

                                                            <Ban className="h-3.5 w-3.5" />

                                                            Banned

                                                        </span>

                                                    ) : (

                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">

                                                            <CheckCircle2 className="h-3.5 w-3.5" />

                                                            Active

                                                        </span>

                                                    )}

                                                </td>

                                                {/* DATE */}

                                                <td className="px-6 py-4">

                                                    <p className="whitespace-nowrap text-sm text-slate-600">
                                                        {formatDate(
                                                            report.createdAt
                                                        )}
                                                    </p>

                                                </td>

                                                {/* ACTION */}

                                                <td className="px-6 py-4 text-right">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedReport(
                                                                report
                                                            )
                                                        }
                                                        className="
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-lg
                                                        px-3
                                                        py-2
                                                        text-sm
                                                        font-semibold
                                                        text-blue-600
                                                        transition
                                                        hover:bg-blue-50
                                                        hover:text-blue-700
                                                    "
                                                    >

                                                        <Eye className="h-4 w-4" />

                                                        View

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                    {/* =================================================
                    PAGINATION
                ================================================== */}

                    {!loading &&
                        filteredReports.length >
                        0 && (

                            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                                <p className="text-sm text-slate-500">

                                    Page{" "}

                                    <span className="font-semibold text-slate-700">
                                        {safeCurrentPage}
                                    </span>{" "}

                                    of{" "}

                                    <span className="font-semibold text-slate-700">
                                        {totalPages}
                                    </span>

                                </p>

                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        disabled={
                                            safeCurrentPage <=
                                            1
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (
                                                    page
                                                ) =>
                                                    Math.max(
                                                        1,
                                                        page -
                                                        1
                                                    )
                                            )
                                        }
                                        className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                                    >
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            safeCurrentPage >=
                                            totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (
                                                    page
                                                ) =>
                                                    Math.min(
                                                        totalPages,
                                                        page +
                                                        1
                                                    )
                                            )
                                        }
                                        className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>

                        )}

                </div>

            </div>

            {/* =================================================
            REPORT DETAIL PANEL
        ================================================== */}

            {selectedReport && (

                <div className="fixed inset-0 z-[100]">

                    {/* BACKDROP */}

                    <button
                        type="button"
                        aria-label="Close report"
                        onClick={
                            closeReport
                        }
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                    />

                    {/* PANEL */}

                    <div className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl">

                        {/* PANEL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    Report Details
                                </p>

                                <h2 className="mt-1 text-lg font-bold text-slate-900">
                                    User Report
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeReport
                                }
                                disabled={
                                    actionLoading
                                }
                                className="
                                rounded-xl
                                p-2
                                text-slate-400
                                transition
                                hover:bg-slate-100
                                hover:text-slate-700
                                disabled:opacity-50
                            "
                                aria-label="Close"
                            >

                                <X className="h-5 w-5" />

                            </button>

                        </div>

                        {/* PANEL CONTENT */}

                        <div className="flex-1 overflow-y-auto px-6 py-6">

                            {/* ACTION ERROR */}

                            {actionError && (

                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                                    <div className="flex items-start gap-3">

                                        <FileWarning className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />

                                        <p className="text-sm font-medium text-red-700">
                                            {actionError}
                                        </p>

                                    </div>

                                </div>

                            )}

                            {/* REPORTED USER */}

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Reported User
                                </p>

                                <div className="mt-4 flex items-center gap-4">

                                    {selectedReport.reportedUserPhoto ? (

                                        <img
                                            src={
                                                selectedReport.reportedUserPhoto
                                            }
                                            alt={
                                                selectedReport.reportedUserName ||
                                                "Reported user"
                                            }
                                            className="h-16 w-16 rounded-full object-cover ring-4 ring-white"
                                        />

                                    ) : (

                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-400 ring-4 ring-slate-100">

                                            <User className="h-7 w-7" />

                                        </div>

                                    )}

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-center gap-2">

                                            <h3 className="truncate text-base font-bold text-slate-900">
                                                {selectedReport.reportedUserName ||
                                                    "Unknown user"}
                                            </h3>

                                            {selectedReport.reportedUserBanned ? (

                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700">
                                                    <Ban className="h-3 w-3" />
                                                    BANNED
                                                </span>

                                            ) : (

                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                                                    ACTIVE
                                                </span>

                                            )}

                                        </div>

                                        <p className="mt-1 break-all text-xs text-slate-400">
                                            {selectedReport.reportedUserId ||
                                                "No user ID"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* REPORTER */}

                            <div className="mt-5">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Reported By
                                </p>

                                <div className="mt-2 rounded-xl border border-slate-200 px-4 py-3">

                                    <p className="text-sm font-semibold text-slate-900">
                                        {selectedReport.reporterUserName ||
                                            "Unknown user"}
                                    </p>

                                    <p className="mt-1 break-all text-xs text-slate-400">
                                        {selectedReport.reporterUserId ||
                                            "No user ID"}
                                    </p>

                                </div>

                            </div>

                            {/* REASON */}

                            <div className="mt-5">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Reason
                                </p>

                                <div className="mt-2">

                                    <span className="inline-flex rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700">
                                        {selectedReport.reason ||
                                            "Not specified"}
                                    </span>

                                </div>

                            </div>

                            {/* MESSAGE */}

                            <div className="mt-5">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Message
                                </p>

                                <div className="mt-2 min-h-[80px] rounded-xl border border-slate-200 bg-white px-4 py-3">

                                    {selectedReport.message ? (

                                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                            {selectedReport.message}
                                        </p>

                                    ) : (

                                        <p className="text-sm italic text-slate-400">
                                            No additional message was provided.
                                        </p>

                                    )}

                                </div>

                            </div>

                            {/* STATUS */}

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Report Status
                                    </p>

                                    <div className="mt-2">

                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${getStatusClasses(
                                                selectedReport.status
                                            )}`}
                                        >
                                            {formatStatus(
                                                selectedReport.status
                                            )}
                                        </span>

                                    </div>

                                </div>

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        User Status
                                    </p>

                                    <div className="mt-2">

                                        {selectedReport.reportedUserBanned ? (

                                            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700">
                                                <Ban className="h-4 w-4" />
                                                Banned
                                            </span>

                                        ) : (

                                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Active
                                            </span>

                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* TIMESTAMPS */}

                            <div className="mt-6 border-t border-slate-200 pt-5">

                                <div className="grid gap-5 sm:grid-cols-2">

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Submitted
                                        </p>

                                        <p className="mt-2 text-sm text-slate-700">
                                            {formatDate(
                                                selectedReport.createdAt
                                            )}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Reviewed
                                        </p>

                                        <p className="mt-2 text-sm text-slate-700">
                                            {formatDate(
                                                selectedReport.reviewedAt
                                            )}
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-5">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Reviewed By
                                    </p>

                                    <p className="mt-2 break-all text-sm text-slate-700">
                                        {selectedReport.reviewedBy ||
                                            "Not reviewed yet"}
                                    </p>

                                </div>

                            </div>

                            {/* REPORT ID */}

                            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Report ID
                                </p>

                                <p className="mt-1 break-all font-mono text-xs text-slate-500">
                                    {selectedReport.id}
                                </p>

                            </div>

                        </div>

                        {/* =================================================
                        PANEL ACTIONS
                    ================================================== */}

                        <div className="border-t border-slate-200 bg-white px-6 py-4">

                            <div className="grid gap-2 sm:grid-cols-2">

                                {/* BAN / REMOVE BAN */}

                                <button
                                    type="button"
                                    disabled={
                                        actionLoading ||
                                        !selectedReport.reportedUserId
                                    }
                                    onClick={() =>
                                        selectedReport.reportedUserBanned
                                            ? removeBan(
                                                selectedReport
                                            )
                                            : banUser(
                                                selectedReport
                                            )
                                    }
                                    className={`
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    transition
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    ${selectedReport.reportedUserBanned
                                            ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                        }
                                `}
                                >

                                    {actionLoading ? (

                                        <RefreshCw className="h-4 w-4 animate-spin" />

                                    ) : selectedReport.reportedUserBanned ? (

                                        <CheckCircle2 className="h-4 w-4" />

                                    ) : (

                                        <Ban className="h-4 w-4" />

                                    )}

                                    {selectedReport.reportedUserBanned
                                        ? "Remove Ban"
                                        : "Ban User"}

                                </button>

                                {/* IGNORE */}

                                <button
                                    type="button"
                                    disabled={
                                        actionLoading ||
                                        selectedReport.status
                                            ?.toLowerCase() ===
                                        "ignored"
                                    }
                                    onClick={() =>
                                        ignoreReport(
                                            selectedReport
                                        )
                                    }
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
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                                >

                                    <ShieldAlert className="h-4 w-4" />

                                    {selectedReport.status
                                        ?.toLowerCase() ===
                                        "ignored"
                                        ? "Report Ignored"
                                        : "Ignore Report"}

                                </button>

                            </div>

                            <button
                                type="button"
                                disabled={
                                    actionLoading
                                }
                                onClick={
                                    closeReport
                                }
                                className="
                                mt-2
                                w-full
                                rounded-xl
                                bg-slate-900
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-slate-800
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );


}
