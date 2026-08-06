"use client";

import { ReactNode } from "react";

interface WaitingLayoutProps {
    title: string;
    description: string;
    children?: ReactNode;
}

export default function WaitingLayout({
    title,
    description,
    children,
}: WaitingLayoutProps) {
    return (
        <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center p-6">

            <div className="w-full rounded-2xl border bg-white p-10 shadow-sm">

                <div className="flex flex-col items-center gap-6">

                    <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

                    <div className="space-y-2 text-center">

                        <h1 className="text-2xl font-bold">
                            {title}
                        </h1>

                        <p className="text-slate-500">
                            {description}
                        </p>

                    </div>

                    {children}

                </div>

            </div>

        </main>
    );
}