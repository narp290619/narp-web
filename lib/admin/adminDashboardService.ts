import {
    collection,
    getCountFromServer,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type AdminActivity = {
    id: string;
    type:
    | "booking"
    | "payment"
    | "verification"
    | "withdrawal"
    | "report";

    title: string;
    description: string;
    status?: string;
    createdAt: Date | null;
};

export type AdminDashboardStats = {
    totalUsers: number;
    totalFreelancers: number;
    activeBookings: number;
    totalPayments: number;

    pendingVerifications: number;
    pendingWithdrawals: number;
    reports: number;
    pendingSkillRequests: number;

    recentActivity: AdminActivity[];
};

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

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
    /*
     * ----------------------------------------------------------------------
     * Collections
     * ----------------------------------------------------------------------
     */

    const usersRef = collection(db, "Users");

    const skillMembersRef = collection(
        db,
        "SkillMembers"
    );

    const bookingsRef = collection(
        db,
        "Bookings"
    );

    const paymentReceiptsRef = collection(
        db,
        "PaymentReceipts"
    );

    const freelancerVerificationRef = collection(
        db,
        "FreelancerVerification"
    );

    const withdrawalRequestsRef = collection(
        db,
        "WithdrawalRequests"
    );

    const reportsRef = collection(
        db,
        "Reports"
    );

    const skillRequestsRef = collection(
        db,
        "SkillRequests"
    );

    /*
     * ----------------------------------------------------------------------
     * Dashboard queries
     * ----------------------------------------------------------------------
     */

    const pendingVerificationsQuery = query(
        freelancerVerificationRef,
        where(
            "verificationStatus",
            "==",
            "pending"
        )
    );

    const pendingWithdrawalsQuery = query(
        withdrawalRequestsRef,
        where(
            "status",
            "==",
            "pending"
        )
    );

    const pendingSkillRequestsQuery = query(
        skillRequestsRef,
        where(
            "status",
            "==",
            "pending"
        )
    );

    /*
     * ----------------------------------------------------------------------
     * Basic counts
     * ----------------------------------------------------------------------
     */

    const [
        usersSnapshot,
        bookingsSnapshot,
        pendingVerificationsSnapshot,
        pendingWithdrawalsSnapshot,
        reportsSnapshot,
        pendingSkillRequestsSnapshot,
    ] = await Promise.all([
        getCountFromServer(usersRef),

        getCountFromServer(bookingsRef),

        getCountFromServer(
            pendingVerificationsQuery
        ),

        getCountFromServer(
            pendingWithdrawalsQuery
        ),

        getCountFromServer(
            reportsRef
        ),

        getCountFromServer(
            pendingSkillRequestsQuery
        ),
    ]);

    /*
     * ----------------------------------------------------------------------
     * Unique freelancers
     * ----------------------------------------------------------------------
     */

    const skillMembersSnapshot =
        await getDocs(skillMembersRef);

    const freelancerIds = new Set<string>();

    skillMembersSnapshot.forEach((document) => {
        const data = document.data();

        if (
            typeof data.userId === "string" &&
            data.userId.trim() !== ""
        ) {
            freelancerIds.add(
                data.userId
            );

            return;
        }

        /*
         * Fallback:
         * document ID = userId_skillId
         */

        const documentId = document.id;

        const separatorIndex =
            documentId.lastIndexOf("_");

        if (separatorIndex > 0) {
            const userId =
                documentId.substring(
                    0,
                    separatorIndex
                );

            if (userId.trim() !== "") {
                freelancerIds.add(userId);
            }
        }
    });

    /*
     * ----------------------------------------------------------------------
     * Approved payments
     * ----------------------------------------------------------------------
     */

    const approvedPaymentsQuery = query(
        paymentReceiptsRef,
        where(
            "status",
            "==",
            "approved"
        )
    );

    const approvedPaymentsSnapshot =
        await getDocs(
            approvedPaymentsQuery
        );

    let totalPayments = 0;

    approvedPaymentsSnapshot.forEach(
        (document) => {
            const data = document.data();

            if (
                typeof data.amount === "number" &&
                Number.isFinite(data.amount)
            ) {
                totalPayments += data.amount;
            }
        }
    );

    /*
    * ----------------------------------------------------------------------
    * Recent Activity
    * ----------------------------------------------------------------------
    *
    * Only retrieve the 10 newest documents from each collection.
    *
    * This prevents the dashboard from downloading the entire
    * collection just to display the latest activity.
    */

    const recentBookingsQuery = query(
        bookingsRef,
        orderBy("createdAt", "desc"),
        limit(10)
    );

    const recentPaymentsQuery = query(
        paymentReceiptsRef,
        orderBy("createdAt", "desc"),
        limit(10)
    );

    const recentVerificationQuery = query(
        freelancerVerificationRef,
        orderBy("createdAt", "desc"),
        limit(10)
    );

    const recentWithdrawalsQuery = query(
        withdrawalRequestsRef,
        orderBy("createdAt", "desc"),
        limit(10)
    );

    const recentReportsQuery = query(
        reportsRef,
        orderBy("createdAt", "desc"),
        limit(10)
    );

    const [
        recentBookingsSnapshot,
        recentPaymentsSnapshot,
        recentVerificationSnapshot,
        recentWithdrawalsSnapshot,
        recentReportsSnapshot,
    ] = await Promise.all([
        getDocs(recentBookingsQuery),

        getDocs(recentPaymentsQuery),

        getDocs(recentVerificationQuery),

        getDocs(recentWithdrawalsQuery),

        getDocs(recentReportsQuery),
    ]);

    const activities: AdminActivity[] = [];

    /*
     * Bookings
     */

    recentBookingsSnapshot.forEach((document) => {
        const data = document.data();

        activities.push({
            id: `booking-${document.id}`,
            type: "booking",
            title: "Booking activity",
            description:
                `Booking ${document.id}`,
            status:
                typeof data.status === "string"
                    ? data.status
                    : undefined,
            createdAt:
                getTimestampDate(
                    data.createdAt
                ),
        });
    });

    /*
     * Payments
     */

    recentPaymentsSnapshot.forEach((document) => {
        const data = document.data();

        const amount =
            typeof data.amount === "number"
                ? data.amount
                : 0;

        activities.push({
            id: `payment-${document.id}`,
            type: "payment",
            title: "Payment received",
            description:
                `₱${amount.toLocaleString(
                    "en-PH",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }
                )}`,
            status:
                typeof data.status === "string"
                    ? data.status
                    : undefined,
            createdAt:
                getTimestampDate(
                    data.createdAt
                ),
        });
    });

    /*
     * Freelancer verification
     */

    recentVerificationSnapshot.forEach(
        (document) => {
            const data = document.data();

            activities.push({
                id: `verification-${document.id}`,
                type: "verification",
                title: "Freelancer verification",
                description:
                    `Verification request ${document.id}`,
                status:
                    typeof data.verificationStatus ===
                        "string"
                        ? data.verificationStatus
                        : undefined,
                createdAt:
                    getTimestampDate(
                        data.createdAt
                    ),
            });
        }
    );

    /*
     * Withdrawals
     */

    recentWithdrawalsSnapshot.forEach(
        (document) => {
            const data = document.data();

            activities.push({
                id: `withdrawal-${document.id}`,
                type: "withdrawal",
                title: "Withdrawal request",
                description:
                    `Withdrawal ${document.id}`,
                status:
                    typeof data.status === "string"
                        ? data.status
                        : undefined,
                createdAt:
                    getTimestampDate(
                        data.createdAt
                    ),
            });
        }
    );

    /*
     * Reports
     */

    recentReportsSnapshot.forEach(
        (document) => {
            const data = document.data();

            activities.push({
                id: `report-${document.id}`,
                type: "report",
                title: "New report",
                description:
                    `Report ${document.id}`,
                createdAt:
                    getTimestampDate(
                        data.createdAt
                    ),
            });
        }
    );

    /*
    * Combine all five collections and sort them
    * by newest activity.
    */

    activities.sort((a, b) => {
        const aTime =
            a.createdAt?.getTime() ?? 0;

        const bTime =
            b.createdAt?.getTime() ?? 0;

        return bTime - aTime;
    });

    /*
     * Only show the 10 newest activities.
     */

    const recentActivity =
        activities.slice(0, 10);

    /*
     * ----------------------------------------------------------------------
     * Return
     * ----------------------------------------------------------------------
     */

    return {
        totalUsers:
            usersSnapshot.data().count,

        totalFreelancers:
            freelancerIds.size,

        activeBookings:
            bookingsSnapshot.data().count,

        totalPayments,

        pendingVerifications:
            pendingVerificationsSnapshot.data().count,

        pendingWithdrawals:
            pendingWithdrawalsSnapshot.data().count,

        reports:
            reportsSnapshot.data().count,

        pendingSkillRequests:
            pendingSkillRequestsSnapshot.data().count,

        recentActivity,
    };
}