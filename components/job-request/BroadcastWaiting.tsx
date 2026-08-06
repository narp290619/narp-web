"use client";

import WaitingLayout from "./WaitingLayout";

interface BroadcastWaitingProps {
    requestId: string;
}

export default function BroadcastWaiting({
    requestId,
}: BroadcastWaitingProps) {
    return (
        <WaitingLayout
            title="Looking for nearby freelancers"
            description="We're notifying nearby verified freelancers."
        >
            <div className="w-full rounded-lg bg-slate-100 p-4">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                    Request ID
                </p>

                <p className="mt-1 break-all font-mono text-sm">
                    {requestId}
                </p>

            </div>

        </WaitingLayout>
    );
}