"use client";

import clsx from "clsx";

interface Props {

    status: string;

    className?: string;

}

const statusStyles: Record<
    string,
    {
        label: string;

        className: string;
    }
> = {

    pending: {

        label: "Pending",

        className:
            "bg-yellow-100 text-yellow-800 border-yellow-200",

    },

    verified: {

        label: "Verified",

        className:
            "bg-blue-100 text-blue-800 border-blue-200",

    },

    accepted: {

        label: "Accepted",

        className:
            "bg-green-100 text-green-800 border-green-200",

    },

    on_the_way: {

        label: "On the Way",

        className:
            "bg-indigo-100 text-indigo-800 border-indigo-200",

    },

    in_progress: {

        label: "In Progress",

        className:
            "bg-orange-100 text-orange-800 border-orange-200",

    },

    completed: {

        label: "Completed",

        className:
            "bg-emerald-100 text-emerald-800 border-emerald-200",

    },

    cancelled: {

        label: "Cancelled",

        className:
            "bg-red-100 text-red-800 border-red-200",

    },

};

export default function BookingStatusBadge({

    status,

    className,

}: Props) {

    const config =
        statusStyles[status] ??

        {

            label: status,

            className:
                "bg-slate-100 text-slate-700 border-slate-200",

        };

    return (

        <span

            className={clsx(

                "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold",

                config.className,

                className,

            )}

        >

            {config.label}

        </span>

    );

}