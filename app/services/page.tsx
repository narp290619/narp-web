// "use client";

// import { useMemo, useState } from "react";
// import { useSkills } from "@/hooks/useSkills";
// import Container from "@/components/shared/Container";

// import ServicesGrid from "@/components/marketing/services/ServiceGrid";
// import AIServiceFinder from "@/components/services/AIServiceFinder";
// import PageContainer from "@/components/shared/PageContainer";
// import ServiceStats from "@/components/services/ServiceStats";
// import ServiceCategories from "@/components/services/ServiceCategories";

// export default function ServicesPage() {

//     const { skills, loading } = useSkills();

//     const [selectedCategory, setSelectedCategory] = useState("All");

//     const categories = useMemo(() => {

//         return [

//             "All",

//             ...Array.from(
//                 new Set(
//                     skills.map(skill => skill.category)
//                 )
//             ).sort(),

//         ];

//     }, [skills]);

//     return (
//         <PageContainer>

//             <Container>

//                 <section className="mb-20 text-center">

//                     <div className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-orange-600">

//                         Explore Services

//                     </div>

//                     <h1 className="mt-8 text-6xl font-extrabold leading-tight">

//                         Find the Perfect
//                         <span className="block text-orange-500">
//                             Professional
//                         </span>

//                     </h1>

//                     <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-600">

//                         Browse hundreds of verified services,
//                         discover skilled professionals nearby,
//                         and let NARP AI recommend the best match.

//                     </p>

//                 </section>

//                 <ServiceStats />

//                 <AIServiceFinder />

//                 <section className="mb-10">

//                     <h2 className="text-4xl font-bold">

//                         Browse Popular Services

//                     </h2>

//                     <p className="mt-3 text-slate-600">

//                         Explore verified skills available across the Philippines.

//                     </p>

//                 </section>

//                 <ServiceCategories
//                     categories={categories}
//                     selected={selectedCategory}
//                     onSelect={setSelectedCategory}
//                 />

//                 <ServicesGrid
//                     selectedCategory={selectedCategory}
//                 />

//             </Container>

//         </PageContainer>

//     );

// }


"use client";

import { useMemo, useState } from "react";

import Container from "@/components/shared/Container";
import PageContainer from "@/components/shared/PageContainer";

import { useSkills } from "@/hooks/useSkills";

import AIServiceFinder from "@/components/services/AIServiceFinder";
import ServiceCategories from "@/components/services/ServiceCategories";
import ServiceStats from "@/components/services/ServiceStats";
import ServiceGrid from "@/components/services/ServicesGrid";


export default function ServicesPage() {
    const { skills, loading } = useSkills();

    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = useMemo(() => {
        return [
            "All",
            ...Array.from(
                new Set(
                    skills.map((skill) => skill.category)
                )
            ).sort(),
        ];
    }, [skills]);

    // const filteredSkills = useMemo(() => {
    //     if (selectedCategory === "All") {
    //         return skills;
    //     }

    //     return skills.filter(
    //         (skill) =>
    //             skill.category.trim().toLowerCase() ===
    //             selectedCategory.trim().toLowerCase()
    //     );
    // }, [skills, selectedCategory]);

    // console.log("Selected category:", selectedCategory);


    const filteredSkills =
        selectedCategory === "All"
            ? skills
            : skills.filter(
                (skill) =>
                    skill.category.trim().toLowerCase() ===
                    selectedCategory.trim().toLowerCase()
            );

    return (
        <PageContainer>
            <Container>

                {/* Hero */}

                <section className="mb-20 text-center">

                    <div className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
                        Explore Services
                    </div>

                    <h1 className="mt-8 text-6xl font-extrabold leading-tight">
                        Find the Perfect
                        <span className="block text-orange-500">
                            Professional
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-600">
                        Browse hundreds of verified services,
                        discover skilled professionals nearby,
                        and let NARP AI recommend the best match.
                    </p>

                </section>

                <ServiceStats />

                <AIServiceFinder />

                <section className="mb-10">

                    <h2 className="text-4xl font-bold">
                        Browse Popular Services
                    </h2>

                    <p className="mt-3 text-slate-600">
                        Explore verified skills available across the Philippines.
                    </p>

                </section>

                <ServiceCategories
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                <ServiceGrid
                    skills={filteredSkills}
                    loading={loading}
                    // selectedCategory={selectedCategory}
                />

            </Container>
        </PageContainer>
    );
}