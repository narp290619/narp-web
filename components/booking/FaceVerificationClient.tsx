"use client";

import { useRouter } from "next/navigation";

import { useFaceVerification } from "../face-verification/hooks/useFaceVerification";
import FaceVerificationCamera from "../face-verification/FaceVerificationCamera";
import FaceCapturePreview from "../face-verification/FaceCapturePreview";
import { useEffect, useState } from "react";
import { clearJobRequestDraft, getJobRequestDraft, JobRequestSession } from "@/lib/session/jobRequestDraft";
import { createPostJobRequest } from "@/repositories/post-job-request.repository";



export default function FaceVerificationClient() {

    const router = useRouter();

    const verification =
        useFaceVerification();

    const [session, setSession] =
        useState<JobRequestSession | null>(null);

    useEffect(() => {

        const saved =
            getJobRequestDraft();

        if (!saved) {

            router.replace("/");

            return;

        }

        setSession(saved);

    }, [router]);

    if (!session) {

        return (

            <div className="p-8">

                Loading...

            </div>

        );

    }

    return (

        <section
            className="
                rounded-3xl
                border
                bg-white
                p-8
                shadow-sm
            "
        >

            <h1 className="text-3xl font-bold">

                Face Verification

            </h1>

            <p className="mt-2 text-slate-500">

                Verify your identity before
                continuing with payment.

            </p>

            <div className="mt-8 space-y-4">

                <div>

                    <p className="text-sm text-slate-500">
                        Job Request
                    </p>

                    <p className="font-medium">
                        Pending Creation
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        Freelancer
                    </p>

                    <p className="font-medium">
                        {session.freelancer.firstName} {session.freelancer.lastName}
                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        Schedule
                    </p>

                    <p className="font-medium">
                        {session.draft.schedule.date}
                        {" • "}
                        {session.draft.schedule.time}
                    </p>

                </div>

            </div>

            <div className="mt-10">

                {verification.state === "submitted" && (

                    <div
                        className="
                            rounded-xl
                            border
                            border-amber-300
                            bg-amber-50
                            p-4
                            text-amber-800
                        "
                    >
                        Verification request submitted.
                        Returning to your booking...
                    </div>

                )}

                {(verification.state === "idle" ||
                    verification.state === "capturing") && (

                        <FaceVerificationCamera

                            onCapture={
                                verification.captureCompleted
                            }

                        />

                    )}

                {verification.state === "preview" &&
                    verification.image && (

                        <FaceCapturePreview

                            image={verification.image}

                            onRetake={
                                verification.retake
                            }

                            onContinue={async () => {

                                try {

                                    // Upload selfie
                                    const uploadedSelfie =
                                        await verification.upload();

                                    // Verify face
                                    const result =
                                        await verification.verify(uploadedSelfie);

                                    if (!result.success) {

                                        alert("Face verification failed.");

                                        return;

                                    }

                                    // Create PostJobRequest
                                    const requestRef =
                                        await createPostJobRequest(session);

                                    // Clear draft
                                    clearJobRequestDraft();

                                    // Go to waiting page
                                    router.replace(
                                        `/bookings/${requestRef.id}`
                                    );

                                } catch (error) {

                                    console.error(error);

                                    alert("Unable to submit job request.");

                                }

                            }}

                        />

                    )}

            </div>

        </section>

    );

}