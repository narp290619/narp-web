"use client";

import { ShieldCheck, Wallet } from "lucide-react";

import PaymentFlow from "../ui/PaymentFlow";

export default function PaymentScene() {
    return (
        <div className="flex h-full flex-col bg-white p-6">

            <div className="flex items-center gap-3">

                <div className="rounded-2xl bg-orange-100 p-3">

                    <Wallet className="text-orange-500" />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Protected Payment

                    </h2>

                    <p className="text-sm text-slate-500">

                        Powered by GCash & PayMongo

                    </p>

                </div>

            </div>

            <div className="mt-8 rounded-3xl bg-slate-50 p-6">

                <p className="text-sm text-slate-500">

                    Amount

                </p>

                <p className="mt-2 text-4xl font-black">

                    ₱1,500

                </p>

                <p className="mt-2 text-sm text-slate-500">

                    Home Repair Service

                </p>

            </div>

            <PaymentFlow />

            <div className="mt-auto rounded-3xl bg-green-50 p-5">

                <div className="flex items-center gap-3">

                    <ShieldCheck className="text-green-600" />

                    <div>

                        <p className="font-semibold">

                            Funds Protected

                        </p>

                        <p className="text-sm text-slate-500">

                            Released after successful completion.

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}