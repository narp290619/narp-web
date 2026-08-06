"use client";

import { useEffect, useState } from "react";

import {
    JobRequest,
    subscribeToPendingJobRequests,
} from "@/repositories/post-job-request.repository";

export function usePendingJobRequests() {

    const [loading, setLoading] =
        useState(true);

    const [requests, setRequests] =
        useState<JobRequest[]>([]);

    useEffect(() => {

        const unsubscribe =
            subscribeToPendingJobRequests(
                (items) => {

                    setRequests(items);

                    setLoading(false);

                },
            );

        return unsubscribe;

    }, []);

    return {
        loading,
        requests,
    };

}