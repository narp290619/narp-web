// "use client";

// import { useParams } from "next/navigation";

// export default function JobRequestPage() {
//     const params = useParams();

//     const requestId = params.requestId as string;

//     return (
//         <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center p-8">

//             <div className="w-full rounded-2xl border bg-white p-10 shadow">

//                 <div className="flex flex-col items-center gap-6">

//                     <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

//                     <div className="text-center">

//                         <h1 className="text-2xl font-bold">
//                             Looking for a freelancer
//                         </h1>

//                         <p className="mt-2 text-slate-500">
//                             Your job request has been sent successfully.
//                         </p>

//                         <p className="mt-1 text-slate-500">
//                             Nearby freelancers are being notified.
//                         </p>

//                     </div>

//                     <div className="w-full rounded-lg bg-slate-100 p-4">

//                         <p className="text-xs uppercase tracking-wide text-slate-400">
//                             Request ID
//                         </p>

//                         <p className="mt-1 break-all font-mono text-sm">
//                             {requestId}
//                         </p>

//                     </div>

//                 </div>

//             </div>

//         </main>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import BroadcastWaiting from "@/components/job-request/BroadcastWaiting";
import DirectWaiting from "@/components/job-request/DirectWaiting";

import { useJobRequest } from "@/hooks/useJobRequest";
import CancelRequestDialog from "@/components/job-request/actions/CancelRequestDialog";
import AcceptedAnimation from "@/components/job-request/AcceptedAnimation";

export default function JobRequestPage() {

    const router = useRouter();

    const { requestId } = useParams<{
        requestId: string;
    }>();

    const {
        loading,
        jobRequest,
    } = useJobRequest(requestId);

    const [showCancelDialog, setShowCancelDialog] =
        useState(false);

    useEffect(() => {

        if (!jobRequest) return;

        switch (jobRequest.status) {

            case "accepted":

                console.log("Freelancer accepted!", jobRequest);
                
                break;

            case "cancelled":

                console.log("Request cancelled.");

                break;

            case "expired":

                console.log("Request expired.");

                break;

            default:

                break;

        }

    }, [jobRequest, router]);

    useEffect(() => {

        if (!jobRequest) return;

        if (jobRequest.status !== "accepted") return;

        const timer = setTimeout(() => {

            // Temporary destination until the booking page exists
            // router.replace("/bookings");

            console.log("Redirecting to booking:", jobRequest.id);

            // Later:
            router.replace(`/bookings/${jobRequest.id}`);

        }, 2000);

        return () => clearTimeout(timer);

    }, [jobRequest?.status, jobRequest?.id, router]);

    // if (loading) {

    //     return null;
    //     // TODO:
    //     // return <Loading />;

    // }

    // if (!jobRequest) {

    //     return (

    //         <div className="flex min-h-screen items-center justify-center">

    //             <p className="text-slate-500">

    //                 Job request not found.

    //             </p>

    //         </div>

    //     );

    // }

    // if (jobRequest.freelancerId) {

    //     return (
    //         <>

    //             <DirectWaiting
    //                 requestId={requestId}
    //                 freelancerName={jobRequest.freelancerName ?? "Freelancer"}
    //                 skillId={jobRequest.skillId}
    //                 price={jobRequest.price}
    //                 status={jobRequest.status}
    //                 schedule={
    //                     jobRequest.isAsap
    //                         ? "ASAP"
    //                         : jobRequest.schedule?.toLocaleString() ?? "-"
    //                 }
    //                 onCancelRequest={() =>
    //                     setShowCancelDialog(true)
    //                 }
    //             />

    //             <CancelRequestDialog

    //                 open={showCancelDialog}

    //                 requestId={requestId}

    //                 onClose={() =>
    //                     setShowCancelDialog(false)
    //                 }

    //             />

    //         </>
    //     );

    // }

    if (loading) {
        return null;
    }

    if (!jobRequest) {
        return (
            <div className="p-10">
                Job request not found.
            </div>
        );
    }

    if (jobRequest.status === "accepted") {
        return <AcceptedAnimation />;
    }

    return (
        <DirectWaiting
            requestId={requestId}
            freelancerName={
                jobRequest.freelancerName ?? "Freelancer"
            }
            skillId={jobRequest.skillId}
            price={jobRequest.price}
            status={jobRequest.status}
            schedule={
                jobRequest.isAsap
                    ? "ASAP"
                    : jobRequest.schedule?.toLocaleString() ?? "-"
            }
            onCancelRequest={() =>
                setShowCancelDialog(true)
            }
        />
    );

    return (

        <BroadcastWaiting
            requestId={requestId}
        />

    );

}