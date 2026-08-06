"use client";

import { useState } from "react";

import { uploadSelfie } from "@/components/maps/features/booking/services/face-verification.service";

import {
    createVerificationRequest,
    VerificationResult,
    waitForVerificationResult,
} from "@/repositories/face-verification.repository";
import { auth } from "@/lib/firebase";


export type FaceVerificationState =
    | "idle"
    | "capturing"
    | "preview"
    | "uploading"
    | "verifying"
    | "submitted"
    | "success"
    | "failed";

export interface UploadedSelfie {

    // bookingId: string;

    userId: string;

    selfieUrl: string;

}

export function useFaceVerification() {

    const [state, setState] =
        useState<FaceVerificationState>("idle");

    const [image, setImage] =
        useState<string | null>(null);

    function captureCompleted(
        imageData: string,
    ) {

        setImage(imageData);

        setState("preview");

    }

    function retake() {

        setImage(null);

        setState("capturing");

    }

    async function upload() {

        if (!image) {
            throw new Error("No captured image.");
        }

        setState("uploading");

        // Temporary ID for storage path
        const tempId = crypto.randomUUID();

        const uploadResult =
            await uploadSelfie(
                tempId,
                image,
            );

        const user = auth.currentUser;

        return {
            userId: user!.uid,
            selfieUrl: uploadResult.downloadUrl,
        };
    }

    async function verify(
        uploadedSelfie: UploadedSelfie,
    ): Promise<VerificationResult> {

        setState("verifying");

        const requestId = await createVerificationRequest({
            userId: uploadedSelfie.userId,
            selfieUrl: uploadedSelfie.selfieUrl,
        });

        const result = await waitForVerificationResult(requestId);

        if (result.success) {
            setState("success");
        } else {
            setState("failed");
        }

        return result;
    }

    return {

        state,

        image,

        captureCompleted,

        retake,

        upload,

        verify,


    };

}
