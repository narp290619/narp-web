"use client";

import { ReactNode } from "react";

interface Props {

    label: string;

    value?: ReactNode;

    icon?: ReactNode;

    className?: string;

}

export default function BookingInfoCard({

    label,

    value,

    icon,

    className,

}: Props) {

    return (

        <div
            className={`
                rounded-2xl
                border
                bg-white
                p-5
                shadow-sm
                ${className ?? ""}
            `}
        >

            <div className="flex items-center gap-3">

                {icon && (

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-orange-50
                            text-orange-500
                        "
                    >
                        {icon}
                    </div>

                )}

                <div className="min-w-0 flex-1">

                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-500
                        "
                    >
                        {label}
                    </p>

                    <div
                        className="
                            mt-1
                            break-words
                            text-base
                            font-semibold
                            text-slate-900
                        "
                    >
                        {value ?? "--"}
                    </div>

                </div>

            </div>

        </div>

    );

}