// // "use client";

// // import { useMemo, useState } from "react";
// // import { useSkills } from "@/hooks/useSkills";
// // import Container from "@/components/shared/Container";

// // import ServicesGrid from "@/components/marketing/services/ServiceGrid";
// // import AIServiceFinder from "@/components/services/AIServiceFinder";
// // import PageContainer from "@/components/shared/PageContainer";
// // import ServiceStats from "@/components/services/ServiceStats";
// // import ServiceCategories from "@/components/services/ServiceCategories";

// // export default function ServicesPage() {

// //     const { skills, loading } = useSkills();

// //     const [selectedCategory, setSelectedCategory] = useState("All");

// //     const categories = useMemo(() => {

// //         return [

// //             "All",

// //             ...Array.from(
// //                 new Set(
// //                     skills.map(skill => skill.category)
// //                 )
// //             ).sort(),

// //         ];

// //     }, [skills]);

// //     return (
// //         <PageContainer>

// //             <Container>

// //                 <section className="mb-20 text-center">

// //                     <div className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-orange-600">

// //                         Explore Services

// //                     </div>

// //                     <h1 className="mt-8 text-6xl font-extrabold leading-tight">

// //                         Find the Perfect
// //                         <span className="block text-orange-500">
// //                             Professional
// //                         </span>

// //                     </h1>

// //                     <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-600">

// //                         Browse hundreds of verified services,
// //                         discover skilled professionals nearby,
// //                         and let NARP AI recommend the best match.

// //                     </p>

// //                 </section>

// //                 <ServiceStats />

// //                 <AIServiceFinder />

// //                 <section className="mb-10">

// //                     <h2 className="text-4xl font-bold">

// //                         Browse Popular Services

// //                     </h2>

// //                     <p className="mt-3 text-slate-600">

// //                         Explore verified skills available across the Philippines.

// //                     </p>

// //                 </section>

// //                 <ServiceCategories
// //                     categories={categories}
// //                     selected={selectedCategory}
// //                     onSelect={setSelectedCategory}
// //                 />

// //                 <ServicesGrid
// //                     selectedCategory={selectedCategory}
// //                 />

// //             </Container>

// //         </PageContainer>

// //     );

// // }


// "use client";

// import { useMemo, useState } from "react";

// import Container from "@/components/shared/Container";
// import PageContainer from "@/components/shared/PageContainer";

// import { useSkills } from "@/hooks/useSkills";

// import AIServiceFinder from "@/components/services/AIServiceFinder";
// import ServiceCategories from "@/components/services/ServiceCategories";
// import ServiceStats from "@/components/services/ServiceStats";
// import ServiceGrid from "@/components/services/ServicesGrid";


// export default function ServicesPage() {
//     const { skills, loading } = useSkills();

//     const [selectedCategory, setSelectedCategory] = useState("All");

//     const categories = useMemo(() => {
//         return [
//             "All",
//             ...Array.from(
//                 new Set(
//                     skills.map((skill) => skill.category)
//                 )
//             ).sort(),
//         ];
//     }, [skills]);

//     const filteredSkills =
//         selectedCategory === "All"
//             ? skills
//             : skills.filter(
//                 (skill) =>
//                     skill.category.trim().toLowerCase() ===
//                     selectedCategory.trim().toLowerCase()
//             );

//     return (
//         <PageContainer>
//             <Container>

//                 {/* Hero */}

//                 <section className="mb-20 text-center">

//                     <div className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-orange-600">
//                         Explore Services
//                     </div>

//                     <h1 className="mt-8 text-6xl font-extrabold leading-tight">
//                         Find the Perfect
//                         <span className="block text-orange-500">
//                             Freelancer
//                         </span>
//                     </h1>

//                     <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-600">
//                         Browse hundreds of verified services,
//                         discover skilled freelancers nearby,
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

//                 <ServiceGrid
//                     skills={filteredSkills}
//                     loading={loading}
//                     // selectedCategory={selectedCategory}
//                 />

//             </Container>
//         </PageContainer>
//     );
// }





"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import Container from "@/components/shared/Container";
import PageContainer from "@/components/shared/PageContainer";

import { useSkills } from "@/hooks/useSkills";
import { useCategories } from "@/hooks/useCategories";

import AIServiceFinder from "@/components/services/AIServiceFinder";
import ServiceCategories from "@/components/services/ServiceCategories";
import ServiceStats from "@/components/services/ServiceStats";
import ServiceGrid from "@/components/services/ServicesGrid";

import { Layers } from "lucide-react";

