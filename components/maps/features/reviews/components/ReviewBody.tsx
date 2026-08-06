"use client";

interface Props {

    comment: string;

}

export default function ReviewBody({

    comment,

}: Props) {

    return (

        <p
            className="
                mt-5
                whitespace-pre-wrap
                text-slate-700
            "
        >

            {

                comment ||

                "No comment provided."

            }

        </p>

    );

}