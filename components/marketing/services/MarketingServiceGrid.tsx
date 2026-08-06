// "use client";

// import { useSkills } from "@/hooks/useSkills";
// import ServiceCard from "./ServiceCard";
// import StaggerChildren from "@/components/animations/StaggerChildren";
// import StaggerItem from "@/components/animations/StaggerItem";
// // import { title } from "process";

// interface Props {
//     selectedCategory: string;
// }

// export default function ServiceGrid({
//     selectedCategory,
// }: Props) {
//     const { skills, loading } = useSkills();

//     console.log("Selected:", selectedCategory);

//     console.log(
//         skills.map((skill) => ({
//             title: skill.title,
//             category: skill.category,
//         }))
//     );

//     // const filteredSkills =
//     //     selectedCategory === "All"
//     //         ? skills
//     //         : skills.filter(
//     //             (skill) => skill.category === selectedCategory
//     //         );

//     const filteredSkills =
//         selectedCategory === "All"
//             ? skills
//             : skills.filter((skill) => {
//                 console.log(
//                     `"${skill.category}" === "${selectedCategory}"`,
//                     skill.category === selectedCategory
//                 );

//                 return (
//                     skill.category?.trim().toLowerCase() ===
//                     selectedCategory.trim().toLowerCase()
//                 );
//             });

//     if (loading) {
//         return (
//             <div className="mt-14 text-center">
//                 Loading services...
//             </div>
//         );
//     }

//     // return (
//     //     <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

//     //         {skills.map((skill) => (
//     //             <ServiceCard
//     //                 key={skill.id}
//     //                 skill={skill}
//     //             />
//     //         ))}

//     //     </div>
//     // );

//     return (

//         <StaggerChildren>

//             <div
//                 className="
//                 mt-14
//                 grid
//                 gap-8
//                 sm:grid-cols-2
//                 lg:grid-cols-3
//                 xl:grid-cols-4
//             "
//             >

//                 {filteredSkills.map((skill) => (

//                     <StaggerItem key={skill.id}>

//                         <ServiceCard skill={skill} />

//                     </StaggerItem>

//                 ))}

//             </div>

//         </StaggerChildren>

//     );
// }


// "use client";

// import { Skill } from "@/lib/models/skill";


// import StaggerChildren from "@/components/animations/StaggerChildren";
// import StaggerItem from "@/components/animations/StaggerItem";
// import ServiceCard from "./ServiceCard";

// interface Props {
//     skills: Skill[];
//     loading: boolean;
// }

// export default function MarketingServiceGrid({
//     skills,
//     loading,
// }: Props) {

//     if (loading) {
//         return (
//             <div className="mt-14 text-center">
//                 Loading services...
//             </div>
//         );
//     }

//     if (skills.length === 0) {
//         return (
//             <div className="mt-14 rounded-3xl border border-dashed border-slate-300 p-12 text-center">

//                 <h3 className="text-2xl font-bold text-slate-700">
//                     No services found
//                 </h3>

//                 <p className="mt-3 text-slate-500">
//                     Try selecting another category.
//                 </p>

//             </div>
//         );
//     }

//     return (
//         <StaggerChildren>

//             <div
//                 className="
//                     mt-14
//                     grid
//                     gap-8
//                     sm:grid-cols-2
//                     lg:grid-cols-3
//                     xl:grid-cols-4
//                 "
//             >

//                 {skills.map((skill) => (

//                     <StaggerItem key={skill.id}>

//                         <ServiceCard skill={skill} />

//                     </StaggerItem>

//                 ))}

//             </div>

//         </StaggerChildren>
//     );
// }


"use client";

import { useSkills } from "@/hooks/useSkills";

import ServiceCard from "./ServiceCard";
import StaggerChildren from "@/components/animations/StaggerChildren";
import StaggerItem from "@/components/animations/StaggerItem";

export default function MarketingServiceGrid() {
    const { skills, loading } = useSkills();

    if (loading) {
        return (
            <div className="mt-14 text-center">
                Loading services...
            </div>
        );
    }

    return (
        <StaggerChildren>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {skills.slice(0, 8).map((skill) => (
                    <StaggerItem key={skill.id}>
                        <ServiceCard skill={skill} />
                    </StaggerItem>
                ))}
            </div>
        </StaggerChildren>
    );
}