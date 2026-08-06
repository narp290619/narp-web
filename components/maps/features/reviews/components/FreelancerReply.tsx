"use client";

interface Props {

    reply?: string;

}

export default function FreelancerReply({

    reply,

}: Props) {

    if (!reply) {

        return null;

    }

    return (

        <div
            className="
                mt-6
                rounded-xl
                border-l-4
                border-orange-500
                bg-orange-50
                p-4
            "
        >

            <h4
                className="
                    font-semibold
                    text-orange-600
                "
            >

                Freelancer Reply

            </h4>

            <p
                className="
                    mt-2
                    whitespace-pre-wrap
                    text-slate-700
                "
            >

                {reply}

            </p>

        </div>

    );

}