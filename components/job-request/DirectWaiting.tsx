"use client";

import WaitingLayout from "./WaitingLayout";

interface DirectWaitingProps {

    requestId: string;

    freelancerName: string;

    skillId: string;

    price: number;

    schedule: string;

    status: string;

    onCancelRequest: () => void;

}

export default function DirectWaiting({

    requestId,

    freelancerName,

    skillId,

    price,

    schedule,

    status,

    onCancelRequest,

}: DirectWaitingProps) {
    return (
        <WaitingLayout
            title={`Waiting for ${freelancerName}`}
            description={`${freelancerName} has been notified of your booking request.`}
        >
            <div className="w-full space-y-4">

                <div className="rounded-lg bg-slate-100 p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Freelancer
                    </p>

                    <p className="mt-1 font-semibold">
                        {freelancerName}
                    </p>

                </div>

                <div className="rounded-lg bg-slate-100 p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Service
                    </p>

                    <p className="mt-1 font-semibold">
                        {skillId}
                    </p>

                </div>

                <div className="rounded-lg bg-slate-100 p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Budget
                    </p>

                    <p className="mt-1 font-semibold">
                        ₱{price.toLocaleString()}
                    </p>

                </div>

                <div className="rounded-lg bg-slate-100 p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Schedule
                    </p>

                    <p className="mt-1 font-semibold">
                        {schedule}
                    </p>

                </div>

                <div className="rounded-lg bg-slate-100 p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Status
                    </p>

                    <p className="mt-1 font-semibold capitalize">
                        {status}
                    </p>

                </div>

                {
                    status === "pending" && (

                        <button
                            onClick={onCancelRequest}
                            className="
                                w-full
                                rounded-lg
                                bg-red-500
                                px-4
                                py-3
                                font-semibold
                                text-white
                                transition
                                hover:bg-red-600
                            "
                        >
                            Cancel Request
                        </button>

                    )
                }

            </div>

        </WaitingLayout>
    );
}