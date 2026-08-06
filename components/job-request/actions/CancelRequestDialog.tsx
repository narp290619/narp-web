"use client";

import { useState } from "react";

import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

import { cancelJobRequest }
    from "@/repositories/post-job-request.repository";

interface CancelRequestDialogProps {

    open: boolean;

    requestId: string;

    onClose: () => void;

}

export default function CancelRequestDialog({

    open,

    requestId,

    onClose,

}: CancelRequestDialogProps) {

    const [loading, setLoading] =
        useState(false);

    async function handleCancel() {

        try {

            setLoading(true);

            await cancelJobRequest(requestId);

            onClose();

        } catch (error) {

            console.error(error);

            alert("Unable to cancel request.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <ConfirmDialog

            open={open}

            title="Cancel Request"

            message={
                "Are you sure you want to cancel this booking request? The freelancer will no longer be able to accept it."
            }

            confirmText="Cancel Request"

            loading={loading}

            onCancel={onClose}

            onConfirm={handleCancel}

        />

    );

}