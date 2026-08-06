"use client";

import { ReactNode } from "react";

interface JobRequestCardProps {
    skill: string;
    budget: number;
    schedule: string;
    details: string;
    footer?: ReactNode;
}

export default function JobRequestCard({
    skill,
    budget,
    schedule,
    details,
    footer,
}: JobRequestCardProps) {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
                {skill}
            </h2>

            <div className="mt-6 space-y-4">
                <div>
                    <p className="text-sm text-slate-500">
                        Budget
                    </p>

                    <p className="font-medium">
                        ₱{budget.toLocaleString()}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Schedule
                    </p>

                    <p>{schedule}</p>
                </div>

                <div>
                    <p className="text-sm text-slate-500">
                        Description
                    </p>

                    <p>{details}</p>
                </div>
            </div>

            {footer && (
                <div className="mt-6">
                    {footer}
                </div>
            )}
        </div>
    );
}