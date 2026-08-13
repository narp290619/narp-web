"use client";

import { useEffect, useState } from "react";

import {
    Users,
    UserCheck,
    CalendarCheck,
    CreditCard,
    ShieldCheck,
    ArrowUpRight,
    AlertTriangle,
    Wrench,
    RefreshCw,
    ClipboardList,
    Clock,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import {
    type AdminActivity,
    getAdminDashboardStats,
    type AdminDashboardStats,
} from "@/lib/admin/adminDashboardService";

const emptyStats: AdminDashboardStats = {
    totalUsers: 0,
    totalFreelancers: 0,
    activeBookings: 0,
    totalPayments: 0,
    pendingVerifications: 0,
    pendingWithdrawals: 0,
    reports: 0,
    pendingSkillRequests: 0,
    pendingDisputes: 0,
    recentActivity: [],
};

export default function AdminDashboardPage() {
    const [stats, setStats] =
        useState<AdminDashboardStats>(emptyStats);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    async function loadDashboard() {
        try {
            setLoading(true);
            setError(null);

            const data =
                await getAdminDashboardStats();

            setStats(data);
        } catch (error) {
            console.error(
                "Failed to load admin dashboard:",
                error
            );

            setError(
                "Unable to load dashboard statistics."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    return (
        <main className="min-h-screen">

            {/* Header */}

            <section className="border-b border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-6 py-8">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        NARP Administration
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Monitor and manage the NARP platform.
                    </p>

                </div>

            </section>

            {/* Content */}

            <section className="mx-auto max-w-7xl px-6 py-10">

                {/* Error */}

                {error && (
                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                        "
                    >
                        <div className="flex items-center gap-3">

                            <AlertTriangle className="h-5 w-5 text-red-600" />

                            <p className="text-sm font-medium text-red-700">
                                {error}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={loadDashboard}
                            className="
                                flex
                                items-center
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

                {/* Statistics */}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        description="Registered users"
                        icon={Users}
                        loading={loading}
                    />

                    <StatCard
                        title="Freelancers"
                        value={stats.totalFreelancers}
                        description="Unique freelancers"
                        icon={UserCheck}
                        loading={loading}
                    />

                    <StatCard
                        title="Active Bookings"
                        value={stats.activeBookings}
                        description="Current bookings"
                        icon={CalendarCheck}
                        loading={loading}
                    />

                    <PaymentStatCard
                        value={stats.totalPayments}
                        loading={loading}
                    />

                </div>

                {/* Requires Attention */}

                <div className="mt-10">

                    <h2 className="text-xl font-bold text-slate-900">
                        Requires Attention
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Items that may require administrative action.
                    </p>

                    <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                        <AttentionCard
                            title="Verification"
                            description="Freelancers waiting for verification"
                            value={stats.pendingVerifications}
                            icon={ShieldCheck}
                        />

                        <AttentionCard
                            title="Withdrawals"
                            description="Withdrawal requests"
                            value={stats.pendingWithdrawals}
                            icon={ArrowUpRight}
                        />

                        <AttentionCard
                            title="Reports"
                            description="Submitted user reports"
                            value={stats.reports}
                            icon={AlertTriangle}
                        />

                        <AttentionCard
                            title="Skill Requests"
                            description="Requests for new skills"
                            value={stats.pendingSkillRequests}
                            icon={Wrench}
                        />

                        <AttentionCard
                            title="Disputes"
                            description="Pending disputes requiring review"
                            value={stats.pendingDisputes}
                            icon={AlertTriangle}
                        />

                    </div>

                </div>

                {/* Recent Activity */}

                <div className="mt-10">

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <h2 className="font-bold text-slate-900">
                                    Recent Activity
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Recent activity across the NARP platform.
                                </p>

                            </div>

                            <Clock className="h-5 w-5 text-slate-400" />

                        </div>

                        {/* Activity List */}

                        {loading ? (

                            <div className="divide-y divide-slate-100">

                                {Array.from({ length: 5 }).map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 px-6 py-5"
                                        >

                                            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />

                                            <div className="flex-1">

                                                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

                                                <div className="mt-2 h-3 w-64 animate-pulse rounded bg-slate-100" />

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>

                        ) : stats.recentActivity.length === 0 ? (

                            <div className="px-6 py-12 text-center">

                                <ClipboardList className="mx-auto h-8 w-8 text-slate-300" />

                                <p className="mt-3 text-sm text-slate-400">
                                    No recent activity.
                                </p>

                            </div>

                        ) : (

                            <div className="divide-y divide-slate-100">

                                {stats.recentActivity.map(
                                    (activity) => (
                                        <ActivityRow
                                            key={activity.id}
                                            activity={activity}
                                        />
                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </section>

        </main>
    );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

type StatCardProps = {
    title: string;
    value: number;
    description: string;
    icon: React.ElementType;
    loading: boolean;
};

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    loading,
}: StatCardProps) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >
            <div className="flex items-center justify-between">

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                    "
                >
                    <Icon className="h-5 w-5 text-blue-600" />
                </div>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
                {title}
            </p>

            {loading ? (
                <div className="mt-2 h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
            ) : (
                <p className="mt-1 text-3xl font-bold text-slate-900">
                    {value.toLocaleString()}
                </p>
            )}

            <p className="mt-1 text-sm text-slate-400">
                {description}
            </p>

        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Attention Card                                                             */
/* -------------------------------------------------------------------------- */

type AttentionCardProps = {
    title: string;
    description: string;
    value: number;
    icon: React.ElementType;
};

function AttentionCard({
    title,
    description,
    value,
    icon: Icon,
}: AttentionCardProps) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >
            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-semibold text-slate-900">
                        {title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        {description}
                    </p>

                </div>

                <Icon className="h-5 w-5 text-slate-400" />

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-900">
                {value.toLocaleString()}
            </p>

        </div>
    );
}

type ActivityRowProps = {
    activity: AdminActivity;
};

function ActivityRow({
    activity,
}: ActivityRowProps) {
    const config = getActivityConfig(
        activity.type
    );

    const Icon = config.icon;

    return (
        <div className="flex items-center gap-4 px-6 py-5">

            {/* Icon */}

            <div
                className={`
                    flex
                    h-10
                    w-10
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${config.background}
                `}
            >
                <Icon
                    className={`
                        h-5
                        w-5
                        ${config.iconColor}
                    `}
                />
            </div>

            {/* Content */}

            <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                    <p className="text-sm font-semibold text-slate-900">
                        {activity.title}
                    </p>

                    {activity.status && (
                        <ActivityStatus
                            status={
                                activity.status
                            }
                        />
                    )}

                </div>

                <p className="mt-1 truncate text-sm text-slate-500">
                    {activity.description}
                </p>

            </div>

            {/* Date */}

            <div className="hidden flex-shrink-0 text-right sm:block">

                <p className="text-xs text-slate-400">
                    {formatActivityDate(
                        activity.createdAt
                    )}
                </p>

            </div>

        </div>
    );
}

function getActivityConfig(
    type: AdminActivity["type"]
) {
    switch (type) {
        case "booking":
            return {
                icon: CalendarCheck,
                background: "bg-blue-50",
                iconColor: "text-blue-600",
            };

        case "payment":
            return {
                icon: CreditCard,
                background: "bg-green-50",
                iconColor: "text-green-600",
            };

        case "verification":
            return {
                icon: ShieldCheck,
                background: "bg-purple-50",
                iconColor: "text-purple-600",
            };

        case "withdrawal":
            return {
                icon: ArrowUpRight,
                background: "bg-orange-50",
                iconColor: "text-orange-600",
            };

        case "report":
            return {
                icon: AlertTriangle,
                background: "bg-red-50",
                iconColor: "text-red-600",
            };

        case "dispute":
            return {
                icon: AlertTriangle,
                background: "bg-orange-50",
                iconColor: "text-orange-600",
            };

        default:
            return {
                icon: ClipboardList,
                background: "bg-slate-50",
                iconColor: "text-slate-600",
            };
    }
}

function ActivityStatus({
    status,
}: {
    status: string;
}) {
    const normalizedStatus =
        status.toLowerCase();

    let className =
        "bg-slate-100 text-slate-600";

    let Icon = Clock;

    if (
        normalizedStatus === "approved" ||
        normalizedStatus === "completed" ||
        normalizedStatus === "accepted" ||
        normalizedStatus === "confirmed" ||
        normalizedStatus === "in_progress"
    ) {
        className =
            "bg-green-50 text-green-700";

        Icon = CheckCircle2;
    }

    if (
        normalizedStatus === "rejected" ||
        normalizedStatus === "cancelled" ||
        normalizedStatus === "canceled" ||
        normalizedStatus === "failed"
    ) {
        className =
            "bg-red-50 text-red-700";

        Icon = XCircle;
    }

    if (
        normalizedStatus === "pending" ||
        normalizedStatus === "requested"
    ) {
        className =
            "bg-orange-50 text-orange-700";

        Icon = Clock;
    }

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                ${className}
            `}
        >
            <Icon className="h-3 w-3" />

            {formatStatus(status)}
        </span>
    );
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

function formatActivityDate(
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
            hour: "numeric",
            minute: "2-digit",
        }
    );
}

type PaymentStatCardProps = {
    value: number;
    loading: boolean;
};

function PaymentStatCard({
    value,
    loading,
}: PaymentStatCardProps) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >
            <div className="flex items-center justify-between">

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                    "
                >
                    <CreditCard className="h-5 w-5 text-blue-600" />
                </div>

            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
                Payments
            </p>

            {loading ? (
                <div className="mt-2 h-9 w-32 animate-pulse rounded-lg bg-slate-200" />
            ) : (
                <p className="mt-1 text-3xl font-bold text-slate-900">
                    ₱{value.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </p>
            )}

            <p className="mt-1 text-sm text-slate-400">
                Approved payments
            </p>

        </div>
    );
}