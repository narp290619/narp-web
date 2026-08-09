"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    Users,
    ChevronLeft,
    ChevronRight,
    Eye,
    RefreshCw,
    ShieldCheck,
    ShieldAlert,
    Star,
    BriefcaseBusiness,
} from "lucide-react";

import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type FreelancerRecord = {
    id: string;

    userId?: string;
    skillId?: string;

    firstName?: string;
    lastName?: string;

    profileImageUrl?: string;
    skillSamplePhotoUrl?: string;

    aboutMemberSkill?: string;

    startingPrice?: number;

    rating?: number;
    ratingTotal?: number;
    rating3?: number;
    reviewCount?: number;

    completedJobs?: number;

    rankingScore?: number;
    popularityScore?: number;

    isVerified?: boolean;

    latitude?: number;
    longitude?: number;

    createdAt?: Date | null;
    updatedLocationAt?: Date | null;
};

const PAGE_SIZE = 10;

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

function getFreelancerName(
    freelancer: FreelancerRecord
) {
    const name = [
        freelancer.firstName,
        freelancer.lastName,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return name || "Unnamed Freelancer";
}

function getInitials(
    freelancer: FreelancerRecord
) {
    const name = getFreelancerName(
        freelancer
    );

    if (
        name ===
        "Unnamed Freelancer"
    ) {
        return "?";
    }

    const parts = name
        .split(" ")
        .filter(Boolean);

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}

function formatDate(
    date: Date | null
) {
    if (!date) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-PH",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}

function formatPrice(
    price?: number
) {
    if (
        price === undefined ||
        !Number.isFinite(price)
    ) {
        return "—";
    }

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
        }
    ).format(price);
}

function formatRating(
    rating?: number
) {
    if (
        rating === undefined ||
        !Number.isFinite(rating)
    ) {
        return "—";
    }

    return rating.toFixed(1);
}

function VerificationBadge({
    verified,
}: {
    verified?: boolean;
}) {
    if (verified) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-green-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-green-700
                "
            >
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-orange-50
                px-2.5
                py-1
                text-xs
                font-semibold
                text-orange-700
            "
        >
            <ShieldAlert className="h-3.5 w-3.5" />
            Unverified
        </span>
    );
}

