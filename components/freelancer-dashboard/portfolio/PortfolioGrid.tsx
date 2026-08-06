"use client";

import PortfolioImageCard from "./PortfolioImageCard";


interface Props {

    images: string[];

    onOpen: (index: number) => void;

    onDelete: (index: number) => void;

}

export default function PortfolioGrid({

    images,

    onOpen,

    onDelete,

}: Props) {

    if (images.length === 0) {

        return (

            <div
                className="
                    rounded-2xl
                    border-2
                    border-dashed
                    bg-white
                    py-20
                    text-center
                    text-slate-500
                "
            >

                No portfolio images yet.

            </div>

        );

    }

    return (

        <div
            className="
                grid
                gap-6

                sm:grid-cols-2
                lg:grid-cols-3
            "
        >

            {

                images.map((image, index) => (

                    <PortfolioImageCard

                        key={image}

                        imageUrl={image}

                        index={index}

                        onOpen={onOpen}

                        onDelete={onDelete}

                    />

                ))

            }

        </div>

    );

}