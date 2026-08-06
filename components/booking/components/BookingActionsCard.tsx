"use client";

import { ReactNode } from "react";

interface BookingAction {

    id: string;

    label: string;

    onClick(): void;

    icon?: ReactNode;

    variant?: "primary" | "secondary" | "danger";

    disabled?: boolean;

}

interface Props {

    title?: string;

    actions: BookingAction[];

}

export default function BookingActionsCard({

    title = "Actions",

    actions,

}: Props) {

    return (

        <section
            className="
                rounded-2xl
                border
                bg-white
                p-6
                shadow-sm
            "
        >

            <h2
                className="
                    text-lg
                    font-semibold
                "
            >

                {title}

            </h2>

            <div
                className="
                    mt-5
                    flex
                    flex-wrap
                    gap-3
                "
            >

                {actions.map((action) => (

                    <button

                        key={action.id}

                        type="button"

                        onClick={action.onClick}

                        disabled={action.disabled}

                        className={`

                            inline-flex
                            items-center
                            gap-2

                            rounded-xl

                            px-5
                            py-3

                            font-semibold

                            transition

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            ${

                                action.variant === "danger"

                                    ? "bg-red-500 text-white hover:bg-red-600"

                                    : action.variant === "secondary"

                                        ? "border hover:bg-slate-100"

                                        : "bg-orange-500 text-white hover:bg-orange-600"

                            }

                        `}

                    >

                        {action.icon}

                        {action.label}

                    </button>

                ))}

            </div>

        </section>

    );

}