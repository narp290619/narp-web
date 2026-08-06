"use client";

import { useRef, useState } from "react";

import { ImagePlus, Loader2 } from "lucide-react";

import {
    uploadPortfolio,
} from "@/repositories/portfolio.repository";

interface Props {

    memberId: string;

    onUploaded: () => void;

}

export default function PortfolioUploader({

    memberId,

    onUploaded,

}: Props) {

    const inputRef =

        useRef<HTMLInputElement>(null);

    const [

        uploading,

        setUploading,

    ] = useState(false);

    async function handleFileSelected(

        event: React.ChangeEvent<HTMLInputElement>,

    ) {

        const file =

            event.target.files?.[0];

        if (!file) {

            return;

        }

        try {

            setUploading(true);

            await uploadPortfolio(

                memberId,

                file,

            );

            onUploaded();

        } catch (error) {

            console.error(error);

            alert("Unable to upload image.");

        } finally {

            setUploading(false);

            event.target.value = "";

        }

    }

    return (

        <div
            className="
                rounded-2xl
                border
                bg-white
                p-6
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <h2
                        className="
                            text-xl
                            font-bold
                        "
                    >

                        Portfolio

                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >

                        Showcase your previous work.

                    </p>

                </div>

                <button

                    type="button"

                    onClick={() =>
                        inputRef.current?.click()
                    }

                    disabled={uploading}

                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-orange-500
                        px-5
                        py-3
                        font-medium
                        text-white
                        transition
                        hover:bg-orange-600
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    {

                        uploading ? (

                            <>

                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                Uploading...

                            </>

                        ) : (

                            <>

                                <ImagePlus
                                    size={18}
                                />

                                Upload Image

                            </>

                        )

                    }

                </button>

            </div>

            <input

                ref={inputRef}

                hidden

                type="file"

                accept="image/*"

                onChange={handleFileSelected}

            />

        </div>

    );

}