// import Container from "@/components/layout/Container";

// import ServiceGrid from "./ServiceGrid";
// import ViewAllButton from "./ViewAllButton";

// export default function Services() {
//     return (
//         <section className="py-28">
//             <Container>
//                 <div className="text-center">
//                     <h2 className="text-5xl font-bold">
//                         Browse Popular Services
//                     </h2>

//                     <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
//                         Discover trusted freelancers for every project,
//                         from home repairs to specialized services.
//                     </p>
//                 </div>

//                 <ServiceGrid />

//                 <ViewAllButton />
//             </Container>
//         </section>
//     );
// }


import Container from "@/components/layout/Container";

import ViewAllButton from "./ViewAllButton";
import MarketingServiceGrid from "./MarketingServiceGrid";

export default function Services() {
    return (
        <section
            className="
                relative
                overflow-hidden
                bg-gradient-to-b
                from-white
                to-orange-50/30
                py-28
            "
        >
            {/* Background glow */}

            <div
                className="
                    absolute
                    left-1/2
                    top-0

                    h-96
                    w-96

                    -translate-x-1/2

                    rounded-full

                    bg-orange-200/30

                    blur-3xl
                "
            />

            <Container>

                <div
                    className="
                        relative
                        mx-auto
                        max-w-3xl
                        text-center
                    "
                >

                    {/* Badge */}

                    <div
                        className="
                            inline-flex
                            items-center

                            rounded-full

                            bg-orange-100

                            px-5
                            py-2

                            text-sm
                            font-semibold
                            uppercase
                            tracking-widest

                            text-orange-600
                        "
                    >
                        Most Popular Services
                    </div>

                    <h2
                        className="
                            mt-8

                            text-5xl

                            font-bold

                            leading-tight

                            text-slate-900
                        "
                    >
                        Find Skilled Freelancers
                        <br />
                        Across the Philippines
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-6
                            max-w-2xl

                            text-lg
                            leading-8

                            text-slate-600
                        "
                    >
                        Discover trusted freelancers for home repairs,
                        construction, cleaning, beauty, technology,
                        education, transportation, and hundreds of
                        other services available through NARP.
                    </p>

                </div>

                <MarketingServiceGrid />

                <ViewAllButton />

            </Container>

        </section>
    );
}