"use client";

import { ReactNode } from "react";

interface Props {

    title: string;

    children: ReactNode;

}

export default function PaymentSection({

    title,

    children,

}: Props) {

    return (

        <section
            className="
                rounded-3xl
                border
                bg-white
                p-8
                shadow-sm
            "
        >

            <h2
                className="
                    mb-6
                    text-2xl
                    font-bold
                "
            >

                {title}

            </h2>

            {children}

        </section>

    );

}