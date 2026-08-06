// import { getAllSkills } from "@/repositories/skill.repository";
// import ServiceCard from "../marketing/services/ServiceCard";

// export default async function ServicesGrid() {

//     const skills = await getAllSkills();

//     console.log("Skills received:", skills.length);
//     console.log(skills.map(s => ({
//         title: s.title,
//         category: s.category,
//     })));

//     return (

//         <div
//             className="
//                 mt-14
//                 grid
//                 gap-8
//                 sm:grid-cols-2
//                 lg:grid-cols-3
//                 xl:grid-cols-4
//             "
//         >

//             {skills.map((skill) => (

//                 <ServiceCard

//                     key={skill.id}

//                     skill={skill}

//                 />

//             ))}

//         </div>

//     );

// }


// "use client";

// import { useSkills } from "@/hooks/useSkills";
// import StaggerChildren from "@/components/animations/StaggerChildren";
// import StaggerItem from "@/components/animations/StaggerItem";
// import ServiceCard from "../marketing/services/ServiceCard";

// interface Props {
//     selectedCategory: string;
// }

// export default function ServiceGrid({
//     selectedCategory,
// }: Props) {

//     const { skills, loading } = useSkills();

//     const filteredSkills =
//         selectedCategory === "All"
//             ? skills
//             : skills.filter((skill) =>
//                 skill.category?.trim().toLowerCase() ===
//                 selectedCategory.trim().toLowerCase()
//             );

//     console.log("Selected:", selectedCategory);
//     console.log("Total skills:", skills.length);
//     console.log("Filtered skills:", filteredSkills.length);
//     console.log(filteredSkills);

//     if (loading) {
//         return (
//             <div className="mt-14 text-center">
//                 Loading services...
//             </div>
//         );
//     }

//     return (
//         <StaggerChildren>
//             <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                 {filteredSkills.map((skill) => (
//                     <StaggerItem key={skill.id}>
//                         <ServiceCard skill={skill} />
//                     </StaggerItem>
//                 ))}
//             </div>
//         </StaggerChildren>
//     );
// }


"use client";

import { Skill } from "@/lib/models/skill";
import StaggerChildren from "@/components/animations/StaggerChildren";
import StaggerItem from "@/components/animations/StaggerItem";
import ServiceCard from "../marketing/services/ServiceCard";

interface Props {
    skills: Skill[];
    loading: boolean;
}

export default function ServiceGrid({
    skills,
    loading,
}: Props) {

    if (loading) {
        return (
            <div className="mt-14 text-center">
                Loading...
            </div>
        );
    }

    return (
        <StaggerChildren>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {skills.map((skill) => (
                    <StaggerItem key={skill.id}>
                        <ServiceCard skill={skill} />
                    </StaggerItem>
                ))}
            </div>
        </StaggerChildren>
    );
    // return (
    //     <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    //         {skills.map((skill) => (
    //             <ServiceCard
    //                 key={skill.id}
    //                 skill={skill}
    //             />
    //         ))}
    //     </div>
    // );
}