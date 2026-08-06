"use client";

interface Props {

    canReply?: boolean;

    onReply?: () => void;

}

export default function ReviewActions({

    canReply,

    onReply,

}: Props) {

    if (!canReply) {

        return null;

    }

    return (

        <div
            className="
                mt-6
                flex
                justify-end
            "
        >

            <button
                onClick={onReply}
                className="
                    rounded-lg
                    bg-orange-500
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-orange-600
                "
            >

                Reply

            </button>

        </div>

    );

}