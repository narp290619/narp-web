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
    UserX,
} from "lucide-react";

import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type UserRecord = {
    id: string;

    name?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;

    email?: string;
    phoneNumber?: string;

    gender?: string;
    about?: string;

    profileImageUrl?: string;

    skills?: string[];

    isVerified?: boolean;
    isAdmin?: boolean;
    banned?: boolean;
    isDeleted?: boolean;

    status?: string;

    createdAt?: Date | null;
    lastOnlineStatus?: Date | null;
};

const PAGE_SIZE = 10;

function getDate(
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

function getUserName(
    user: UserRecord
) {
    if (user.name?.trim()) {
        return user.name;
    }

    const fullName = [
        user.firstName,
        user.middleName,
        user.lastName,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || "Unnamed User";
}

function getInitials(
    user: UserRecord
) {
    const name = getUserName(user);

    if (name === "Unnamed User") {
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

function formatLastOnline(
    date: Date | null
) {
    if (!date) {
        return "Unknown";
    }

    return date.toLocaleDateString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}

function UserStatus({
    user,
}: {
    user: UserRecord;
}) {
    if (user.isAdmin) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-purple-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-purple-700
                "
            >
                Admin
            </span>
        );
    }

    if (user.banned) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-red-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-red-700
                "
            >
                <ShieldAlert className="h-3.5 w-3.5" />
                Banned
            </span>
        );
    }

    if (user.isDeleted) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-slate-100
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-slate-600
                "
            >
                <UserX className="h-3.5 w-3.5" />
                Deleted
            </span>
        );
    }

    if (user.isVerified) {
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
            Unverified
        </span>
    );
}

