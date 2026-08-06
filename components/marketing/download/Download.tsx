// import Image from "next/image";

// import Container from "@/components/shared/Container";
// import SectionTitle from "@/components/shared/SectionTitle";

// import PhoneMockup from "../hero/PhoneMockup";

// export default function Download() {
//     return (
//         <section
//             id="download"
//             className="relative overflow-hidden py-32">

//             {/* Background */}

//             <div className="absolute inset-0 -z-10">

//                 <div className="absolute left-16 top-20 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />

//                 <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />

//             </div>

//             <Container>

//                 <SectionTitle
//                     badge="Download"
//                     title="Take NARP Everywhere"
//                     subtitle="Whether you're hiring trusted professionals or growing your own business, NARP is always just a tap away."
//                 />

//                 <div className="mt-20 grid items-center gap-20 lg:grid-cols-2">

//                     {/* LEFT */}

//                     <div>

//                         <h3 className="text-4xl font-bold text-slate-900">

//                             Everything You Need,

//                             <span className="block text-orange-500">
//                                 Right In Your Pocket
//                             </span>

//                         </h3>

//                         <p className="mt-6 text-lg leading-8 text-slate-600">

//                             Discover nearby skilled professionals, receive AI-powered
//                             recommendations, chat securely, book services, track jobs in
//                             real time, and pay safely—all from one beautiful app.

//                         </p>

//                         <div className="mt-10 space-y-5">

//                             <Feature text="Verified Professionals" />

//                             <Feature text="AI Smart Matching" />

//                             <Feature text="Secure Cashless Payments" />

//                             <Feature text="Real-Time GPS Tracking" />

//                             <Feature text="In-App Messaging" />

//                             <Feature text="Ratings & Reviews" />

//                         </div>

//                         <div className="mt-12 flex flex-wrap gap-5">

//                             <a
//                                 href="#"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                             >
//                                 <Image
//                                     src="/images/store/google-play.svg"
//                                     alt="Google Play"
//                                     width={190}
//                                     height={58}
//                                 />
//                             </a>

//                             <a
//                                 href="#"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                             >
//                                 <Image
//                                     src="/images/store/app-store.svg"
//                                     alt="App Store"
//                                     width={190}
//                                     height={58}
//                                 />
//                             </a>

//                         </div>

//                         <p className="mt-6 text-sm text-slate-500">

//                             Available on Android and iOS.

//                         </p>

//                     </div>

//                     {/* RIGHT */}

//                     <div className="relative flex justify-center">

//                         <div className="absolute h-[500px] w-[500px] rounded-full bg-orange-300/15 blur-3xl" />

//                         <PhoneMockup
//                             image="/images/app/home-screen.png"
//                             animation="float-medium"
//                             delay={0}
//                         />

//                     </div>

//                 </div>

//             </Container>

//         </section>
//     );
// }

// function Feature({
//     text,
// }: {
//     text: string;
// }) {
//     return (
//         <div className="flex items-center gap-4">

//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white font-bold">

//                 ✓

//             </div>

//             <span className="text-lg font-medium text-slate-700">

//                 {text}

//             </span>

//         </div>
//     );
// }


"use client";

import Image from "next/image";

import {
    CheckCircle2,
    ShieldCheck,
    BrainCircuit,
    MapPinned,
    Star,
    QrCode,
} from "lucide-react";

import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

import PhoneMockup from "../hero/PhoneMockup";

