"use client";

function formatSchedule(request: {
    isAsap: boolean;
    schedule?: Date;
}) {
    if (request.isAsap) {
        return "ASAP";
    }

    if (!request.schedule) {
        return "-";
    }

    return request.schedule.toLocaleString();
}

import AcceptJobButton from "@/components/job-request/actions/AcceptJobButton";
import JobRequestCard from "@/components/job-request/JobRequestCard";
import { usePendingJobRequests }
    from "@/hooks/usePendingJobRequests";
import { acceptJobRequest } from "@/repositories/post-job-request.repository";

export default function JobRequestsPage() {

    const {
        loading,
        requests,
    } = usePendingJobRequests();

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-8">

            <h1 className="text-3xl font-bold">
                Available Job Requests
            </h1>

            <div className="space-y-6">
                {requests.map((request) => (
                    <JobRequestCard
                        key={request.id}
                        skill={request.skillId}
                        budget={request.price}
                        schedule={formatSchedule(request)}
                        details={request.details}
                        footer={
                            <AcceptJobButton
                                requestId={request.id}
                                onAccept={async () => {
                                    await acceptJobRequest(request.id);
                                }}
                            />
                        }
                    />
                ))}
            </div>

        </div>
    );

}