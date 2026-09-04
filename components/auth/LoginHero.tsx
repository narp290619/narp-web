"use client";

import {
    BrainCircuit,
    ShieldCheck,
    MapPinned,
    CreditCard,
    ScanFace,
} from "lucide-react";
import AnimatedPhone from "../marketing/phone/AnimatedPhone";
import FloatingPhone from "../marketing/showcase/login/engine/FloatingPhone";
import ShowcasePhone from "../marketing/showcase/login/ShowcasePhone";
import GridPattern from "../marketing/background/GridPattern";
import Spotlight from "../marketing/background/Spotlight";
import FloatingParticles from "../marketing/background/FloatingParticles";
import NetworkBackground from "../marketing/network/NetworkBackground";

const features = [
    {
        icon: BrainCircuit,
        title: "AI Smart Matching",
    },
    {
        icon: ScanFace,
        title: "Face Verification",
    },
    {
        icon: CreditCard,
        title: "Secure Payments",
    },
    {
        icon: MapPinned,
        title: "Live Tracking",
    },
    {
        icon: ShieldCheck,
        title: "Verified Freelancers",
    },
];

export default function LoginHero() {
    return (
        <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">

            {/* <GridPattern />

            <Spotlight /> */}



            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300" />

            <NetworkBackground />

            {/* Decorative blur */}

            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex w-full flex-col justify-between p-14 text-white">

                <div>

                    <div className="flex items-center gap-4">

                        <img
                            src="/images/logo/narp.png"
                            alt="NARP"
                            className="h-16 w-auto"
                        />

                        <div>

                            {/* <h1 className="text-4xl font-black">

                                NARP

                            </h1> */}
                            <img
                                src="/logo/logo_smooth.png"
                                alt="NARP"
                                className="h-6 w-auto"
                            />

                            <p className="text-orange-100">

                                ADMIN CONSOLE

                            </p>

                        </div>

                    </div>

                    <h2 className="mt-12 max-w-lg text-5xl font-bold leading-tight">

                        Manage the Philippines'
                        <br />
                        skilled freelancers platform.

                    </h2>

                    <p className="mt-6 max-w-lg text-lg text-orange-50">

                        Everything you need to manage
                        freelancers, bookings,
                        AI recommendations,
                        payments, and nationwide coverage.

                    </p>

                </div>

                {/* <div className="space-y-5">

                    {features.map((feature) => {

                        const Icon = feature.icon;

                        return (

                            <div
                                key={feature.title}
                                className="flex items-center gap-4"
                            >

                                <div className="rounded-xl bg-white/20 p-3">

                                    <Icon size={22} />

                                </div>

                                <span className="text-lg">

                                    {feature.title}

                                </span>

                            </div>

                        );

                    })}

                </div> */}

                {/* <div className="mt-12 flex justify-center">
                    <AnimatedPhone />
                </div> */}


                <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_380px]">

                    <div className="space-y-5">

                        {features.map((feature) => {

                            const Icon = feature.icon;

                            return (

                                <div
                                    key={feature.title}
                                    className="flex items-center gap-4"
                                >

                                    <div className="rounded-xl bg-white/20 p-3">

                                        <Icon size={22} />

                                    </div>

                                    <span className="text-lg">

                                        {feature.title}

                                    </span>

                                </div>

                            );

                        })}

                    </div>

                    <div className="flex justify-center">

                        <ShowcasePhone />

                    </div>

                </div>

            </div>

        </div>
    );
}


// "use client";

// import {
//     BrainCircuit,
//     ShieldCheck,
//     MapPinned,
//     CreditCard,
//     ScanFace,
// } from "lucide-react";
// import AnimatedPhone from "../marketing/phone/AnimatedPhone";
// import FloatingPhone from "../marketing/showcase/login/engine/FloatingPhone";
// import ShowcasePhone from "../marketing/showcase/login/ShowcasePhone";
// import GridPattern from "../marketing/background/GridPattern";
// import Spotlight from "../marketing/background/Spotlight";
// import FloatingParticles from "../marketing/background/FloatingParticles";
// import NetworkBackground from "../marketing/network/NetworkBackground";

