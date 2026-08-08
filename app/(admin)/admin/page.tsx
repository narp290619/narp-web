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
} from "lucide-react";

import {
    getAdminDashboardStats,
    type AdminDashboardStats,
} from "@/lib/admin/adminDashboardService";

const emptyStats: AdminDashboardStats = {
    totalUsers: 0,
    freelancerMembers: 0,
    activeBookings: 0,
    paymentReceipts: 0,
    pendingVerifications: 0,
    pendingWithdrawals: 0,
    reports: 0,
    pendingSkillRequests: 0,
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
                        value={stats.freelancerMembers}
                        description="Skill memberships"
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

                    <StatCard
                        title="Payments"
                        value={stats.paymentReceipts}
                        description="Payment records"
                        icon={CreditCard}
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

                    </div>

                </div>

                {/* Recent Activity */}

                <div className="mt-10">

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-200 px-6 py-5">

                            <h2 className="font-bold text-slate-900">
                                Recent Activity
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Recent activity across the NARP platform.
                            </p>

                        </div>

                        <div className="px-6 py-12 text-center">

                            <p className="text-sm text-slate-400">
                                Activity feed will be added later.
                            </p>

                        </div>

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