export default function ServicesPage() {
    const { skills, loading: skillsLoading } = useSkills();
    const { categories, loading: categoriesLoading } = useCategories();

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [shouldScrollToSkills, setShouldScrollToSkills] = useState(false);

    const skillsSectionRef = useRef<HTMLDivElement>(null);

    // Read the category slug from the URL.
    useEffect(() => {
        if (categoriesLoading) return;

        const syncCategoryFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const categorySlug = params.get("category");

            if (!categorySlug) {
                setSelectedCategory("All");
                return;
            }

            const matchedCategory = categories.find(
                (category) => category.slug === categorySlug
            );

            setSelectedCategory(
                matchedCategory ? matchedCategory.slug : "All"
            );
        };

        syncCategoryFromUrl();

        window.addEventListener("popstate", syncCategoryFromUrl);

        return () => {
            window.removeEventListener("popstate", syncCategoryFromUrl);
        };
    }, [categories, categoriesLoading]);

    // Find the selected parent category.
    const activeCategory = useMemo(() => {
        if (selectedCategory === "All") return null;

        return (
            categories.find(
                (category) => category.slug === selectedCategory
            ) ?? null
        );
    }, [categories, selectedCategory]);

    // Scroll after the selected category has been rendered.
    // Scroll the browser window to the skills section.
    useEffect(() => {
        if (!shouldScrollToSkills) return;

        const timeout = window.setTimeout(() => {
            const element = skillsSectionRef.current;

            if (element) {
                const elementPosition =
                    element.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: elementPosition - 120,
                    behavior: "smooth",
                });
            }

            setShouldScrollToSkills(false);
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [shouldScrollToSkills, selectedCategory, activeCategory]);

    // Select category and update URL.
    const handleCategorySelect = (category: string) => {
        console.log("Category selected:", category);

        setSelectedCategory(category);

        const url = new URL(window.location.href);

        if (category === "All") {
            url.searchParams.delete("category");
        } else {
            url.searchParams.set("category", category);
        }

        window.history.pushState({}, "", url.toString());

        setShouldScrollToSkills(true);
    };

    // Filter skills by the selected parent category.
    const filteredSkills = useMemo(() => {
        if (selectedCategory === "All") {
            return skills;
        }

        if (!activeCategory) {
            return [];
        }

        return skills.filter(
            (skill) =>
                skill.category?.trim().toLowerCase() ===
                activeCategory.name.trim().toLowerCase()
        );
    }, [skills, activeCategory, selectedCategory]);

    // Find the first skill with an available category image.
    const categoryImageSkill = useMemo(() => {
        return filteredSkills.find(
            (skill) =>
                skill.skillSampleImage?.trim() ||
                skill.image?.trim()
        );
    }, [filteredSkills]);

    const categoryHeroImage =
        categoryImageSkill?.skillSampleImage?.trim() ||
        categoryImageSkill?.image?.trim() ||
        "/images/placeholders/service-placeholder.jpg";

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
                            Freelancer
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-600">
                        Browse hundreds of verified services,
                        discover skilled freelancers nearby,
                        and let NARP AI recommend the best match.
                    </p>
                </section>

                <ServiceStats />

                <AIServiceFinder />

                {/* Services Heading */}
                <section className="mb-10">
                    <h2 className="text-4xl font-bold">
                        Browse Popular Services
                    </h2>

                    <p className="mt-3 text-slate-600">
                        Explore verified skills available across the Philippines.
                    </p>
                </section>

                {/* Parent Category Filters */}
                {categoriesLoading ? (
                    <div className="mb-12 text-center text-slate-500">
                        Loading categories...
                    </div>
                ) : (
                    <ServiceCategories
                        categories={categories}
                        selected={selectedCategory}
                        onSelect={handleCategorySelect}
                    />
                )}

                {/* Selected Parent Category Information */}
                {activeCategory && (
                    <section className="mb-12 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-lg">
                        <div className="grid md:grid-cols-2">

                            {/* Category Image */}
                            <div className="relative min-h-[280px] md:min-h-[340px]">
                                <Image
                                    src={categoryHeroImage}
                                    alt={activeCategory.name}
                                    fill
                                    sizes="(max-width:768px) 100vw, 50vw"
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                <div className="absolute bottom-6 left-6 rounded-2xl bg-white p-3 shadow-xl">
                                    {categoryImageSkill?.image?.trim() ? (
                                        <Image
                                            src={categoryImageSkill.image.trim()}
                                            alt={`${activeCategory.name} icon`}
                                            width={48}
                                            height={48}
                                            className="h-12 w-12 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <Layers className="h-12 w-12 p-2 text-orange-500" />
                                    )}
                                </div>
                            </div>

                            {/* Category Information */}
                            <div className="flex flex-col justify-center p-8 md:p-12">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                                    <Layers size={16} />
                                    Parent Category
                                </div>

                                <h2 className="mt-6 text-3xl font-extrabold text-slate-900 md:text-4xl">
                                    {activeCategory.name}
                                </h2>

                                <p className="mt-5 leading-8 text-slate-600">
                                    {activeCategory.description ||
                                        `Discover trusted professionals offering ${activeCategory.name.toLowerCase()} services through NARP.`}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <div className="rounded-2xl bg-orange-50 px-5 py-3">
                                        <p className="text-2xl font-bold text-orange-600">
                                            {filteredSkills.length}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            Available Services
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 px-5 py-3">
                                        <p className="text-2xl font-bold text-slate-900">
                                            {filteredSkills.reduce(
                                                (total, skill) =>
                                                    total +
                                                    (Number(skill.totalMembers) || 0),
                                                0
                                            )}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            Freelancers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Skills Section */}
                <div
                    ref={skillsSectionRef}
                    className="scroll-mt-32"
                >
                    <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold">
                                {activeCategory
                                    ? `${activeCategory.name} Services`
                                    : "Available Services"}
                            </h2>

                            <p className="mt-2 text-slate-600">
                                {activeCategory
                                    ? `Explore services available under ${activeCategory.name}.`
                                    : "Browse all available services on NARP."}
                            </p>
                        </div>

                        <div className="rounded-full bg-orange-50 px-5 py-2 text-sm font-semibold text-orange-600">
                            {filteredSkills.length} Services
                        </div>
                    </section>

                    <ServiceGrid
                        skills={filteredSkills}
                        loading={skillsLoading || categoriesLoading}
                    />
                </div>

            </Container>
        </PageContainer>
    );
}