export default function Download() {
    return (
        <section
            id="download"
            className="relative overflow-hidden py-32"
        >
            {/* Background */}

            <div className="absolute inset-0 -z-10">

                <div className="absolute left-20 top-20 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />

                <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-blue-300/20 blur-3xl" />

            </div>

            <Container>

                <SectionTitle
                    badge="Download"
                    title="Take NARP Everywhere"
                    subtitle="Whether you're hiring trusted freelancers or growing your own business, NARP is always just a tap away."
                />

                <div className="mt-20 grid items-center gap-24 lg:grid-cols-2">

                    {/* LEFT */}

                    <div>

                        <h3 className="text-5xl font-bold leading-tight">

                            Everything You Need

                            <span className="block text-orange-500">

                                Right In Your Pocket

                            </span>

                        </h3>

                        <p className="mt-6 text-lg leading-8 text-slate-600">

                            Discover nearby freelancers, receive AI-powered recommendations,
                            chat securely, book services, track jobs in real time,
                            and pay safely—all from one beautiful app.

                        </p>

                        <div className="mt-10 grid gap-5">

                            <Feature icon={<CheckCircle2 />} text="Verified Freelancers" />

                            <Feature icon={<BrainCircuit />} text="AI Smart Matching" />

                            <Feature icon={<ShieldCheck />} text="Secure Escrow Payments" />

                            <Feature icon={<MapPinned />} text="Live GPS Tracking" />

                            <Feature icon={<CheckCircle2 />} text="In-App Messaging" />

                            <Feature icon={<Star />} text="Ratings & Reviews" />

                        </div>

                        <div className="mt-12 flex flex-wrap gap-5">

                            <StoreButton
                                image="/images/store/google-play.svg"
                                alt="Google Play"
                                className="h-14 w-auto"
                            />

                            <StoreButton
                                image="/images/store/app-store.svg"
                                alt="App Store"
                                className="h-14 w-auto"
                            />

                        </div>

                        <div className="mt-8 flex items-center gap-3">

                            <div className="flex">

                                {[...Array(5)].map((_, i) => (

                                    <Star
                                        key={i}
                                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                    />

                                ))}

                            </div>

                            <span className="text-slate-600">

                                Trusted by thousands of Filipinos

                            </span>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="relative flex justify-center">

                        {/* Glow */}

                        <div className="absolute h-[520px] w-[520px] rounded-full bg-orange-300/20 blur-3xl" />

                        <PhoneMockup
                            image="/images/app/home-screen.png"
                            animation="float-medium"
                        />

                        {/* Floating badges */}

                        <FloatingBadge
                            className="left-0 top-10"
                            icon="⭐"
                            text="4.9 Rating"
                        />

                        <FloatingBadge
                            className="-right-2 top-32"
                            icon="🤖"
                            text="AI Powered"
                        />

                        <FloatingBadge
                            className="-left-4 bottom-32"
                            icon="🛡️"
                            text="Verified"
                        />

                        <FloatingBadge
                            className="right-0 bottom-70"
                            icon="📍"
                            text="Live Tracking"
                        />

                        {/* QR */}

                        <div
                            className="
                                absolute
                                -bottom-10
                                rounded-3xl
                                border
                                bg-white
                                p-5
                                shadow-xl
                            "
                        >

                            <Image
                                src="/images/qr/narp-branded-download-qr.png"
                                alt="Scan to explore NARP"
                                width={170}
                                height={170}
                                className="mx-auto rounded-2xl"
                            />

                            <div className="mt-4 text-center">

                                <p className="font-semibold text-slate-900">
                                    Scan to Explore NARP
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Access NARP instantly from your phone.
                                </p>

                            </div>

                            {/* <div className="mt-4 text-center">

                                <h4 className="font-semibold text-slate-900">
                                    Download NARP
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Scan with your phone to continue on mobile.
                                </p>

                                <div className="mt-4 flex justify-center gap-3">

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                                        Android
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                                        iPhone
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                                        Web
                                    </span>

                                </div>

                                <div className="mt-5 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-700">
                                    Launching Soon
                                </div>

                            </div> */}

                        </div>

                    </div>

                </div>

            </Container>

        </section>
    );
}

function Feature({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <div className="flex items-center gap-4">

            <div className="text-green-500">

                {icon}

            </div>

            <span className="text-lg font-medium">

                {text}

            </span>

        </div>
    );
}

function StoreButton({
    image,
    alt,
    className,
}: {
    image: string;
    alt: string;
    className: string;
}) {
    return (
        <div className="relative">

            <Image
                src={image}
                alt={alt}
                width={190}
                height={58}
                className={className}
            />

            <div
                className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-black/50
                    text-sm
                    font-semibold
                    text-white
                    backdrop-blur-sm
                "
            >

                Coming Soon

            </div>

        </div>
    );
}

function FloatingBadge({
    icon,
    text,
    className,
}: {
    icon: string;
    text: string;
    className: string;
}) {
    return (
        <div
            className={`absolute ${className}
            rounded-full
            bg-white
            px-4
            py-2
            shadow-lg`}
        >

            {icon} {text}

        </div>
    );
}