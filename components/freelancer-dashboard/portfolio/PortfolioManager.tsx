"use client";

import { useCallback, useEffect, useState } from "react";

import {
    deletePortfolioImage,
    getPortfolio,
} from "@/repositories/portfolio.repository";

import PortfolioUploader from "./PortfolioUploader";
import PortfolioGrid from "./PortfolioGrid";
import PortfolioLightbox from "./PortfolioLightbox";

interface Props {

    memberId: string;

}

export default function PortfolioManager({

    memberId,

}: Props) {

    const [

        images,

        setImages,

    ] = useState<string[]>([]);

    const [

        loading,

        setLoading,

    ] = useState(true);

    const [

        lightboxOpen,

        setLightboxOpen,

    ] = useState(false);

    const [

        selectedIndex,

        setSelectedIndex,

    ] = useState(0);

    const refreshPortfolio = useCallback(

        async () => {

            try {

                const data =

                    await getPortfolio(memberId);

                setImages(data);

            } finally {

                setLoading(false);

            }

        },

        [memberId],

    );

    useEffect(() => {

        refreshPortfolio();

    }, [

        refreshPortfolio,

    ]);

    async function handleDelete(

        index: number,

    ) {

        const confirmed = window.confirm(

            "Delete this portfolio image?",

        );

        if (!confirmed) {

            return;

        }

        try {

            await deletePortfolioImage(

                memberId,

                images[index],

            );

            refreshPortfolio();

        }

        catch (error) {

            console.error(error);

            alert("Unable to delete image.");

        }

    }

    return (

        <div
            className="
                space-y-8
            "
        >

            <PortfolioUploader

                memberId={memberId}

                onUploaded={refreshPortfolio}

            />

            {

                loading ? (

                    <div
                        className="
                            rounded-2xl
                            border
                            bg-white
                            p-10
                            text-center
                            text-slate-500
                        "
                    >

                        Loading portfolio...

                    </div>

                ) : (

                    <PortfolioGrid

                        images={images}

                        onOpen={(index) => {

                            setSelectedIndex(index);

                            setLightboxOpen(true);

                        }}

                        onDelete={handleDelete}

                    />

                )

            }

            <PortfolioLightbox

                open={lightboxOpen}

                images={images}

                initialIndex={selectedIndex}

                onClose={() =>

                    setLightboxOpen(false)

                }

            />

        </div>

    );

}