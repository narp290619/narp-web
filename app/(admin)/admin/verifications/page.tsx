"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    Clock3,
    Eye,
    Search,
    ShieldCheck,
    User,
} from "lucide-react";

import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Verification = {
    id: string;
    freelancerId?: string;
    skillId?: string;
    fullName?: string;
    verificationStatus?: string;
    submittedAt?: Date | null;
    skillSamplePhoto?: string;
};

function getDate(value: unknown): Date | null {
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

function formatDate(date: Date | null) {
    if (!date) {
        return "—";
    }

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function AdminVerificationsPage() {
    const [verifications, setVerifications] =
        useState<Verification[]>([]);

    const [filteredVerifications, setFilteredVerifications] =
        useState<Verification[]>([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        async function loadVerifications() {
            try {
                setLoading(true);
                setError(null);

                /*
                 * Only retrieve pending verification requests.
                 */

                const verificationQuery = query(
                    collection(
                        db,
                        "FreelancerVerification"
                    ),
                    where(
                        "verificationStatus",
                        "==",
                        "pending"
                    )
                );

                const snapshot =
                    await getDocs(
                        verificationQuery
                    );

                const results: Verification[] =
                    snapshot.docs.map(
                        (document) => {
                            const data =
                                document.data();

                            return {
                                id: document.id,

                                freelancerId:
                                    data.freelancerId,

                                skillId:
                                    data.skillId,

                                fullName:
                                    data.fullName,

                                verificationStatus:
                                    data.verificationStatus,

                                submittedAt:
                                    getDate(
                                        data.submittedAt
                                    ),
                            };
                        }
                    );

                /*
                 * Newest submissions first.
                 */

                results.sort(
                    (a, b) =>
                        (b.submittedAt?.getTime() ??
                            0) -
                        (a.submittedAt?.getTime() ??
                            0)
                );

                setVerifications(results);
                setFilteredVerifications(results);
            } catch (err) {
                console.error(
                    "Failed to load pending verifications:",
                    err
                );

                setError(
                    "Unable to load pending verification requests."
                );
            } finally {
                setLoading(false);
            }
        }

        loadVerifications();
    }, []);

    useEffect(() => {
        const value =
            search.trim().toLowerCase();

        if (!value) {
            setFilteredVerifications(
                verifications
            );

            return;
        }

        setFilteredVerifications(
            verifications.filter(
                (verification) =>
                    verification.fullName
                        ?.toLowerCase()
                        .includes(value) ||
                    verification.skillId
                        ?.toLowerCase()
                        .includes(value) ||
                    verification.freelancerId
                        ?.toLowerCase()
                        .includes(value)
            )
        );
    }, [search, verifications]);

    return (
        <main className="min-h-screen bg-slate-50">

            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                {/* Header */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                                <ShieldCheck className="h-6 w-6 text-blue-600" />
                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Freelancer Verifications
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review pending skill verification requests.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                        {verifications.length} Pending
                    </div>

                </div>

                {/* Search */}

                <div className="mt-8">

                    <div className="relative max-w-md">

                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search freelancer or skill..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                py-3
                                pl-12
                                pr-4
                                text-sm
                                text-slate-700
                                shadow-sm
                                outline-none
                                transition
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>

                </div>

                {/* Error */}

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}

                {loading ? (
                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {Array.from({
                            length: 6,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="h-72 animate-pulse rounded-2xl bg-slate-200"
                            />
                        ))}

                    </div>
                ) : filteredVerifications.length ===
                  0 ? (
                    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />

                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                            No pending verifications
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            There are currently no freelancer
                            skill verification requests waiting
                            for review.
                        </p>

                    </div>
                ) : (
                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {filteredVerifications.map(
                            (verification) => (
                                <div
                                    key={
                                        verification.id
                                    }
                                    className="
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        shadow-sm
                                        transition
                                        hover:-translate-y-0.5
                                        hover:shadow-md
                                    "
                                >

                                    {/* Card header */}

                                    <div className="border-b border-slate-100 p-5">

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                </div>

                                                <div className="min-w-0">

                                                    <h2 className="truncate font-semibold text-slate-900">
                                                        {verification.fullName ||
                                                            "Unknown Freelancer"}
                                                    </h2>

                                                    <p className="mt-1 truncate text-xs text-slate-400">
                                                        {
                                                            verification.freelancerId
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            <span className="flex-shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                                                Pending
                                            </span>

                                        </div>

                                    </div>

                                    {/* Card content */}

                                    <div className="space-y-4 p-5">

                                        <div>

                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Skill
                                            </p>

                                            <p className="mt-1 font-semibold text-slate-900">
                                                {verification.skillId ||
                                                    "—"}
                                            </p>

                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-500">

                                            <Clock3 className="h-4 w-4" />

                                            <span>
                                                Submitted{" "}
                                                {formatDate(
                                                    verification.submittedAt ??
                                                        null
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    {/* Action */}

                                    <div className="border-t border-slate-100 bg-slate-50 p-4">

                                        <Link
                                            href={`/admin/verifications/${verification.id}`}
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                bg-blue-600
                                                px-4
                                                py-2.5
                                                text-sm
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-blue-700
                                            "
                                        >
                                            <Eye className="h-4 w-4" />
                                            Review Verification
                                        </Link>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </main>
    );
}

