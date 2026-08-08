import {
    collection,
    getCountFromServer,
    query,
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type AdminDashboardStats = {
    totalUsers: number;
    freelancerMembers: number;
    activeBookings: number;
    paymentReceipts: number;
    pendingVerifications: number;
    pendingWithdrawals: number;
    reports: number;
    pendingSkillRequests: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
    /*
     * Collections
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
     * Bookings
     *
     * Bookings contains the active bookings.
     * We count the documents in this collection.
     */

    const activeBookingsQuery = query(
        bookingsRef
    );

    /*
     * Freelancer Verification
     */

    const pendingVerificationsQuery = query(
        freelancerVerificationRef,
        where(
            "verificationStatus",
            "==",
            "pending"
        )
    );

    /*
     * Withdrawal Requests
     */

    const pendingWithdrawalsQuery = query(
        withdrawalRequestsRef,
        where(
            "status",
            "==",
            "pending"
        )
    );

    /*
     * Skill Requests
     */

    const pendingSkillRequestsQuery = query(
        skillRequestsRef,
        where(
            "status",
            "==",
            "pending"
        )
    );

    /*
     * Run all count queries in parallel.
     */

    const [
        usersSnapshot,
        skillMembersSnapshot,
        bookingsSnapshot,
        paymentReceiptsSnapshot,
        pendingVerificationsSnapshot,
        pendingWithdrawalsSnapshot,
        reportsSnapshot,
        pendingSkillRequestsSnapshot,
    ] = await Promise.all([
        getCountFromServer(usersRef),

        getCountFromServer(
            skillMembersRef
        ),

        getCountFromServer(
            activeBookingsQuery
        ),

        getCountFromServer(
            paymentReceiptsRef
        ),

        getCountFromServer(
            pendingVerificationsQuery
        ),

        getCountFromServer(
            pendingWithdrawalsQuery
        ),

        /*
         * Reports has no status field,
         * so we count all reports for now.
         */

        getCountFromServer(
            reportsRef
        ),

        getCountFromServer(
            pendingSkillRequestsQuery
        ),
    ]);

    return {
        totalUsers:
            usersSnapshot.data().count,

        freelancerMembers:
            skillMembersSnapshot.data().count,

        activeBookings:
            bookingsSnapshot.data().count,

        paymentReceipts:
            paymentReceiptsSnapshot.data().count,

        pendingVerifications:
            pendingVerificationsSnapshot.data().count,

        pendingWithdrawals:
            pendingWithdrawalsSnapshot.data().count,

        reports:
            reportsSnapshot.data().count,

        pendingSkillRequests:
            pendingSkillRequestsSnapshot.data().count,
    };
}