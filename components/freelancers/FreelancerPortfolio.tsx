// import Image from "next/image";
// import { ImageIcon } from "lucide-react";

// import type { SkillMember } from "@/lib/models/skill-member";

// interface Props {
//     member: SkillMember;
// }

// export default function FreelancerPortfolio({
//     member,
// }: Props) {

//     const images = [
//         member.skillSamplePhotoUrl,
//     ].filter(Boolean) as string[];

//     return (

//         <section className="rounded-3xl border bg-white p-8">

//             <div className="flex items-center gap-3">

//                 <ImageIcon className="text-orange-500" />

//                 <h2 className="text-2xl font-bold">
//                     Portfolio
//                 </h2>

//             </div>

//             {images.length === 0 ? (

//                 <div className="mt-8 rounded-2xl border border-dashed py-20 text-center">

//                     <ImageIcon
//                         size={42}
//                         className="mx-auto text-slate-300"
//                     />

//                     <p className="mt-4 text-slate-500">
//                         No portfolio uploaded yet.
//                     </p>

//                 </div>

//             ) : (

//                 <div className="mt-8 grid gap-6 md:grid-cols-2">

//                     {images.map((image) => (

//                         <div
//                             key={image}
//                             className="overflow-hidden rounded-2xl"
//                         >

//                             <Image
//                                 src={image}
//                                 alt="Portfolio"
//                                 width={900}
//                                 height={700}
//                                 className="
//                                     h-72
//                                     w-full
//                                     object-cover
//                                     transition
//                                     duration-500
//                                     hover:scale-105
//                                 "
//                             />

//                         </div>

//                     ))}

//                 </div>

//             )}

//         </section>

//     );

// }


"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

import type { SkillMember } from "@/lib/models/skill-member";

interface Props {
    member: SkillMember;
}

export default function FreelancerPortfolio({
    member,
}: Props) {

    // Ready for multiple images later
    const photos =

        member.portfolioImages?.length

            ? member.portfolioImages

            : member.skillSamplePhotoUrl

                ? [member.skillSamplePhotoUrl]

                : [];

    const [
        selectedIndex,
        setSelectedIndex,
    ] = useState<number | null>(null);

    useEffect(() => {

        function handleKeyDown(
            event: KeyboardEvent,
        ) {

            if (selectedIndex === null) {

                return;

            }

            switch (event.key) {

                case "Escape":

                    setSelectedIndex(null);

                    break;

                case "ArrowLeft":

                    showPrevious();

                    break;

                case "ArrowRight":

                    showNext();

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

    }, [
        selectedIndex,
    ]);

    useEffect(() => {

        if (selectedIndex !== null) {

            document.body.style.overflow = "hidden";

        } else {

            document.body.style.overflow = "";

        }

        return () => {

            document.body.style.overflow = "";

        };

    }, [
        selectedIndex,
    ]);

    function showPrevious() {

        if (
            selectedIndex === null ||
            photos.length <= 1
        ) {

            return;

        }

        setSelectedIndex(

            selectedIndex === 0
                ? photos.length - 1
                : selectedIndex - 1,

        );

    }

    function showNext() {

        if (
            selectedIndex === null ||
            photos.length <= 1
        ) {

            return;

        }

        setSelectedIndex(

            selectedIndex === photos.length - 1
                ? 0
                : selectedIndex + 1,

        );

    }

    return (

        <>

            <section
                className="
                    rounded-3xl
                    border
                    bg-white
                    p-8
                "
            >

                <div className="flex items-center justify-between">

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Portfolio image viewer">

                        <h2 className="text-2xl font-bold">

                            Portfolio

                        </h2>

                        <p className="mt-2 text-slate-500">

                            Previous work completed by this freelancer.

                        </p>

                    </div>

                </div>

                {

                    photos.length === 0 ? (

                        <div
                            className="
                                mt-8
                                rounded-2xl
                                border-2
                                border-dashed
                                py-20
                                text-center
                                text-slate-500
                            "
                        >

                            No portfolio uploaded yet.

                        </div>

                    ) : (

                        <div
                            className="
                                mt-8
                                grid
                                gap-5
                                sm:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {

                                photos.map((photo, index) => (

                                    <div
                                        key={index}
                                        className="
                                            group
                                            overflow-hidden
                                            rounded-2xl
                                            border
                                        "
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>

                                                setSelectedIndex(index)

                                            }
                                            className="
                                                relative
                                                block
                                                w-full
                                            "
                                        >

                                            <Image
                                                src={photo}
                                                alt={`Portfolio ${index + 1}`}
                                                width={800}
                                                height={600}
                                                className="
                                                    aspect-[4/3]
                                                    w-full
                                                    object-cover
                                                    transition
                                                    duration-500
                                                    group-hover:scale-110
                                                "
                                            />

                                            <div
                                                className="
                                                    absolute
                                                    inset-0
                                                    flex
                                                    items-center
                                                    justify-center
                                                    bg-black/0
                                                    opacity-0
                                                    transition
                                                    duration-300
                                                    group-hover:bg-black/40
                                                    group-hover:opacity-100
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        bg-white/90
                                                        px-4
                                                        py-2
                                                        text-sm
                                                        font-medium
                                                    "
                                                >

                                                    <ZoomIn
                                                        size={18}
                                                    />

                                                    Click to enlarge

                                                </div>

                                            </div>

                                        </button>

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </section>

            {

                selectedIndex !== null && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/90
                            p-4
                        "
                        onClick={() =>

                            setSelectedIndex(null)

                        }
                    >

                        <button
                            type="button"
                            onClick={(event) => {

                                event.stopPropagation();

                                setSelectedIndex(null);

                            }}
                            className="
                                absolute
                                right-6
                                top-6
                                rounded-full
                                bg-white
                                p-2
                                shadow-lg
                            "
                        >

                            <X />

                        </button>

                        {

                            photos.length > 1 && (

                                <button
                                    type="button"
                                    onClick={(event) => {

                                        event.stopPropagation();

                                        showPrevious();

                                    }}
                                    className="
                                        absolute
                                        left-6
                                        rounded-full
                                        bg-white
                                        p-3
                                        shadow-lg
                                    "
                                >

                                    <ChevronLeft />

                                </button>

                            )

                        }

                        <Image
                            src={photos[selectedIndex]}
                            alt="Portfolio"
                            width={1600}
                            height={1200}
                            onClick={(event) =>

                                event.stopPropagation()

                            }
                            className="
                                max-h-[90vh]
                                max-w-[90vw]
                                rounded-2xl
                                object-contain
                            "
                        />

                        {

                            photos.length > 1 && (

                                <button
                                    type="button"
                                    onClick={(event) => {

                                        event.stopPropagation();

                                        showNext();

                                    }}
                                    className="
                                        absolute
                                        right-6
                                        rounded-full
                                        bg-white
                                        p-3
                                        shadow-lg
                                    "
                                >

                                    <ChevronRight />

                                </button>

                            )

                        }

                        <div
                            className="
                                absolute
                                bottom-6
                                rounded-full
                                bg-black/60
                                px-4
                                py-2
                                text-sm
                                text-white
                            "
                        >

                            {selectedIndex + 1} of {photos.length}

                        </div>

                    </div>

                )

            }

        </>

    );

}