function OnlineStatus({
    status,
}: {
    status?: string;
}) {
    const normalized =
        status?.toLowerCase() ?? "";

    const isOnline =
        normalized === "online";

    return (
        <span className="inline-flex items-center gap-2 text-xs text-slate-500">

            <span
                className={`
                    h-2
                    w-2
                    rounded-full
                    ${isOnline
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }
                `}
            />

            {isOnline
                ? "Online"
                : "Offline"}

        </span>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] =
        useState<UserRecord[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    async function loadUsers() {
        try {
            setLoading(true);
            setError(null);

            const usersRef =
                collection(
                    db,
                    "Users"
                );

            const snapshot =
                await getDocs(usersRef);

            const loadedUsers: UserRecord[] =
                snapshot.docs.map(
                    (document) => {
                        const data =
                            document.data();

                        return {
                            id: document.id,

                            name:
                                typeof data.name ===
                                    "string"
                                    ? data.name
                                    : undefined,

                            firstName:
                                typeof data.firstName ===
                                    "string"
                                    ? data.firstName
                                    : undefined,

                            middleName:
                                typeof data.middleName ===
                                    "string"
                                    ? data.middleName
                                    : undefined,

                            lastName:
                                typeof data.lastName ===
                                    "string"
                                    ? data.lastName
                                    : undefined,

                            email:
                                typeof data.email ===
                                    "string"
                                    ? data.email
                                    : undefined,

                            phoneNumber:
                                typeof data.phoneNumber ===
                                    "string"
                                    ? data.phoneNumber
                                    : undefined,

                            gender:
                                typeof data.gender ===
                                    "string"
                                    ? data.gender
                                    : undefined,

                            about:
                                typeof data.about ===
                                    "string"
                                    ? data.about
                                    : undefined,

                            profileImageUrl:
                                typeof data.profileImageUrl ===
                                    "string"
                                    ? data.profileImageUrl
                                    : undefined,

                            skills:
                                Array.isArray(
                                    data.skills
                                )
                                    ? data.skills.filter(
                                        (
                                            skill: unknown
                                        ): skill is string =>
                                            typeof skill ===
                                            "string"
                                    )
                                    : [],

                            isVerified:
                                data.isVerified ===
                                true,

                            isAdmin:
                                data.isAdmin ===
                                true,

                            banned:
                                data.banned ===
                                true,

                            isDeleted:
                                data.isDeleted ===
                                true,

                            status:
                                typeof data.status ===
                                    "string"
                                    ? data.status
                                    : undefined,

                            createdAt:
                                getDate(
                                    data.createdAt
                                ),

                            lastOnlineStatus:
                                getDate(
                                    data.lastOnlineStatus
                                ),
                        };
                    }
                );

            loadedUsers.sort(
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

            setUsers(
                loadedUsers
            );

            setPage(1);
        } catch (err) {
            console.error(
                "Failed to load users:",
                err
            );

            setError(
                "Unable to load users. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    /*
     * Search
     */

    const filteredUsers =
        useMemo(() => {
            const searchTerm =
                search
                    .trim()
                    .toLowerCase();

            if (!searchTerm) {
                return users;
            }

            return users.filter(
                (user) => {
                    const name =
                        getUserName(
                            user
                        ).toLowerCase();

                    const email =
                        (
                            user.email ??
                            ""
                        ).toLowerCase();

                    const phone =
                        (
                            user.phoneNumber ??
                            ""
                        ).toLowerCase();

                    const status =
                        (
                            user.status ??
                            ""
                        ).toLowerCase();

                    const skills =
                        (
                            user.skills ??
                            []
                        )
                            .join(" ")
                            .toLowerCase();

                    return (
                        name.includes(
                            searchTerm
                        ) ||
                        email.includes(
                            searchTerm
                        ) ||
                        phone.includes(
                            searchTerm
                        ) ||
                        status.includes(
                            searchTerm
                        ) ||
                        skills.includes(
                            searchTerm
                        ) ||
                        user.id
                            .toLowerCase()
                            .includes(
                                searchTerm
                            )
                    );
                }
            );
        }, [users, search]);

    /*
     * Pagination
     */

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredUsers.length /
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

    const paginatedUsers =
        filteredUsers.slice(
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
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>

                            <div>

                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Users
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage users registered on NARP.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={
                                loadUsers
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
                                className={`
                                    h-4
                                    w-4
                                    ${loading
                                        ? "animate-spin"
                                        : ""
                                    }
                                `}
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

                {/* Search */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="relative">

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
                            placeholder="Search by name, email, phone, skill, or user ID..."
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

                        <table className="w-full min-w-[950px]">

                            <thead>

                                <tr className="border-b border-slate-200 bg-slate-50">

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        User
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Contact
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Skills
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

                                                        <div>

                                                            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                                                            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-100" />

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
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

                                ) : paginatedUsers.length ===
                                    0 ? (

                                    <tr>

                                        <td
                                            colSpan={
                                                6
                                            }
                                            className="px-6 py-16 text-center"
                                        >

                                            <Users className="mx-auto h-10 w-10 text-slate-300" />

                                            <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                                No users found
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {search
                                                    ? "Try adjusting your search."
                                                    : "There are no users to display."}
                                            </p>

                                        </td>

                                    </tr>

                                ) : (

                                    paginatedUsers.map(
                                        (
                                            user
                                        ) => (
                                            <tr
                                                key={
                                                    user.id
                                                }
                                                className="transition hover:bg-slate-50"
                                            >

                                                {/* User */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

                                                        {user.profileImageUrl ? (

                                                            <img
                                                                src={
                                                                    user.profileImageUrl
                                                                }
                                                                alt={
                                                                    getUserName(
                                                                        user
                                                                    )
                                                                }
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
                                                                    user
                                                                )}
                                                            </div>

                                                        )}

                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {
                                                                    getUserName(
                                                                        user
                                                                    )
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">
                                                                {
                                                                    user.id
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* Contact */}

                                                <td className="px-6 py-5">

                                                    <div className="space-y-1">

                                                        <p className="text-sm text-slate-700">
                                                            {user.email ??
                                                                "No email"}
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            {user.phoneNumber ??
                                                                "No phone"}
                                                        </p>

                                                    </div>

                                                </td>

                                                {/* Skills */}

                                                <td className="px-6 py-5">

                                                    <div className="flex max-w-[220px] flex-wrap gap-1.5">

                                                        {(
                                                            user.skills ??
                                                            []
                                                        )
                                                            .slice(
                                                                0,
                                                                3
                                                            )
                                                            .map(
                                                                (
                                                                    skill
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            skill
                                                                        }
                                                                        className="
                                                                            rounded-full
                                                                            bg-blue-50
                                                                            px-2
                                                                            py-1
                                                                            text-xs
                                                                            font-medium
                                                                            text-blue-700
                                                                        "
                                                                    >
                                                                        {
                                                                            skill
                                                                        }
                                                                    </span>
                                                                )
                                                            )}

                                                        {(
                                                            user.skills ??
                                                            []
                                                        ).length >
                                                            3 && (
                                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                                                                    +
                                                                    {(
                                                                        user.skills ??
                                                                        []
                                                                    ).length -
                                                                        3}
                                                                </span>
                                                            )}

                                                        {(
                                                            user.skills ??
                                                            []
                                                        ).length ===
                                                            0 && (
                                                                <span className="text-xs text-slate-400">
                                                                    No skills
                                                                </span>
                                                            )}

                                                    </div>

                                                </td>

                                                {/* Status */}

                                                <td className="px-6 py-5">

                                                    <div className="space-y-2">

                                                        <UserStatus
                                                            user={
                                                                user
                                                            }
                                                        />

                                                        <OnlineStatus
                                                            status={
                                                                user.status
                                                            }
                                                        />

                                                    </div>

                                                </td>

                                                {/* Joined */}

                                                <td className="px-6 py-5 text-sm text-slate-500">

                                                    {formatDate(
                                                        user.createdAt ??
                                                        null
                                                    )}

                                                </td>

                                                {/* Action */}

                                                <td className="px-6 py-5 text-right">

                                                    <Link
                                                        href={`/admin/users/${user.id}`}
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
                        filteredUsers.length >
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
                                        {
                                            startIndex +
                                            1
                                        }
                                    </span>

                                    {" "}to{" "}

                                    <span className="font-semibold text-slate-700">
                                        {Math.min(
                                            startIndex +
                                            PAGE_SIZE,
                                            filteredUsers.length
                                        )}
                                    </span>

                                    {" "}of{" "}

                                    <span className="font-semibold text-slate-700">
                                        {
                                            filteredUsers.length
                                        }
                                    </span>

                                    {" "}users

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