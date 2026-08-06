// "use client";

// import { useState } from "react";

// const categories = [
//     "All",
//     "Construction",
//     "Electrical",
//     "Cleaning",
//     "Beauty",
//     "Automotive",
//     "Technology",
//     "Education",
//     "Health",
// ];

// export default function ServiceCategories() {

//     const [selected, setSelected] = useState("All");

//     return (

//         <div
//             className="
//                 mb-12
//                 flex
//                 flex-wrap
//                 justify-center
//                 gap-3
//             "
//         >

//             {categories.map((category) => (

//                 <button
//                     key={category}
//                     onClick={() => setSelected(category)}
//                     className={`
//                         rounded-full
//                         px-6
//                         py-3
//                         text-sm
//                         font-semibold
//                         transition-all

//                         ${
//                             selected === category
//                                 ? "bg-orange-500 text-white shadow-lg"
//                                 : "bg-slate-100 text-slate-600 hover:bg-orange-100"
//                         }
//                     `}
//                 >

//                     {category}

//                 </button>

//             ))}

//         </div>

//     );
// }


"use client";

interface Props {
    categories: string[];
    selected: string;
    onSelect: (category: string) => void;
}

export default function ServiceCategories({
    categories,
    selected,
    onSelect,
}: Props) {
    return (

        <div
            className="
                mb-12
                flex
                flex-wrap
                justify-center
                gap-3
            "
        >

            {categories.map((category) => (

                // <button
                //     key={category}
                //     onClick={() => onSelect(category)}
                //     className={`
                //         rounded-full
                //         px-6
                //         py-3
                //         text-sm
                //         font-semibold
                //         transition-all

                //         ${selected === category
                //             ? "bg-orange-500 text-white shadow-lg"
                //             : "bg-slate-100 text-slate-600 hover:bg-orange-100"
                //         }
                //     `}
                // >

                <button
                    key={category}
                    onClick={() => {
                        console.log("Clicked:", category);
                        onSelect(category);
                    }}
                    className={`
                        rounded-full
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        transition-all

                        ${selected === category
                            ? "bg-orange-500 text-white shadow-lg"
                            : "bg-slate-100 text-slate-600 hover:bg-orange-100"
                        }
                    `}
                >

                    {category}

                </button>

            ))}

        </div>

    );
}