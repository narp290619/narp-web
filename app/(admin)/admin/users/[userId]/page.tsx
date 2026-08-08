"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    Mail,
    Phone,
    ShieldCheck,
    ShieldAlert,
    User,
    CalendarDays,
    MapPin,
    BriefcaseBusiness,
    Ban,
    UserX,
    CheckCircle2,
    Clock,
} from "lucide-react";

import {
    doc,
    getDoc,
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

    latitude?: number;
    longitude?: number;
    geohash?: string;

    createdAt?: Date | null;
    lastOnlineStatus?: Date | null;
    updatedLocationAt?: Date | null;
    deletedAt?: Date | null;
    restoreDeadline?: Date | null;
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

function getUserName(user: UserRecord) {
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

function formatDate(date: Date | null) {
    if (!date) {
        return "—";
    }

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatDateTime(date: Date | null) {
    if (!date) {
        return "—";
    }

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function StatusBadge({
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
                    gap-2
                    rounded-full
                    bg-purple-50
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-purple-700
                "
            >
                <ShieldCheck className="h-4 w-4" />
                Administrator
            </span>
        );
    }

    if (user.banned) {
        return (
            <span
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-red-50
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-red-700
                "
            >
                <ShieldAlert className="h-4 w-4" />
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
                    gap-2
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-slate-600
                "
            >
                <UserX className="h-4 w-4" />
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
                    gap-2
                    rounded-full
                    bg-green-50
                    px-3
                    py-1.5
                    text-sm
                    font-semibold
                    text-green-700
                "
            >
                <CheckCircle2 className="h-4 w-4" />
                Verified
            </span>
        );
    }

    return (
        <span
            className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-orange-50
                px-3
                py-1.5
                text-sm
                font-semibold
                text-orange-700
            "
        >
            <Clock className="h-4 w-4" />
            Unverified
        </span>
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Mail;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="
                    mt-0.5
                    flex
                    h-9
                    w-9
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                "
            >
                <Icon className="h-4 w-4 text-slate-500" />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function AdminUserDetailPage() {
    const params = useParams();

    const userId = Array.isArray(params.userId)
        ? params.userId[0]
        : params.userId;

    const [user, setUser] =
        useState<UserRecord | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        async function loadUser() {
            if (!userId) {
                setError("User ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const userRef = doc(
                    db,
                    "Users",
                    userId
                );

                const snapshot =
                    await getDoc(userRef);

                if (!snapshot.exists()) {
                    setError(
                        "User could not be found."
                    );
                    return;
                }

                const data =
                    snapshot.data();

                const loadedUser: UserRecord = {
                    id: snapshot.id,

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
                        data.isVerified === true,

                    isAdmin:
                        data.isAdmin === true,

                    banned:
                        data.banned === true,

                    isDeleted:
                        data.isDeleted === true,

                    status:
                        typeof data.status ===
                        "string"
                            ? data.status
                            : undefined,

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

                    geohash:
                        typeof data.geohash ===
                        "string"
                            ? data.geohash
                            : undefined,

                    createdAt:
                        getDate(
                            data.createdAt
                        ),

                    lastOnlineStatus:
                        getDate(
                            data.lastOnlineStatus
                        ),

                    updatedLocationAt:
                        getDate(
                            data.updatedLocationAt
                        ),

                    deletedAt:
                        getDate(
                            data.deletedAt
                        ),

                    restoreDeadline:
                        getDate(
                            data.restoreDeadline
                        ),
                };

                setUser(loadedUser);
            } catch (err) {
                console.error(
                    "Failed to load user:",
                    err
                );

                setError(
                    "Unable to load this user."
                );
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [userId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">

                <div className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

                        <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />

                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                    <div className="rounded-2xl border border-slate-200 bg-white p-8">

                        <div className="flex items-center gap-5">

                            <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200" />

                            <div className="space-y-3">

                                <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />

                                <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />

                            </div>

                        </div>

                    </div>

                </div>

            </main>
        );
    }

    if (error || !user) {
        return (
            <main className="min-h-screen bg-slate-50">

                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                    <Link
                        href="/admin/users"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-600
                            hover:text-blue-600
                        "
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Users
                    </Link>

                    <div
                        className="
                            mt-8
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            p-8
                            text-center
                        "
                    >
                        <UserX className="mx-auto h-10 w-10 text-red-400" />

                        <h1 className="mt-4 text-lg font-semibold text-red-800">
                            Unable to load user
                        </h1>

                        <p className="mt-2 text-sm text-red-600">
                            {error ??
                                "User could not be found."}
                        </p>

                    </div>

                </div>

            </main>
        );
    }

    const displayName =
        getUserName(user);

    return (
        <main className="min-h-screen bg-slate-50">

            {/* Header */}

            <div className="border-b border-slate-200 bg-white">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-6
                        lg:px-8
                    "
                >

                    <Link
                        href="/admin/users"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-600
                            transition
                            hover:text-blue-600
                        "
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Users
                    </Link>

                </div>

            </div>

            {/* Main */}

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-6
                    py-8
                    lg:px-8
                "
            >

                {/* Profile Header */}

                <section
                    className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            h-32
                            bg-gradient-to-r
                            from-blue-700
                            via-blue-600
                            to-sky-500
                        "
                    />

                    <div className="px-6 pb-7 lg:px-8">

                        <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                                {/* Profile Image */}

                                {user.profileImageUrl ? (

                                    <img
                                        src={
                                            user.profileImageUrl
                                        }
                                        alt={
                                            displayName
                                        }
                                        className="
                                            h-28
                                            w-28
                                            rounded-2xl
                                            border-4
                                            border-white
                                            object-cover
                                            shadow-lg
                                        "
                                    />

                                ) : (

                                    <div
                                        className="
                                            flex
                                            h-28
                                            w-28
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border-4
                                            border-white
                                            bg-blue-100
                                            text-3xl
                                            font-bold
                                            text-blue-700
                                            shadow-lg
                                        "
                                    >
                                        {displayName
                                            .split(" ")
                                            .map(
                                                (
                                                    part
                                                ) =>
                                                    part[0]
                                            )
                                            .join("")
                                            .substring(
                                                0,
                                                2
                                            )
                                            .toUpperCase()}
                                    </div>

                                )}

                                <div className="pb-1">

                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {displayName}
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {user.id}
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">

                                        <StatusBadge
                                            user={
                                                user
                                            }
                                        />

                                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">

                                            <span
                                                className={`
                                                    h-2
                                                    w-2
                                                    rounded-full
                                                    ${
                                                        user.status?.toLowerCase() ===
                                                        "online"
                                                            ? "bg-green-500"
                                                            : "bg-slate-300"
                                                    }
                                                `}
                                            />

                                            {user.status ??
                                                "Unknown"}

                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* Grid */}

                <div className="mt-8 grid gap-8 lg:grid-cols-3">

                    {/* Left */}

                    <div className="space-y-8 lg:col-span-2">

                        {/* About */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        About
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        User profile information
                                    </p>

                                </div>

                            </div>

                            <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-600">
                                {user.about ||
                                    "No information provided."}
                            </p>

                        </section>

                        {/* Skills */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Skills
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Skills associated with this user
                                    </p>

                                </div>

                            </div>

                            {user.skills &&
                            user.skills.length >
                                0 ? (

                                <div className="mt-5 flex flex-wrap gap-2">

                                    {user.skills.map(
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
                                                    px-3
                                                    py-1.5
                                                    text-sm
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

                                </div>

                            ) : (

                                <p className="mt-5 text-sm text-slate-400">
                                    No skills listed.
                                </p>

                            )}

                        </section>

                        {/* Account Information */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                    "
                                >
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>

                                    <h2 className="font-semibold text-slate-900">
                                        Account Information
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Account and verification details
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">

                                <InfoItem
                                    icon={
                                        ShieldCheck
                                    }
                                    label="Verification"
                                    value={
                                        user.isVerified
                                            ? "Verified"
                                            : "Not verified"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        ShieldCheck
                                    }
                                    label="Administrator"
                                    value={
                                        user.isAdmin
                                            ? "Administrator"
                                            : "Regular user"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        ShieldAlert
                                    }
                                    label="Account"
                                    value={
                                        user.banned
                                            ? "Banned"
                                            : user.isDeleted
                                              ? "Deleted"
                                              : "Active"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        CalendarDays
                                    }
                                    label="Joined"
                                    value={formatDate(
                                        user.createdAt ??
                                            null
                                    )}
                                />

                            </div>

                        </section>

                    </div>

                    {/* Right */}

                    <aside className="space-y-8">

                        {/* Contact */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <h2 className="font-semibold text-slate-900">
                                Contact
                            </h2>

                            <div className="mt-5 space-y-5">

                                <InfoItem
                                    icon={
                                        Mail
                                    }
                                    label="Email"
                                    value={
                                        user.email ??
                                        "Not provided"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        Phone
                                    }
                                    label="Phone"
                                    value={
                                        user.phoneNumber ??
                                        "Not provided"
                                    }
                                />

                                <InfoItem
                                    icon={
                                        User
                                    }
                                    label="Gender"
                                    value={
                                        user.gender ??
                                        "Not provided"
                                    }
                                />

                            </div>

                        </section>

                        {/* Activity */}

                        <section
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <h2 className="font-semibold text-slate-900">
                                Activity
                            </h2>

                            <div className="mt-5 space-y-5">

                                <InfoItem
                                    icon={
                                        CalendarDays
                                    }
                                    label="Account Created"
                                    value={formatDateTime(
                                        user.createdAt ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        Clock
                                    }
                                    label="Last Online"
                                    value={formatDateTime(
                                        user.lastOnlineStatus ??
                                            null
                                    )}
                                />

                                <InfoItem
                                    icon={
                                        MapPin
                                    }
                                    label="Location Updated"
                                    value={formatDateTime(
                                        user.updatedLocationAt ??
                                            null
                                    )}
                                />

                            </div>

                        </section>

                        {/* Location */}

                        {(user.latitude !==
                            undefined ||
                            user.longitude !==
                                undefined) && (
                            <section
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-blue-50
                                        "
                                    >
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div>

                                        <h2 className="font-semibold text-slate-900">
                                            Location
                                        </h2>

                                        <p className="text-xs text-slate-400">
                                            Latest location data
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-5 space-y-3 text-sm">

                                    {user.latitude !==
                                        undefined && (
                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Latitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {
                                                    user.latitude
                                                }
                                            </span>
                                        </div>
                                    )}

                                    {user.longitude !==
                                        undefined && (
                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Longitude
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {
                                                    user.longitude
                                                }
                                            </span>
                                        </div>
                                    )}

                                    {user.geohash && (
                                        <div className="flex justify-between gap-4">
                                            <span className="text-slate-400">
                                                Geohash
                                            </span>

                                            <span className="max-w-[180px] truncate font-medium text-slate-700">
                                                {
                                                    user.geohash
                                                }
                                            </span>
                                        </div>
                                    )}

                                </div>

                            </section>
                        )}

                        {/* Account State */}

                        {(user.banned ||
                            user.isDeleted) && (
                            <section
                                className="
                                    rounded-2xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    p-6
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-red-100
                                        "
                                    >
                                        {user.banned ? (
                                            <Ban className="h-5 w-5 text-red-600" />
                                        ) : (
                                            <UserX className="h-5 w-5 text-red-600" />
                                        )}
                                    </div>

                                    <h2 className="font-semibold text-red-800">
                                        Account Status
                                    </h2>

                                </div>

                                <p className="mt-4 text-sm leading-6 text-red-700">

                                    {user.banned
                                        ? "This user is currently banned."
                                        : "This account has been deleted."}

                                </p>

                                {user.deletedAt && (
                                    <p className="mt-3 text-xs text-red-600">
                                        Deleted:{" "}
                                        {formatDateTime(
                                            user.deletedAt
                                        )}
                                    </p>
                                )}

                                {user.restoreDeadline && (
                                    <p className="mt-1 text-xs text-red-600">
                                        Restore deadline:{" "}
                                        {formatDateTime(
                                            user.restoreDeadline
                                        )}
                                    </p>
                                )}

                            </section>
                        )}

                    </aside>

                </div>

            </div>

        </main>
    );
}