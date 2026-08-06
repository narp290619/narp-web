"use client";

import {

    useEffect,
    useState,

} from "react";

import Image from "next/image";

import {

    ChevronLeft,
    ChevronRight,
    X,

} from "lucide-react";

interface Props {

    open: boolean;

    images: string[];

    initialIndex?: number;

    onClose: () => void;

}

export default function PortfolioLightbox({

    open,

    images,

    initialIndex = 0,

    onClose,

}: Props) {

    const [

        current,

        setCurrent,

    ] = useState(initialIndex);

    useEffect(() => {

        if (open) {

            setCurrent(initialIndex);

        }

    }, [

        initialIndex,

        open,

    ]);

    useEffect(() => {

        if (!open) {

            return;

        }

        function handleKeyDown(

            event: KeyboardEvent,

        ) {

            switch (event.key) {

                case "Escape":

                    onClose();

                    break;

                case "ArrowRight":

                    nextImage();

                    break;

                case "ArrowLeft":

                    previousImage();

                    break;

            }

        }

        window.addEventListener(

            "keydown",

            handleKeyDown,

        );

        return () =>

            window.removeEventListener(

                "keydown",

                handleKeyDown,

            );

    });

    function previousImage() {

        setCurrent((value) =>

            value === 0

                ? images.length - 1

                : value - 1,

        );

    }

    function nextImage() {

        setCurrent((value) =>

            value === images.length - 1

                ? 0

                : value + 1,

        );

    }

    if (

        !open ||

        images.length === 0

    ) {

        return null;

    }

    return (

        <div

            className="

                fixed

                inset-0

                z-[9999]

                flex

                items-center

                justify-center

                bg-black/90

                p-6

            "

            onClick={onClose}

        >

            {/* Close */}

            <button

                type="button"

                onClick={onClose}

                className="

                    absolute

                    right-6

                    top-6

                    rounded-full

                    bg-black/60

                    p-3

                    text-white

                    transition

                    hover:bg-black

                "

            >

                <X size={26} />

            </button>

            {/* Previous */}

            {

                images.length > 1 && (

                    <button

                        type="button"

                        onClick={(event) => {

                            event.stopPropagation();

                            previousImage();

                        }}

                        className="

                            absolute

                            left-6

                            rounded-full

                            bg-black/60

                            p-3

                            text-white

                            transition

                            hover:bg-black

                        "

                    >

                        <ChevronLeft size={34} />

                    </button>

                )

            }

            {/* Image */}

            <div

                onClick={(event) =>

                    event.stopPropagation()

                }

                className="

                    relative

                    h-[85vh]

                    w-full

                    max-w-6xl

                "

            >

                <Image

                    src={images[current]}

                    alt={`Portfolio ${current + 1}`}

                    fill

                    priority

                    className="

                        object-contain

                        select-none

                    "

                />

            </div>

            {/* Next */}

            {

                images.length > 1 && (

                    <button

                        type="button"

                        onClick={(event) => {

                            event.stopPropagation();

                            nextImage();

                        }}

                        className="

                            absolute

                            right-6

                            rounded-full

                            bg-black/60

                            p-3

                            text-white

                            transition

                            hover:bg-black

                        "

                    >

                        <ChevronRight size={34} />

                    </button>

                )

            }

            {/* Counter */}

            {

                images.length > 1 && (

                    <div

                        className="

                            absolute

                            bottom-8

                            rounded-full

                            bg-black/60

                            px-5

                            py-2

                            text-sm

                            font-medium

                            text-white

                        "

                    >

                        {current + 1}

                        {" / "}

                        {images.length}

                    </div>

                )

            }

        </div>

    );

}