export default function AdminFreelancersPage() {
    const [
        freelancers,
        setFreelancers,
    ] = useState<FreelancerRecord[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState<
            "all" | "verified" | "unverified"
        >("all");

    const [page, setPage] =
        useState(1);

    async function loadFreelancers() {
        try {
            setLoading(true);
            setError(null);

            const freelancersRef =
                collection(
                    db,
                    "SkillMembers"
                );

            const snapshot =
                await getDocs(
                    freelancersRef
                );

            const loaded: FreelancerRecord[] =
                snapshot.docs.map(
                    (document) => {
                        const data =
                            document.data();

                        return {
                            id: document.id,

                            userId:
                                typeof data.userId ===
                                "string"
                                    ? data.userId
                                    : undefined,

                            skillId:
                                typeof data.skillId ===
                                "string"
                                    ? data.skillId
                                    : undefined,

                            firstName:
                                typeof data.firstName ===
                                "string"
                                    ? data.firstName
                                    : undefined,

                            lastName:
                                typeof data.lastName ===
                                "string"
                                    ? data.lastName
                                    : undefined,

                            profileImageUrl:
                                typeof data.profileImageUrl ===
                                "string"
                                    ? data.profileImageUrl
                                    : undefined,

                            skillSamplePhotoUrl:
                                typeof data.skillSamplePhotoUrl ===
                                "string"
                                    ? data.skillSamplePhotoUrl
                                    : undefined,

                            aboutMemberSkill:
                                typeof data.aboutMemberSkill ===
                                "string"
                                    ? data.aboutMemberSkill
                                    : undefined,

                            startingPrice:
                                typeof data.startingPrice ===
                                "number"
                                    ? data.startingPrice
                                    : undefined,

                            rating:
                                typeof data.rating ===
                                "number"
                                    ? data.rating
                                    : undefined,

                            ratingTotal:
                                typeof data.ratingTotal ===
                                "number"
                                    ? data.ratingTotal
                                    : undefined,

                            rating3:
                                typeof data.rating3 ===
                                "number"
                                    ? data.rating3
                                    : undefined,

                            reviewCount:
                                typeof data.reviewCount ===
                                "number"
                                    ? data.reviewCount
                                    : undefined,

                            completedJobs:
                                typeof data.completedJobs ===
                                "number"
                                    ? data.completedJobs
                                    : undefined,

                            rankingScore:
                                typeof data.rankingScore ===
                                "number"
                                    ? data.rankingScore
                                    : undefined,

                            popularityScore:
                                typeof data.popularityScore ===
                                "number"
                                    ? data.popularityScore
                                    : undefined,

                            isVerified:
                                data.isVerified ===
                                true,

                            latitude:
                                typeof data.latitude ===
                                "number"
                                    ? data.latitude
                                    : undefined,

                            longitude:
                                typeof data.longitude ===
                                "number"
                                    ? data.longitude
                                    : undefined,

                            createdAt:
                                getDate(
                                    data.createdAt
                                ),

                            updatedLocationAt:
                                getDate(
                                    data.updatedLocationAt
                                ),
                        };
                    }
                );

            loaded.sort(
                (a, b) => {
                    const aTime =
                        a.createdAt?.getTime() ??
                        0;

                    const bTime =
                        b.createdAt?.getTime() ??
                        0;

                    return (
                        bTime -
                        aTime
                    );
                }
            );

            setFreelancers(
                loaded
            );

            setPage(1);
        } catch (err) {
            console.error(
                "Failed to load freelancers:",
                err
            );

            setError(
                "Unable to load freelancers. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFreelancers();
    }, []);

    /*
     * Search + filter
     */

    const filteredFreelancers =
        useMemo(() => {
            const searchTerm =
                search
                    .trim()
                    .toLowerCase();

            return freelancers.filter(
                (freelancer) => {
                    if (
                        filter ===
                            "verified" &&
                        !freelancer.isVerified
                    ) {
                        return false;
                    }

                    if (
                        filter ===
                            "unverified" &&
                        freelancer.isVerified
                    ) {
                        return false;
                    }

                    if (!searchTerm) {
                        return true;
                    }

                    const name =
                        getFreelancerName(
                            freelancer
                        ).toLowerCase();

                    const skill =
                        (
                            freelancer.skillId ??
                            ""
                        ).toLowerCase();

                    const userId =
                        (
                            freelancer.userId ??
                            ""
                        ).toLowerCase();

                    const documentId =
                        freelancer.id.toLowerCase();

                    const about =
                        (
                            freelancer.aboutMemberSkill ??
                            ""
                        ).toLowerCase();

                    return (
                        name.includes(
                            searchTerm
                        ) ||
                        skill.includes(
                            searchTerm
                        ) ||
                        userId.includes(
                            searchTerm
                        ) ||
                        documentId.includes(
                            searchTerm
                        ) ||
                        about.includes(
                            searchTerm
                        )
                    );
                }
            );
        }, [
            freelancers,
            search,
            filter,
        ]);

    /*
     * Pagination
     */

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredFreelancers.length /
                    PAGE_SIZE
            )
        );

    const safePage =
        Math.min(
            page,
            totalPages
        );

    const startIndex =
        (safePage - 1) *
        PAGE_SIZE;

    const paginatedFreelancers =
        filteredFreelancers.slice(
            startIndex,
            startIndex +
                PAGE_SIZE
        );

    function handleSearch(
        value: string
    ) {
        setSearch(value);
        setPage(1);
    }

    function handleFilter(
        value:
            | "all"
            | "verified"
            | "unverified"
    ) {
        setFilter(value);
        setPage(1);
    }

    return (
        <main className="min-h-screen bg-slate-50">

            {/* Header */}

            <div className="border-b border-slate-200 bg-white">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-8
                        lg:px-8
                    "
                >

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

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
                                <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                            </div>

                            <div>

                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Freelancers
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage freelancer profiles and skill listings on NARP.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={
                                loadFreelancers
                            }
                            disabled={
                                loading
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

            </div>

            {/* Content */}

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-6
                    py-8
                    lg:px-8
                "
            >

                {/* Search + Filters */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex flex-col gap-4 lg:flex-row">

                        {/* Search */}

                        <div className="relative flex-1">

                            <Search
                                className="
                                    pointer-events-none
                                    absolute
                                    left-4
                                    top-1/2
                                    h-5
                                    w-5
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    handleSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search by name, skill, user ID, or freelancer ID..."
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    py-3
                                    pl-12
                                    pr-4
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>

                        {/* Filter */}

                        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">

                            {(
                                [
                                    [
                                        "all",
                                        "All",
                                    ],
                                    [
                                        "verified",
                                        "Verified",
                                    ],
                                    [
                                        "unverified",
                                        "Unverified",
                                    ],
                                ] as const
                            ).map(
                                ([
                                    value,
                                    label,
                                ]) => (
                                    <button
                                        key={
                                            value
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleFilter(
                                                value
                                            )
                                        }
                                        className={`
                                            rounded-lg
                                            px-4
                                            py-2
                                            text-sm
                                            font-semibold
                                            transition
                                            ${
                                                filter ===
                                                value
                                                    ? "bg-white text-blue-700 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-700"
                                            }
                                        `}
                                    >
                                        {
                                            label
                                        }
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                </div>

                {/* Error */}

                {error && (
                    <div
                        className="
                            mb-6
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>
                )}

                {/* Table */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px]">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Freelancer
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Skill
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Rating
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Starting Price
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Jobs
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Joined
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {loading ? (
                                    Array.from({
                                        length: 8,
                                    }).map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    index
                                                }
                                            >

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

                                                        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

                                                        <div className="space-y-2">

                                                            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                                                            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-4 w-10 animate-pulse rounded bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="ml-auto h-9 w-20 animate-pulse rounded-lg bg-slate-100" />

                                                </td>

                                            </tr>
                                        )
                                    )
                                ) : paginatedFreelancers.length ===
                                  0 ? (
                                    <tr>

                                        <td
                                            colSpan={
                                                8
                                            }
                                            className="px-6 py-16 text-center"
                                        >

                                            <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

                                            <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                                No freelancers found
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {search ||
                                                filter !==
                                                    "all"
                                                    ? "Try adjusting your search or filter."
                                                    : "There are no freelancer profiles to display."}
                                            </p>

                                        </td>

                                    </tr>
                                ) : (
                                    paginatedFreelancers.map(
                                        (
                                            freelancer
                                        ) => (
                                            <tr
                                                key={
                                                    freelancer.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >

                                                {/* Freelancer */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

                                                        {freelancer.profileImageUrl ? (
                                                            <img
                                                                src={
                                                                    freelancer.profileImageUrl
                                                                }
                                                                alt={getFreelancerName(
                                                                    freelancer
                                                                )}
                                                                className="
                                                                    h-10
                                                                    w-10
                                                                    flex-shrink-0
                                                                    rounded-full
                                                                    object-cover
                                                                "
                                                            />
                                                        ) : (
                                                            <div
                                                                className="
                                                                    flex
                                                                    h-10
                                                                    w-10
                                                                    flex-shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-blue-100
                                                                    text-sm
                                                                    font-bold
                                                                    text-blue-700
                                                                "
                                                            >
                                                                {getInitials(
                                                                    freelancer
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {getFreelancerName(
                                                                    freelancer
                                                                )}
                                                            </p>

                                                            <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">
                                                                {freelancer.userId ??
                                                                    "No user ID"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* Skill */}

                                                <td className="px-6 py-5">

                                                    <span
                                                        className="
                                                            inline-flex
                                                            rounded-full
                                                            bg-blue-50
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-semibold
                                                            text-blue-700
                                                        "
                                                    >
                                                        {freelancer.skillId ??
                                                            "Unknown"}
                                                    </span>

                                                </td>

                                                {/* Rating */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-1.5">

                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                                                        <span className="text-sm font-semibold text-slate-800">
                                                            {formatRating(
                                                                freelancer.rating
                                                            )}
                                                        </span>

                                                        <span className="text-xs text-slate-400">
                                                            (
                                                            {freelancer.reviewCount ??
                                                                0}
                                                            )
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* Price */}

                                                <td className="px-6 py-5 text-sm font-semibold text-slate-700">

                                                    {formatPrice(
                                                        freelancer.startingPrice
                                                    )}

                                                </td>

                                                {/* Jobs */}

                                                <td className="px-6 py-5">

                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {freelancer.completedJobs ??
                                                            0}
                                                    </span>

                                                </td>

                                                {/* Status */}

                                                <td className="px-6 py-5">

                                                    <VerificationBadge
                                                        verified={
                                                            freelancer.isVerified
                                                        }
                                                    />

                                                </td>

                                                {/* Joined */}

                                                <td className="px-6 py-5 text-sm text-slate-500">

                                                    {formatDate(
                                                        freelancer.createdAt ??
                                                            null
                                                    )}

                                                </td>

                                                {/* Action */}

                                                <td className="px-6 py-5 text-right">

                                                    <Link
                                                        href={`/admin/freelancers/${freelancer.id}`}
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-2
                                                            rounded-lg
                                                            border
                                                            border-slate-200
                                                            px-3
                                                            py-2
                                                            text-sm
                                                            font-semibold
                                                            text-slate-700
                                                            transition
                                                            hover:border-blue-200
                                                            hover:bg-blue-50
                                                            hover:text-blue-700
                                                        "
                                                    >

                                                        <Eye className="h-4 w-4" />

                                                        View

                                                    </Link>

                                                </td>

                                            </tr>
                                        )
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* Pagination */}

                    {!loading &&
                        filteredFreelancers.length >
                            0 && (
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    border-t
                                    border-slate-200
                                    px-6
                                    py-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <p className="text-sm text-slate-500">

                                    Showing{" "}

                                    <span className="font-semibold text-slate-700">
                                        {startIndex +
                                            1}
                                    </span>

                                    {" "}to{" "}

                                    <span className="font-semibold text-slate-700">
                                        {Math.min(
                                            startIndex +
                                                PAGE_SIZE,
                                            filteredFreelancers.length
                                        )}
                                    </span>

                                    {" "}of{" "}

                                    <span className="font-semibold text-slate-700">
                                        {
                                            filteredFreelancers.length
                                        }
                                    </span>

                                    {" "}freelancers

                                </p>

                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage(
                                                (
                                                    current
                                                ) =>
                                                    Math.max(
                                                        1,
                                                        current -
                                                            1
                                                    )
                                            )
                                        }
                                        disabled={
                                            safePage ===
                                            1
                                        }
                                        className="
                                            inline-flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            border-slate-200
                                            text-slate-600
                                            transition
                                            hover:bg-slate-50
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >

                                        <ChevronLeft className="h-4 w-4" />

                                    </button>

                                    <span className="min-w-[80px] text-center text-sm font-medium text-slate-600">
                                        Page{" "}
                                        {
                                            safePage
                                        }{" "}
                                        of{" "}
                                        {
                                            totalPages
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage(
                                                (
                                                    current
                                                ) =>
                                                    Math.min(
                                                        totalPages,
                                                        current +
                                                            1
                                                    )
                                            )
                                        }
                                        disabled={
                                            safePage ===
                                            totalPages
                                        }
                                        className="
                                            inline-flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            border-slate-200
                                            text-slate-600
                                            transition
                                            hover:bg-slate-50
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >

                                        <ChevronRight className="h-4 w-4" />

                                    </button>

                                </div>

                            </div>
                        )}

                </div>

            </div>

        </main>
    );
}