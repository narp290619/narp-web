"use client";

import Image from "next/image";
import { Expand } from "lucide-react";

interface Props {

    imageUrl: string;

    index: number;

    onOpen: (index: number) => void;

    onDelete: (index: number) => void;

}

export default function PortfolioImageCard({

    imageUrl,

    index,

    onOpen,

    onDelete,

}: Props) {

    return (

        <div
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                bg-white
                shadow-sm
                transition
                hover:shadow-lg
            "
        >

            


            <button

                type="button"

                onClick={() => onOpen(index)}

                // className="block w-full"
                className="block w-full relative z-10"

            >

                <Image

                    src={imageUrl}

                    alt={`Portfolio ${index + 1}`}

                    width={1200}

                    height={900}

                    className="
                        aspect-[4/3]
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                    "

                />

                <div
                    className="
                        absolute
                        inset-0

                        flex
                        items-center
                        justify-center

                        bg-black/50

                        opacity-0
                        transition

                        group-hover:opacity-100
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2

                            rounded-full
                            bg-white

                            px-5
                            py-3

                            font-medium
                            text-slate-800
                        "
                    >

                        <Expand size={18} />

                        Click to enlarge

                    </div>

                </div>

            </button>

            {/* <button

                type="button"

                onClick={(event) => {

                    event.stopPropagation();

                    onDelete(index);

                }}

                // className="
                //     absolute
                //     right-3
                //     top-3

                //     rounded-full

                //     bg-red-500

                //     p-2

                //     text-white

                //     opacity-0

                //     transition

                //     group-hover:opacity-100

                //     hover:bg-red-600
                // "

                className="
                    absolute
                    right-3
                    top-3
                    z-30
                    rounded-full
                    bg-red-500
                    p-2
                    text-white
                "

            >

                🗑

            </button> */}

            <button
    type="button"
    onClick={() => alert("Delete")}
    className="
    absolute
    top-3
    right-3
    z-50
    rounded-full
    bg-red-600
    p-2
    text-white
"
>
    X
</button>

        </div>

    );

}