// // "use client";

// // import { useState } from "react";

// // const categories = [
// //     "All",
// //     "Construction",
// //     "Electrical",
// //     "Cleaning",
// //     "Beauty",
// //     "Automotive",
// //     "Technology",
// //     "Education",
// //     "Health",
// // ];

// // export default function ServiceCategories() {

// //     const [selected, setSelected] = useState("All");

// //     return (

// //         <div
// //             className="
// //                 mb-12
// //                 flex
// //                 flex-wrap
// //                 justify-center
// //                 gap-3
// //             "
// //         >

// //             {categories.map((category) => (

// //                 <button
// //                     key={category}
// //                     onClick={() => setSelected(category)}
// //                     className={`
// //                         rounded-full
// //                         px-6
// //                         py-3
// //                         text-sm
// //                         font-semibold
// //                         transition-all

// //                         ${
// //                             selected === category
// //                                 ? "bg-orange-500 text-white shadow-lg"
// //                                 : "bg-slate-100 text-slate-600 hover:bg-orange-100"
// //                         }
// //                     `}
// //                 >

// //                     {category}

// //                 </button>

// //             ))}

// //         </div>

// //     );
// // }


// "use client";

// interface Props {
//     categories: string[];
//     selected: string;
//     onSelect: (category: string) => void;
// }

// export default function ServiceCategories({
//     categories,
//     selected,
//     onSelect,
// }: Props) {
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

//                 // <button
//                 //     key={category}
//                 //     onClick={() => onSelect(category)}
//                 //     className={`
//                 //         rounded-full
//                 //         px-6
//                 //         py-3
//                 //         text-sm
//                 //         font-semibold
//                 //         transition-all

//                 //         ${selected === category
//                 //             ? "bg-orange-500 text-white shadow-lg"
//                 //             : "bg-slate-100 text-slate-600 hover:bg-orange-100"
//                 //         }
//                 //     `}
//                 // >

//                 <button
//                     key={category}
//                     onClick={() => {
//                         console.log("Clicked:", category);
//                         onSelect(category);
//                     }}
//                     className={`
//                         rounded-full
//                         px-6
//                         py-3
//                         text-sm
//                         font-semibold
//                         transition-all

//                         ${selected === category
//                             ? "bg-orange-500 text-white shadow-lg"
//                             : "bg-slate-100 text-slate-600 hover:bg-orange-100"
//                         }
//                     `}
//                 >

//                     {category}

//                 </button>

//             ))}

//         </div>

//     );
// }



// "use client";

// import type { ParentCategory } from "@/lib/models/parent-category";

// interface Props {
//     categories: ParentCategory[];
//     selected: string;
//     onSelect: (category: string) => void;
// }

// export default function ServiceCategories({
//     categories,
//     selected,
//     onSelect,
// }: Props) {
//     return (
//         <div className="mb-12 flex flex-wrap justify-center gap-3">

//             {/* All Categories */}
//             <button
//                 onClick={() => onSelect("All")}
//                 className={`
//                     rounded-full
//                     px-6
//                     py-3
//                     text-sm
//                     font-semibold
//                     transition-all

//                     ${selected === "All"
//                         ? "bg-orange-500 text-white shadow-lg"
//                         : "bg-slate-100 text-slate-600 hover:bg-orange-100"
//                     }
//                 `}
//             >
//                 All
//             </button>

//             {/* Parent Categories */}
//             {categories.map((category) => (
//                 <button
//                     key={category.id}
//                     onClick={() => onSelect(category.slug)}
//                     className={`
//                         rounded-full
//                         px-6
//                         py-3
//                         text-sm
//                         font-semibold
//                         transition-all

//                         ${selected === category.slug
//                             ? "bg-orange-500 text-white shadow-lg"
//                             : "bg-slate-100 text-slate-600 hover:bg-orange-100"
//                         }
//                     `}
//                 >
//                     {category.name}
//                 </button>
//             ))}

//         </div>
//     );
// }


"use client";

import type { ParentCategory } from "@/lib/models/parent-category";

interface Props {
    categories: ParentCategory[];
    selected: string;
    onSelect: (category: string) => void;
}

export default function ServiceCategories({
    categories,
    selected,
    onSelect,
}: Props) {
    const handleClick = (category: string) => {
        console.log("BUTTON CLICKED:", category);

        alert(`Category button clicked: ${category}`);

        onSelect(category);
    };

    return (
        <div className="relative z-50 mb-12 flex flex-wrap justify-center gap-3">
            <button
                type="button"
                onClick={() => handleClick("All")}
                className={`rounded-full px-6 py-3 text-sm font-semibold ${selected === "All"
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
            >
                All
            </button>

            {categories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    onClick={() => handleClick(category.slug)}
                    className={`rounded-full px-6 py-3 text-sm font-semibold ${selected === category.slug
                            ? "bg-orange-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                >
                    {category.name}
                </button>
            ))}

            <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                TEST VERSION 123 - CATEGORY COMPONENT UPDATED
            </div>
        </div>
    );
}