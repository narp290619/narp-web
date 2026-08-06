"use client";

import { CheckCircle2 } from "lucide-react";

export default function AcceptedAnimation() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">

                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2
                        className="h-14 w-14 text-green-600"
                        strokeWidth={2.5}
                    />
                </div>

                <h1 className="mt-8 text-3xl font-bold text-slate-900">
                    🎉 Booking Accepted!
                </h1>

                <p className="mt-3 text-slate-600">
                    Your freelancer has accepted your booking request.
                </p>

                <p className="mt-8 text-sm text-slate-500">
                    Redirecting to your booking...
                </p>

            </div>
        </div>
    );
}