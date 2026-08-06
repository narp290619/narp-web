"use client";

import { useEffect, useState } from "react";

import {
    JobRequest,
    subscribeToJobRequest,
} from "@/repositories/post-job-request.repository";

export function useJobRequest(requestId: string) {

    const [loading, setLoading] = useState(true);

    const [jobRequest, setJobRequest] =
        useState<JobRequest | null>(null);

    useEffect(() => {

        if (!requestId) return;

        const unsubscribe = subscribeToJobRequest(

            requestId,

            (request) => {

                setJobRequest(request);

                setLoading(false);

            },

        );

        return () => unsubscribe();

    }, [requestId]);

    return {

        loading,

        jobRequest,

    };

}