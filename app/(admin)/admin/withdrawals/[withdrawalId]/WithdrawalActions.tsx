"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    XCircle,
    Loader2,
    ShieldCheck,
} from "lucide-react";

import {
    getFunctions,
    httpsCallable,
} from "firebase/functions";

import { auth } from "@/lib/firebase";

type WithdrawalActionsProps = {
    withdrawalId: string;
    status: string;
    amount: number;
    freelancerName?: string;
};

type ProcessWithdrawalResponse = {
    success: boolean;
    withdrawalId: string;
    action: "approve" | "reject";
};

export default function WithdrawalActions({
    withdrawalId,
    status,
    amount,
    freelancerName,
}: WithdrawalActionsProps) {
    const router = useRouter();

    const [actionLoading, setActionLoading] =
        useState<"approve" | "reject" | null>(null);

    /*
     * =========================================================
     * CHECK WHETHER REQUEST IS PENDING
     * =========================================================
     */

    const isPending =
        status?.toLowerCase() === "pending";

    /*
     * =========================================================
     * PROCESS WITHDRAWAL
     * =========================================================
     */

    const processWithdrawal = async (
        action: "approve" | "reject"
    ) => {
        /*
         * -----------------------------------------------------
         * Verify request is still pending
         * -----------------------------------------------------
         */

        if (!isPending) {
            alert(
                "This withdrawal request has already been processed."
            );

            return;
        }

        /*
         * -----------------------------------------------------
         * Verify admin is signed in
         * -----------------------------------------------------
         */

        const currentUser =
            auth.currentUser;

        if (!currentUser) {
            alert(
                "You must be signed in as an admin."
            );

            return;
        }

        /*
         * -----------------------------------------------------
         * Confirmation
         * -----------------------------------------------------
         */

        const displayName =
            freelancerName ||
            "this freelancer";

        const message =
            action === "approve"
                ? `Approve the ₱${amount.toLocaleString()} withdrawal request for ${displayName}?`
                : `Reject the ₱${amount.toLocaleString()} withdrawal request for ${displayName}?`;

        const confirmed =
            window.confirm(message);

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(action);

            /*
             * -------------------------------------------------
             * Get Firebase Functions
             * -------------------------------------------------
             */

            const functions =
                getFunctions(
                    undefined,
                    "asia-southeast1"
                );

            /*
             * -------------------------------------------------
             * Call processWithdrawal Cloud Function
             * -------------------------------------------------
             */

            const processWithdrawalFunction =
                httpsCallable<
                    {
                        withdrawalId: string;
                        action: "approve" | "reject";
                    },
                    ProcessWithdrawalResponse
                >(
                    functions,
                    "processWithdrawal"
                );

            const result =
                await processWithdrawalFunction({
                    withdrawalId,
                    action,
                });

            /*
             * -------------------------------------------------
             * Verify response
             * -------------------------------------------------
             */

            if (!result.data?.success) {
                throw new Error(
                    "Withdrawal processing failed."
                );
            }

            /*
             * -------------------------------------------------
             * Success message
             * -------------------------------------------------
             */

            alert(
                action === "approve"
                    ? "Withdrawal approved successfully."
                    : "Withdrawal rejected successfully."
            );

            /*
             * -------------------------------------------------
             * Return to withdrawal list
             * -------------------------------------------------
             */

            router.push(
                "/admin/withdrawals"
            );

            router.refresh();
        } catch (error) {
            console.error(
                "Failed to process withdrawal:",
                error
            );

            alert(
                action === "approve"
                    ? "Failed to approve withdrawal. Please try again."
                    : "Failed to reject withdrawal. Please try again."
            );
        } finally {
            setActionLoading(null);
        }
    };

    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <ShieldCheck className="h-5 w-5 text-slate-600" />
                </div>

                <div>

                    <h2 className="font-semibold text-slate-900">
                        Administrative Actions
                    </h2>

                    <p className="text-xs text-slate-400">
                        Process this withdrawal request.
                    </p>

                </div>

            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            {isPending ? (
                <div className="mt-5 flex flex-wrap gap-3">

                    {/* =========================================
                        APPROVE
                    ========================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            processWithdrawal(
                                "approve"
                            )
                        }
                        disabled={
                            actionLoading !== null
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-green-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-green-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {actionLoading ===
                        "approve" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}

                        {actionLoading ===
                        "approve"
                            ? "Processing..."
                            : "Approve Withdrawal"}

                    </button>

                    {/* =========================================
                        REJECT
                    ========================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            processWithdrawal(
                                "reject"
                            )
                        }
                        disabled={
                            actionLoading !== null
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-red-700
                            transition
                            hover:bg-red-100
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {actionLoading ===
                        "reject" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <XCircle className="h-4 w-4" />
                        )}

                        {actionLoading ===
                        "reject"
                            ? "Processing..."
                            : "Reject Withdrawal"}

                    </button>

                </div>
            ) : (
                /* =============================================
                   ALREADY PROCESSED
                ============================================= */

                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">

                    This withdrawal request has already been processed.

                </div>
            )}

        </section>
    );
}