// const features = [
//     {
//         icon: BrainCircuit,
//         title: "AI Smart Matching",
//     },
//     {
//         icon: ScanFace,
//         title: "Face Verification",
//     },
//     {
//         icon: CreditCard,
//         title: "Secure Payments",
//     },
//     {
//         icon: MapPinned,
//         title: "Live Tracking",
//     },
//     {
//         icon: ShieldCheck,
//         title: "Verified Professionals",
//     },
// ];

// export default function LoginHero() {
//     return (
//         <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">

//             {/* <GridPattern />

//             <Spotlight /> */}



//             {/* Background */}

//             <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300" />

//             <NetworkBackground />

//             {/* Decorative blur */}

//             <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

//             <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

//             <div className="relative z-10 flex w-full flex-col justify-between p-14 text-white">

//                 <div className="relative z-10 flex h-full flex-col p-14 text-white">

//                     {/* Logo */}

//                     <div>

//                         <div className="flex items-center gap-4">

//                             <img
//                                 src="/images/logo/narp.png"
//                                 alt="NARP"
//                                 className="h-16 w-19"
//                             />

//                             <div>

//                                 {/* <h1 className="text-4xl font-black">

//                                 NARP

//                             </h1> */}
//                                 <img
//                                     src="/logo/logo_smooth.png"
//                                     alt="NARP"
//                                     className="h-6 w-26"
//                                 />

//                                 <p className="text-orange-100">

//                                     ADMIN CONSOLE

//                                 </p>

//                             </div>

//                         </div>
//                     </div>

//                     {/* Heading */}

//                     <div className="mt-8">

//                         {/* <span
//                             className="
//                                 rounded-full
//                                 border
//                                 border-white/30
//                                 bg-white/10
//                                 px-4
//                                 py-1
//                                 text-sm
//                                 font-medium
//                                 backdrop-blur
//                             "
//                         >
//                             NARP Admin Console
//                         </span> */}

//                         <h1
//                             className="
//                                 mt-6
//                                 max-w-xl
//                                 text-5xl
//                                 font-black
//                                 leading-tight
//                             "
//                         >
//                             Manage the Philippines'
//                             <br />
//                             largest skilled
//                             <br />
//                             professionals marketplace.
//                         </h1>

//                         <p
//                             className="
//                                 mt-6
//                                 max-w-lg
//                                 text-lg
//                                 text-orange-100
//                             "
//                         >
//                             AI-powered matching, secure payments,
//                             face verification and real-time tracking
//                             in one nationwide platform.
//                         </p>

//                     </div>

//                     {/* Phone */}

//                     <div
//                         className="
//                             relative
//                             mt-14
//                             flex
//                             justify-center
//                         "
//                     >

//                         <ShowcasePhone />

//                     </div>

//                     {/* Features */}

//                     <div
//                         className="
//                             mt-14
//                             grid
//                             grid-cols-2
//                             gap-5
//                         "
//                     >

//                         {features.map((feature) => {

//                             const Icon = feature.icon;

//                             return (

//                                 <div
//                                     key={feature.title}
//                                     className="
//                                         flex
//                                         items-center
//                                         gap-3
//                                         rounded-2xl
//                                         border
//                                         border-white/10
//                                         bg-white/10
//                                         p-4
//                                         backdrop-blur
//                                     "
//                                 >

//                                     <div
//                                         className="
//                                             rounded-xl
//                                             bg-orange-500
//                                             p-2
//                                         "
//                                     >

//                                         <Icon size={18} />

//                                     </div>

//                                     <span>

//                                         {feature.title}

//                                     </span>

//                                 </div>

//                             );

//                         })}

//                     </div>

//                     {/* Footer */}

//                     <div
//                         className="
//                             mt-auto
//                             flex
//                             items-center
//                             gap-3
//                             pt-10
//                         "
//                     >

//                         <div
//                             className="
//                                 h-3
//                                 w-3
//                                 rounded-full
//                                 bg-emerald-400
//                                 shadow-lg
//                                 shadow-emerald-500
//                             "
//                         />

//                         <span
//                             className="
//                                 text-sm
//                                 text-orange-100
//                             "
//                         >

//                             All NARP services operational

//                         </span>

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// }